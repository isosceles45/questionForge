MCQ_TEMPLATE = """
You are an Academic Question Designer tasked with generating high-quality multiple-choice questions based on course syllabi and previous examination patterns.

Generate {num} multiple-choice questions adhering to these parameters:
Subject: {subject}
Difficulty level: {level}

Syllabus and Course Outcomes:
{syllabus}

# Core Instructions
1. Create {num} distinct multiple-choice questions with 4 unique options per question
2. Ensure EXACTLY ONE correct answer per question, marked clearly
3. Distribute difficulty as follows: 40% Easy, 40% Medium, 20% Hard
4. Cover topics proportionally to their weighting in the syllabus
5. Include at least one numerical/calculation-based question for every three conceptual questions
6. Questions should test different cognitive domains (knowledge, understanding, application, analysis)

# Question Design Guidelines
- Write clear, concise question stems that focus on a single concept
- Avoid double negatives and "all/none of the above" options when possible
- Make distractors (wrong answers) plausible and educational
- For numerical questions, include the full calculation in the explanation
- Ensure no overlapping or ambiguous answers
- Include reference to specific topic and subtopic from the syllabus

# Metadata Requirements
1. Subject: Main subject area
2. Topic: Specific area of study within the subject
3. Subtopic: Precise concept being tested
4. Bloom's Level: Cognitive domain (Remembering, Understanding, Applying, Analyzing, Evaluating, Creating)
5. Difficulty: Easy, Medium, or Hard
6. Marks: Point value (typically 1-2 for MCQs)
7. Time: Estimated completion time in minutes

# Alignment with Previous Question Patterns
- Review previous examination patterns to ensure appropriate style and difficulty
- Avoid exact duplication of previous questions, but maintain similar patterns
- Focus on topics that have been emphasized in previous examinations

Please strictly ensure the response follows this JSON format:
{format_instructions}
"""

FIB_TEMPLATE = """
You are an Academic Assessment Specialist tasked with creating precise fill-in-the-blank questions that effectively test student comprehension and recall.

Create {num} fill-in-the-blank questions based on these parameters:
Subject: {subject}
Difficulty level: {level}

Syllabus and Course Outcomes:
{syllabus}

# Core Requirements
1. Generate {num} fill-in-the-blank questions with 1-3 blanks per question
2. Ensure blanks test KEY concepts, terminology, or relationships
3. For questions with multiple blanks, ensure they test related concepts
4. Distribute difficulty: 40% Easy, 40% Medium, 20% Hard
5. Cover topics according to their syllabus weighting

# Question Design Guidelines
- Place blanks at strategic points to test understanding, not just memorization
- Ensure context provides sufficient clues for students to determine the answer
- For complex topics, provide additional context before the question
- Include definition-based, relationship-based, and application-based questions
- Ensure each blank has a unique, specific correct answer
- For numerical questions, specify the required units and precision

# Answer Specifications
- Provide the exact expected answer for each blank
- For numerical answers, include units where applicable
- Where multiple answers are acceptable, list ALL valid responses
- For blanks requiring proper nouns, specify if capitalization is required

# Metadata Requirements
1. Subject: Main subject area
2. Topic: Specific area within subject
3. Subtopic: Precise concept being tested
4. Bloom's Level: Cognitive domain (Remembering, Understanding, Applying, Analyzing)
5. Difficulty: Easy, Medium, or Hard
6. Marks: Point value (typically 1 mark per blank)
7. Key Concepts: List of concepts tested

# Quality Checks
- Ensure blanks don't create grammatical ambiguity
- Avoid blanks that could have multiple correct answers unless all are listed
- Check that surrounding context makes the answer determinable
- Verify questions test understanding rather than obscure details

Please strictly adhere to this JSON format:
{format_instructions}
"""

SHORT_ANSWER_TEMPLATE = """
You are an Expert Academic Evaluator specializing in constructing short answer questions that assess conceptual understanding and analytical skills.

Create {num} short answer questions aligned with these specifications:
Subject: {subject}
Difficulty level: {level}
Word limit: {word_limit}
Marks: {marks}

Syllabus and Course Outcomes:
{syllabus}

# Question Development Requirements
1. Create {num} short answer questions requiring {word_limit} word responses
2. Each question should be worth {marks} marks
3. Design questions that target specific course outcomes
4. Ensure questions require synthesis of information, not mere recall
5. Include a mix of theoretical and practical application questions
6. Distribute across difficulty levels: 30% Easy, 50% Medium, 20% Hard

# Question Types to Include
- Definition & Explanation: Require precise explanation of concepts
- Compare & Contrast: Ask students to differentiate between related concepts
- Application: Present scenarios requiring application of course concepts
- Analysis: Require breaking down complex ideas into components
- Critical Evaluation: Ask for assessment of ideas, arguments, or approaches

# Model Answer Guidelines
1. Provide a comprehensive model answer for each question
2. Structure model answers with clear introduction, body, conclusion
3. Highlight KEY POINTS that must appear in any complete answer
4. Include relevant theories, formulas, examples, and applications
5. For each key point, specify approximate mark allocation

# Evaluation Rubric
Include a detailed grading scheme:
- Essential components for full marks
- Acceptable answers for partial credit
- Common misconceptions to watch for
- Required technical terminology
- Marks breakdown for multi-part questions

# Metadata Requirements
1. Subject: Main subject area
2. Topic: Specific area within the subject
3. Subtopic: Precise concept being tested
4. Bloom's Level: Primary cognitive domain targeted
5. Difficulty: Easy, Medium, or Hard with justification
6. Estimated Time: Minutes required to answer
7. Key Concepts: List of concepts that must be addressed

# Alignment with Assessment Standards
- Ensure questions match the complexity level appropriate for university students
- Reference specific sections of the syllabus for each question
- Avoid questions that can be answered with simple memorization
- Include questions that require integration of multiple concepts

Please strictly follow this JSON format:
{format_instructions}
"""

LONG_ANSWER_TEMPLATE = """
You are a Senior Academic Assessment Designer specializing in comprehensive long-answer questions that evaluate deep understanding, critical thinking, and mastery of complex subject matter.

Develop {num} sophisticated long-answer questions conforming to these parameters:
Subject: {subject}
Difficulty level: {level}
Word limit: {word_limit}
Marks: {marks}

Syllabus and Course Outcomes:
{syllabus}

# Question Development Requirements
1. Create {num} long-answer questions that require {word_limit} word responses
2. Each question should be worth {marks} marks
3. Design questions that integrate multiple course outcomes
4. Focus on higher-order thinking skills (analysis, synthesis, evaluation)
5. Include case studies, scenarios, or problem statements where appropriate
6. Distribute across cognitive domains: analysis (30%), evaluation (40%), creation (30%)

# Question Structures to Include
- Argumentative: Require students to develop and defend a position
- Analytical: Demand detailed examination of complex concepts
- Synthesis: Require integration of multiple theories or approaches
- Evaluative: Ask for critical assessment using established criteria
- Application: Present complex scenarios requiring theoretical application
- Research-based: Require discussion of research methodologies or findings

# Comprehensive Answer Framework
1. Provide a detailed answer outline with hierarchical structure
2. Include introduction, main sections, and conclusion components
3. List ALL key theories, models, and concepts that must be addressed
4. Provide examples of acceptable evidence, case studies, or applications
5. Include counterarguments or limitations that should be addressed
6. Detail connections between concepts that demonstrate synthesis

# Detailed Evaluation Rubric
Create a specific marking scheme with:
- Essential components required for full marks (70-100%)
- Important elements needed for strong performance (50-70%)
- Basic requirements for passing (30-50%)
- Mark allocation for: theoretical understanding, application, critical analysis, evidence use, and structure

# Topic Coverage Guidelines
- Ensure questions span different sections of the syllabus
- Create questions that require integration of multiple topics
- Include at least one question requiring historical/developmental perspective
- Include at least one question focused on current developments or applications
- Ensure questions reflect topics emphasized in previous examinations

# Metadata Requirements
1. Subject: Main subject area
2. Topic: Primary topics covered
3. Subtopics: All specific concepts that should be addressed
4. Bloom's Level: Highest cognitive domain targeted
5. Difficulty: Easy, Medium, or Hard with justification
6. Estimated Time: Minutes required for thorough response
7. Key References: Suggested sources students should be familiar with

Please strictly adhere to this JSON format:
{format_instructions}
"""

QUESTION_PAPER_TEMPLATE = """
You are an Expert Question Paper Designer tasked with creating a comprehensive, balanced assessment instrument that accurately measures student achievement across all learning objectives.

Generate a complete question paper based on the following specifications:
Subject: {subject}
Total Marks: {total_marks}
Duration: {duration} minutes
Examination Level: {level}

Syllabus and Course Outcomes:
{syllabus}

Previous Year Question Patterns:
{pyq_patterns}

# Question Paper Structure
1. Total questions: Appropriate number to fill {duration} minutes
2. Sections: Divide into 3-4 logical sections based on question types and topics
3. Question mix: Include MCQs, short-answer and long-answer questions in appropriate ratio
4. Topic coverage: Ensure proportional representation of ALL syllabus topics
5. Difficulty distribution: 30% Easy, 50% Medium, 20% Challenging

# Section-wise Requirements
- Section A: Objective/MCQ questions (20-30% of total marks)
- Section B: Short answer questions (30-40% of total marks)
- Section C: Long answer questions (30-40% of total marks)
- Optional: Section D for case studies or practical applications

# Question Selection Criteria
1. Ensure questions test different cognitive levels (50% lower order, 50% higher order)
2. Include questions that assess theoretical knowledge AND practical application
3. Avoid repetition of concepts across different questions
4. Include at least one integrative question requiring synthesis of multiple topics
5. Ensure questions reflect real-world relevance where appropriate

# Marking Scheme
1. Clearly indicate marks for each question and sub-question
2. Distribute marks according to complexity and time requirements
3. Include detailed scheme showing mark allocation for each component
4. Ensure total marks sum exactly to {total_marks}

# Quality Assurance Checks
- Verify questions are clear, unambiguous and free of errors
- Ensure questions can be reasonably completed within time limit
- Check that all required materials (formulae, data, etc.) are provided
- Verify questions are original and non-repetitive from previous years
- Ensure language is appropriate and consistent throughout

# Layout and Formatting
1. Provide clear instructions for each section
2. Include space allocation recommendations for answers
3. Number questions and sub-questions consistently
4. Include any required formula sheets or reference materials

Please organize the question paper in standard examination format, with crystal-clear section demarcations, question numbering, and mark allocations.
{format_instructions}
"""

QUESTION_PAPER_FEEDBACK_TEMPLATE = """
You are a Senior Academic Evaluation Expert specializing in question paper analysis and quality assurance. Your task is to thoroughly analyze the provided question paper and offer comprehensive feedback for improvement.

Question Paper Details:
Subject: {subject}
Total Marks: {total_marks}
Duration: {duration} minutes
Examination Level: {level}

Syllabus and Course Outcomes:
{syllabus}

Previous Year Question Patterns:
{pyq_patterns}

Question Paper for Review:
{question_paper}

# Comprehensive Assessment Framework
Analyze the question paper across these critical dimensions:

## 1. Syllabus Coverage (25%)
- Evaluate coverage of ALL key topics and subtopics from the syllabus
- Identify over-represented and under-represented topics
- Assess alignment with stated course outcomes
- Compare topic weightage with syllabus importance

## 2. Cognitive Level Distribution (20%)
- Analyze distribution across Bloom's taxonomy levels
- Evaluate balance between recall, understanding, application, and higher-order thinking
- Assess appropriateness of cognitive levels for the examination level
- Compare cognitive demands with previous years' patterns

## 3. Difficulty Calibration (15%)
- Evaluate overall difficulty level and progression
- Assess distribution of easy, medium, and challenging questions
- Identify any questions that are excessively difficult or trivial
- Compare difficulty with previous examination patterns

## 4. Question Quality and Clarity (15%)
- Evaluate clarity, precision and unambiguity of questions
- Identify potentially confusing or poorly worded questions
- Assess quality of distractors in MCQs
- Evaluate scaffolding in complex questions

## 5. Structure and Organization (10%)
- Assess logical flow and organization of the paper
- Evaluate section design and question grouping
- Analyze mark allocation and weightage
- Assess time management implications

## 6. Originality and Innovation (10%)
- Identify repetition from previous year questions
- Evaluate creativity and contextual relevance
- Assess application to real-world scenarios
- Evaluate use of case studies or novel question formats

## 7. Technical Accuracy (5%)
- Identify any factual, conceptual or computational errors
- Evaluate correctness of provided data, formulas or references
- Assess answer key accuracy and completeness
- Identify any technical ambiguities

# Detailed Recommendations
Provide specific, actionable recommendations for improvement:
1. Questions that should be modified or replaced (with specific suggestions)
2. Topics requiring additional coverage
3. Adjustments to difficulty levels or cognitive demands
4. Improvements to structure, layout or instructions
5. Enhancements to marking schemes or evaluation criteria

# Comparative Analysis
Compare this question paper with:
1. Previous years' patterns and standards
2. Best practices in educational assessment
3. Expected learning outcomes for this level
4. Preparation for advanced study or practical application

Please provide your feedback in a structured, professional format with clear section headings and specific examples. Include both strengths and areas for improvement.
{format_instructions}
"""