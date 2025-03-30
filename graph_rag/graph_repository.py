from .database import get_db
from uuid import uuid4

class GraphRepository:
    def __init__(self):
        self.db = get_db()

    def create_user_if_not_exists(self, email):
        """Create user node if it doesn't exist"""
        with self.db.driver.session() as session:
            return session.execute_write(self._create_user_tx, email)

    def _create_user_tx(self, tx, email):
        query = """
        MERGE (u:User {email: $email})
        ON CREATE SET u.created_at = datetime()
        RETURN u.email as email
        """
        result = tx.run(query, email=email)
        return result.single()["email"]

    def save_syllabus(self, email, name, subject, description=None):
        """Save syllabus and connect to user"""
        with self.db.driver.session() as session:
            result = session.execute_write(
                self._save_syllabus_tx, email, name, subject, description
            )
            return {
                "status": "success",
                "message": "Syllabus saved successfully",
                "data": {"syllabus_id": result}
            }

    def _save_syllabus_tx(self, tx, email, name, subject, description):
        # Create or get user node
        self._create_user_tx(tx, email)

        # Create syllabus node
        syllabus_id = str(uuid4())

        query = """
        CREATE (s:Syllabus {
            id: $id,
            name: $name,
            subject: $subject,
            description: $description,
            created_at: datetime(),
            updated_at: datetime()
        })
        WITH s
        MATCH (u:User {email: $email})
        CREATE (u)-[:OWNS]->(s)
        RETURN s.id as syllabus_id
        """

        result = tx.run(
            query,
            id=syllabus_id,
            name=name,
            subject=subject,
            description=description or "",
            email=email
        )

        return result.single()["syllabus_id"]

    def add_topic(self, syllabus_id, module_number, module_name, topic_data, parent_topic_id=None):
        """Add a topic to a syllabus or as a subtopic of another topic"""
        with self.db.driver.session() as session:
            result = session.execute_write(
                self._add_topic_tx, syllabus_id, module_number, module_name, topic_data, parent_topic_id
            )
            return {
                "status": "success",
                "message": "Topic added successfully",
                "data": {"topic_id": result}
            }

    def _add_topic_tx(self, tx, syllabus_id, module_number, module_name, topic_data, parent_topic_id):
        topic_id = str(uuid4())

        # Create topic node
        query = """
        CREATE (t:Topic {
            id: $id,
            module_number: $module_number,
            module_name: $module_name,
            topic_number: $topic_number,
            name: $name,
            description: $description,
            hours: $hours,
            created_at: datetime()
        })
        RETURN t.id as topic_id
        """

        result = tx.run(
            query,
            id=topic_id,
            module_number=module_number,
            module_name=module_name,
            topic_number=topic_data.get("topic_number", ""),
            name=topic_data["name"],
            description=topic_data.get("description", ""),
            hours=topic_data.get("hours", 0)
        )

        topic_id = result.single()["topic_id"]

        # Link to syllabus
        if syllabus_id:
            syllabus_link_query = """
            MATCH (s:Syllabus {id: $syllabus_id})
            MATCH (t:Topic {id: $topic_id})
            CREATE (s)-[:CONTAINS]->(t)
            """
            tx.run(syllabus_link_query, syllabus_id=syllabus_id, topic_id=topic_id)

        # Link to parent topic if provided
        if parent_topic_id:
            parent_link_query = """
            MATCH (parent:Topic {id: $parent_id})
            MATCH (child:Topic {id: $child_id})
            CREATE (parent)-[:HAS_SUBTOPIC]->(child)
            """
            tx.run(parent_link_query, parent_id=parent_topic_id, child_id=topic_id)

        return topic_id

    def save_pyq(self, email, title, subject, year, exam_type, description=None):
        """Save past year paper metadata and connect to user"""
        with self.db.driver.session() as session:
            result = session.execute_write(
                self._save_pyq_tx, email, title, subject, year, exam_type, description
            )
            return {
                "status": "success",
                "message": "PYQ paper created successfully",
                "data": {"pyq_id": result}
            }

    def _save_pyq_tx(self, tx, email, title, subject, year, exam_type, description):
        # Create or get user node
        self._create_user_tx(tx, email)

        # Create PYQ node
        pyq_id = str(uuid4())

        query = """
        CREATE (p:PYQ {
            id: $id,
            title: $title,
            subject: $subject,
            year: $year,
            exam_type: $exam_type,
            description: $description,
            created_at: datetime()
        })
        WITH p
        MATCH (u:User {email: $email})
        CREATE (u)-[:OWNS]->(p)
        RETURN p.id as pyq_id
        """

        result = tx.run(
            query,
            id=pyq_id,
            title=title,
            subject=subject,
            year=year,
            exam_type=exam_type,
            description=description or "",
            email=email
        )

        return result.single()["pyq_id"]

    def add_question_to_pyq(self, pyq_id, question_text, answer, question_type, marks, topics=None):
        """Add a question to a PYQ and link to topics if provided"""
        with self.db.driver.session() as session:
            result = session.execute_write(
                self._add_question_tx, pyq_id, question_text, answer, question_type, marks, topics
            )
            return {
                "status": "success",
                "message": "Question added successfully",
                "data": {"question_id": result}
            }

    def _add_question_tx(self, tx, pyq_id, question_text, answer, question_type, marks, topics):
        question_id = str(uuid4())

        # Create question node
        query = """
        CREATE (q:Question {
            id: $id,
            text: $text,
            answer: $answer,
            question_type: $question_type,
            marks: $marks,
            created_at: datetime()
        })
        WITH q
        MATCH (p:PYQ {id: $pyq_id})
        CREATE (p)-[:CONTAINS]->(q)
        RETURN q.id as question_id
        """

        result = tx.run(
            query,
            id=question_id,
            text=question_text,
            answer=answer,
            question_type=question_type,
            marks=marks,
            pyq_id=pyq_id
        )

        question_id = result.single()["question_id"]

        # Link to topics if provided
        if topics and len(topics) > 0:
            for topic_id in topics:
                link_query = """
                MATCH (q:Question {id: $question_id})
                MATCH (t:Topic {id: $topic_id})
                CREATE (q)-[:RELATES_TO]->(t)
                """
                tx.run(link_query, question_id=question_id, topic_id=topic_id)

        return question_id

    def get_user_syllabi(self, email):
        """Get all syllabi for a user"""
        with self.db.driver.session() as session:
            result = session.execute_read(self._get_user_syllabi_tx, email)
            return {
                "status": "success",
                "message": f"Retrieved {len(result)} syllabi",
                "data": result
            }

    def _get_user_syllabi_tx(self, tx, email):
        query = """
        MATCH (u:User {email: $email})-[:OWNS]->(s:Syllabus)
        RETURN s.id as id, s.name as name, s.subject as subject, 
               s.description as description, s.created_at as created_at
        ORDER BY s.created_at DESC
        """

        result = tx.run(query, email=email)
        return [dict(record) for record in result]

    def get_user_pyqs(self, email):
        """Get all past year papers for a user"""
        with self.db.driver.session() as session:
            result = session.execute_read(self._get_user_pyqs_tx, email)
            return {
                "status": "success",
                "message": f"Retrieved {len(result)} past year papers",
                "data": result
            }

    def _get_user_pyqs_tx(self, tx, email):
        query = """
        MATCH (u:User {email: $email})-[:OWNS]->(p:PYQ)
        RETURN p.id as id, p.title as title, p.subject as subject,
               p.year as year, p.exam_type as exam_type, 
               p.description as description, p.created_at as created_at
        ORDER BY p.created_at DESC
        """

        result = tx.run(query, email=email)
        return [dict(record) for record in result]

    def get_syllabus_topics(self, syllabus_id):
        """Get all topics for a syllabus"""
        with self.db.driver.session() as session:
            result = session.execute_read(self._get_syllabus_topics_tx, syllabus_id)
            return {
                "status": "success",
                "message": f"Retrieved {len(result)} topics",
                "data": result
            }

    def _get_syllabus_topics_tx(self, tx, syllabus_id):
        query = """
        MATCH (s:Syllabus {id: $syllabus_id})-[:CONTAINS]->(t:Topic)
        OPTIONAL MATCH (t)-[:HAS_SUBTOPIC*]->(sub:Topic)
        WITH t, collect(distinct sub) as subtopics
        RETURN t.id as id, t.module_number as module_number, 
               t.module_name as module_name, t.topic_number as topic_number,
               t.name as name, t.description as description, 
               t.hours as hours, size(subtopics) as subtopic_count
        ORDER BY t.module_number, t.topic_number
        """

        result = tx.run(query, syllabus_id=syllabus_id)
        return [dict(record) for record in result]

    def get_pyq_questions(self, pyq_id):
        """Get all questions for a PYQ"""
        with self.db.driver.session() as session:
            result = session.execute_read(self._get_pyq_questions_tx, pyq_id)
            return {
                "status": "success",
                "message": f"Retrieved {len(result)} questions",
                "data": result
            }

    def _get_pyq_questions_tx(self, tx, pyq_id):
        query = """
        MATCH (p:PYQ {id: $pyq_id})-[:CONTAINS]->(q:Question)
        OPTIONAL MATCH (q)-[:RELATES_TO]->(t:Topic)
        WITH q, collect(distinct {id: t.id, name: t.name}) as topics
        RETURN q.id as id, q.text as text, q.answer as answer,
               q.question_type as question_type, q.marks as marks,
               topics
        ORDER BY q.created_at
        """

        result = tx.run(query, pyq_id=pyq_id)
        return [dict(record) for record in result]

    def find_questions_by_topic(self, topic_id, question_type=None):
        """Find questions related to a specific topic"""
        with self.db.driver.session() as session:
            result = session.execute_read(self._find_questions_by_topic_tx, topic_id, question_type)
            return {
                "status": "success",
                "message": f"Found {len(result)} questions",
                "data": result
            }

    def _find_questions_by_topic_tx(self, tx, topic_id, question_type):
        # Base query
        query = """
        MATCH (t:Topic {id: $topic_id})<-[:RELATES_TO]-(q:Question)
        """

        # Add filter for question type if provided
        if question_type:
            query += "WHERE q.question_type = $question_type "

        # Complete the query
        query += """
        RETURN q.id as id, q.text as text, q.answer as answer,
               q.question_type as question_type, q.marks as marks
        """

        params = {"topic_id": topic_id}
        if question_type:
            params["question_type"] = question_type

        result = tx.run(query, **params)
        return [dict(record) for record in result]

    def import_syllabus_from_structured_data(self, email, syllabus_data):
        """Import a complete syllabus structure from structured data"""
        with self.db.driver.session() as session:
            syllabus_id = session.execute_write(
                self._import_syllabus_tx,
                email,
                syllabus_data
            )

            return {
                "status": "success",
                "message": "Syllabus imported successfully",
                "data": {"syllabus_id": syllabus_id}
            }

    def _import_syllabus_tx(self, tx, email, syllabus_data):
        # Create user if not exists
        self._create_user_tx(tx, email)

        # Create syllabus
        syllabus_id = str(uuid4())
        tx.run("""
            MATCH (u:User {email: $email})
            CREATE (s:Syllabus {
                id: $id,
                name: $name,
                subject: $subject,
                description: $description,
                created_at: datetime(),
                updated_at: datetime()
            })
            CREATE (u)-[:OWNS]->(s)
        """,
               email=email,
               id=syllabus_id,
               name=syllabus_data.get("name", "Untitled Syllabus"),
               subject=syllabus_data.get("subject", ""),
               description=syllabus_data.get("description", "")
               )

        # Process modules
        if "modules" in syllabus_data:
            for module in syllabus_data["modules"]:
                module_id = str(uuid4())
                module_number = module.get("number", "")
                module_name = module.get("name", "")

                # Create module node
                tx.run("""
                    CREATE (t:Topic {
                        id: $id,
                        module_number: $module_number,
                        module_name: $module_name,
                        name: $name,
                        description: $description,
                        hours: $hours,
                        is_module: true,
                        created_at: datetime()
                    })
                    WITH t
                    MATCH (s:Syllabus {id: $syllabus_id})
                    CREATE (s)-[:CONTAINS]->(t)
                """,
                       id=module_id,
                       module_number=module_number,
                       module_name=module_name,
                       name=module_name,
                       description=module.get("description", ""),
                       hours=module.get("hours", 0),
                       syllabus_id=syllabus_id
                       )

                # Process topics within module
                if "topics" in module:
                    for topic in module["topics"]:
                        topic_id = str(uuid4())

                        tx.run("""
                            CREATE (t:Topic {
                                id: $id,
                                module_number: $module_number,
                                module_name: $module_name,
                                topic_number: $topic_number,
                                name: $name,
                                description: $description,
                                created_at: datetime()
                            })
                            WITH t
                            MATCH (parent:Topic {id: $parent_id})
                            CREATE (parent)-[:HAS_SUBTOPIC]->(t)
                        """,
                               id=topic_id,
                               module_number=module_number,
                               module_name=module_name,
                               topic_number=topic.get("number", ""),
                               name=topic.get("name", ""),
                               description=topic.get("description", ""),
                               parent_id=module_id
                               )

                        # Process subtopics if any
                        if "subtopics" in topic:
                            for subtopic in topic["subtopics"]:
                                subtopic_id = str(uuid4())

                                tx.run("""
                                    CREATE (t:Topic {
                                        id: $id,
                                        module_number: $module_number,
                                        module_name: $module_name,
                                        topic_number: $topic_number,
                                        subtopic_number: $subtopic_number,
                                        name: $name,
                                        description: $description,
                                        created_at: datetime()
                                    })
                                    WITH t
                                    MATCH (parent:Topic {id: $parent_id})
                                    CREATE (parent)-[:HAS_SUBTOPIC]->(t)
                                """,
                                       id=subtopic_id,
                                       module_number=module_number,
                                       module_name=module_name,
                                       topic_number=topic.get("number", ""),
                                       subtopic_number=subtopic.get("number", ""),
                                       name=subtopic.get("name", ""),
                                       description=subtopic.get("description", ""),
                                       parent_id=topic_id
                                       )

        return syllabus_id