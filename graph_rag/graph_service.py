from .graph_repository import GraphRepository

class GraphService:
    def __init__(self):
        self.repo = GraphRepository()

    async def get_questions_context(self, topic_ids=None, question_type=None, max_examples=5):
        """Get context for question generation including previous examples"""
        context = {
            "syllabus_text": "",
            "example_questions": []
        }

        if topic_ids:
            # Get topic details
            topic_texts = []
            for topic_id in topic_ids:
                topic = self.repo.get_topic_by_id(topic_id)
                if topic:
                    module_name = topic.get("module_name", "")
                    topic_name = topic.get("name", "")
                    description = topic.get("description", "")
                    topic_texts.append(f"Module: {module_name}\nTopic: {topic_name}\nDescription: {description}\n")

            context["syllabus_text"] = "\n".join(topic_texts)

            # Get existing questions for these topics
            for topic_id in topic_ids:
                questions_result = self.repo.find_questions_by_topic(topic_id, question_type)
                questions = questions_result["data"]

                # Add questions to context
                for question in questions[:max_examples]:  # Limit examples per topic
                    if question not in context["example_questions"]:  # Avoid duplicates
                        context["example_questions"].append(question)

                # If we have enough examples, stop
                if len(context["example_questions"]) >= max_examples:
                    break

        return context

    async def check_question_uniqueness(self, question_text, question_type=None):
        """Check if a question is unique or similar to existing ones"""
        similar_questions = self.repo.find_similar_questions(
            question_text=question_text,
            question_type=question_type,
            similarity_threshold=0.7
        )

        is_unique = len(similar_questions["data"]) == 0

        return {
            "is_unique": is_unique,
            "similar_questions": similar_questions["data"],
            "similarity_threshold": 0.7
        }

    async def evaluate_paper(self, syllabus_id, paper_id):
        """Evaluate a question paper against a syllabus"""
        # Get coverage statistics
        coverage = self.repo.evaluate_paper_coverage(syllabus_id, paper_id)

        # Get question type distribution
        question_distribution = await self._get_question_distribution(paper_id)

        # Check for question balance
        is_balanced = (
                question_distribution.get("short", 0) == 6 and
                question_distribution.get("long", 0) == 4
        )

        return {
            "paper_id": paper_id,
            "syllabus_id": syllabus_id,
            "coverage": coverage["data"],
            "question_distribution": question_distribution,
            "is_balanced": is_balanced,
            "evaluation_score": self._calculate_evaluation_score(
                coverage["data"]["coverage_percentage"],
                is_balanced
            )
        }

    async def _get_question_distribution(self, paper_id):
        """Get the distribution of question types in a paper"""
        questions_result = self.repo.get_pyq_questions(paper_id)
        questions = questions_result["data"]

        distribution = {}
        for question in questions:
            q_type = question.get("question_type", "unknown")
            if q_type not in distribution:
                distribution[q_type] = 0
            distribution[q_type] += 1

        return distribution

    def _calculate_evaluation_score(self, coverage_percentage, is_balanced):
        """Calculate an overall evaluation score for the paper"""
        # Simple scoring model: 70% coverage, 30% balance
        coverage_score = coverage_percentage * 0.7
        balance_score = 30 if is_balanced else 0

        return coverage_score + balance_score

    async def get_syllabus_context(self, syllabus_id=None, topic_ids=None):
        """Retrieve syllabus context to use as knowledge base for question generation"""
        context = {}

        if syllabus_id:
            # Get all topics in the syllabus
            topics_result = self.repo.get_syllabus_topics(syllabus_id)
            topics = topics_result["data"]

            # Format them as a structured syllabus
            modules = {}
            for topic in topics:
                module_number = topic.get("module_number", "0")
                if module_number not in modules:
                    modules[module_number] = {
                        "name": topic.get("module_name", ""),
                        "topics": []
                    }

                modules[module_number]["topics"].append({
                    "id": topic.get("id", ""),
                    "name": topic.get("name", ""),
                    "description": topic.get("description", "")
                })

            # Format as structured text
            syllabus_text = ""
            for module_number, module in sorted(modules.items()):
                syllabus_text += f"Module {module_number}: {module['name']}\n"
                for topic in module["topics"]:
                    syllabus_text += f"- {topic['name']}: {topic['description']}\n"
                syllabus_text += "\n"

            context["syllabus_text"] = syllabus_text

        if topic_ids:
            context["topics"] = []
            context["example_questions"] = []

            for topic_id in topic_ids:
                # Get topic details
                topic = self.repo.get_topic_by_id(topic_id)
                if topic:
                    context["topics"].append(topic)

                # Get example questions for this topic
                questions_result = self.repo.find_questions_by_topic(topic_id)
                context["example_questions"].extend(questions_result["data"])

        return context