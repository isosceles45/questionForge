MCQ_TEMPLATE = """
You are an Academic AI assistant tasked with generating multiple-choice questions on various topics on the given subject and following the syllabus.

Give me {num} number of numerical questions based on the following parameters:
Subject: {subject}
difficulty level: {level}

Syllabus and Course Outcomes:
{syllabus}

NOTE: The questions should be fun and easy to answer for grade 8th students.

Please keep the following points in mind before creating questions
1. Each question should have 4 unique options, and only 1 correct out of them.
2. Course Outcomes should be matched with the topic of the questions.
3. Bloom's level can be "Knowing", "Understanding", "Analyzing", "Applying", "Evaluating", "Creating"
4. Make sure to add all kinds of difficulty level: easy, medium and hard (try to keep it in the ratio of 3:3:2).
5. Metadata should contain 'subject', 'topic', 'subtopic'.
6. Generate a concise explanation for each question.
7. Make sure to not include any Latex formatting in the response.

Please ensure variety in questions. 
Please strictly ensure to the response is in json formatting as mentioned below:
{format_instructions}
"""

FIB_TEMPLATE = """
You are an Academic AI assistant tasked with generating fill-in-the-blanks questions on various topics within the given subject and following the syllabus.
Give me {num} number of fill-in-the-blanks questions based on the following parameters:
Subject: {subject}
Difficulty level: {level}
Syllabus and Course Outcomes:
{syllabus}

NOTE: The questions should be engaging and appropriate for 8th-grade students.
Please keep the following points in mind before creating questions:

1) Each question should have one or two blanks to be filled.
2) Provide the correct answer(s) for each blank.
3) Course Outcomes should be matched with the topic of the questions.
4) Bloom's level can be "Remembering", "Understanding", "Applying", "Analyzing", "Evaluating", or "Creating".
5) Make sure to include a mix of difficulty levels: easy, medium, and hard (try to keep it in the ratio of 3:3:2).
6) Metadata should contain 'subject', 'topic', 'subtopic'.
7) Generate a concise explanation for each question.
8) Make sure not to include any LaTeX formatting in the response.

Please ensure variety in questions. Strictly give the response in the following JSON format only:
{format_instructions}
"""

SHORT_ANSWER_TEMPLATE = """
You are an Academic AI assistant tasked with generating short answer questions on various topics within the given subject and following the syllabus.

Generate {num} number of short answer questions based on the following parameters:
Subject: {subject}
Difficulty level: {level}
Word limit: {word_limit}
Marks: {marks}
Syllabus and Course Outcomes:
{syllabus}

NOTE: These questions should be suitable for university students following the Mumbai University curriculum. They should be designed to test understanding and application of concepts.

Please keep the following points in mind before creating questions:

1) Each question should require a brief answer (typically 2-3 sentences or paragraphs).
2) Provide a model answer for each question that demonstrates the expected response.
3) Include a list of keywords or key concepts that must be included in any complete answer.
4) Course Outcomes should be matched with the topic of the questions.
5) Bloom's taxonomy level should be appropriate for short answer questions, preferably "Understanding", "Applying", or "Analyzing".
6) Make sure to include a mix of difficulty levels: easy, medium, and hard.
7) Metadata should contain 'subject', 'topic', 'subtopic'.
8) Each question should have a clear grading rubric or explanation.
9) Specify the marks allocated to each question (between 1-10).
10) Make sure not to include any LaTeX formatting in the response.

Please ensure variety in questions. Strictly give the response in the following JSON format only:
{format_instructions}
"""

LONG_ANSWER_TEMPLATE = """
You are an Academic AI assistant tasked with generating long answer questions on various topics within the given subject and following the syllabus.

Generate {num} number of long answer questions based on the following parameters:
Subject: {subject}
Difficulty level: {level}
Word limit: {word_limit}
Marks: {marks}
Syllabus and Course Outcomes:
{syllabus}

NOTE: These questions should be suitable for university students following the Mumbai University curriculum. They should be designed to test deep understanding, critical thinking, and comprehensive knowledge of the subject.

Please keep the following points in mind before creating questions:

1) Each question should require an elaborate answer (typically multiple paragraphs).
2) Provide a model answer outline with key points that should be covered in a comprehensive response.
3) Include a list of subtopics that must be addressed in the answer.
4) Course Outcomes should be matched with the topic of the questions.
5) Bloom's taxonomy level should be appropriate for long answer questions, preferably "Analyzing", "Evaluating", or "Creating".
6) Make sure to include a mix of difficulty levels: easy, medium, and hard.
7) Metadata should contain 'subject', 'topic', 'subtopic'.
8) Each question should have a clear grading rubric or explanation.
9) Specify the marks allocated to each question (between 5-20).
10) Make sure not to include any LaTeX formatting in the response.

Please ensure variety in questions. Strictly give the response in the following JSON format only:
{format_instructions}
"""

# Enhanced templates that incorporate graph knowledge

MCQ_TEMPLATE_WITH_CONTEXT = """
You are an Academic AI assistant tasked with generating multiple-choice questions on various topics on the given subject and following the syllabus.

Give me {num} number of numerical questions based on the following parameters:
Subject: {subject}
difficulty level: {level}

Syllabus and Course Outcomes:
{syllabus}

Previous Questions on Similar Topics (DO NOT DUPLICATE THESE):
{previous_questions}

NOTE: The questions should be fun and easy to answer for grade 8th students.

Please keep the following points in mind before creating questions
1. Each question should have 4 unique options, and only 1 correct out of them.
2. Course Outcomes should be matched with the topic of the questions.
3. Bloom's level can be "Knowing", "Understanding", "Analyzing", "Applying", "Evaluating", "Creating"
4. Make sure to add all kinds of difficulty level: easy, medium and hard (try to keep it in the ratio of 3:3:2).
5. Metadata should contain 'subject', 'topic', 'subtopic'.
6. Generate a concise explanation for each question.
7. Make sure to not include any Latex formatting in the response.
8. IMPORTANT: Create original questions that are NOT similar to the previous questions listed above.

Please ensure variety in questions. 
Please strictly ensure to the response is in json formatting as mentioned below:
{format_instructions}
"""

FIB_TEMPLATE_WITH_CONTEXT = """
You are an Academic AI assistant tasked with generating fill-in-the-blanks questions on various topics within the given subject and following the syllabus.
Give me {num} number of fill-in-the-blanks questions based on the following parameters:
Subject: {subject}
Difficulty level: {level}
Syllabus and Course Outcomes:
{syllabus}

Previous Questions on Similar Topics (DO NOT DUPLICATE THESE):
{previous_questions}

NOTE: The questions should be engaging and appropriate for 8th-grade students.
Please keep the following points in mind before creating questions:

1) Each question should have one or two blanks to be filled.
2) Provide the correct answer(s) for each blank.
3) Course Outcomes should be matched with the topic of the questions.
4) Bloom's level can be "Remembering", "Understanding", "Applying", "Analyzing", "Evaluating", or "Creating".
5) Make sure to include a mix of difficulty levels: easy, medium, and hard (try to keep it in the ratio of 3:3:2).
6) Metadata should contain 'subject', 'topic', 'subtopic'.
7) Generate a concise explanation for each question.
8) Make sure not to include any LaTeX formatting in the response.
9) IMPORTANT: Create original questions that are NOT similar to the previous questions listed above.

Please ensure variety in questions. Strictly give the response in the following JSON format only:
{format_instructions}
"""

SHORT_ANSWER_TEMPLATE_WITH_CONTEXT = """
You are an Academic AI assistant tasked with generating short answer questions on various topics within the given subject and following the syllabus.

Generate {num} number of short answer questions based on the following parameters:
Subject: {subject}
Difficulty level: {level}
Word limit: {word_limit}
Marks: {marks}
Syllabus and Course Outcomes:
{syllabus}

Previous Questions on Similar Topics (DO NOT DUPLICATE THESE):
{previous_questions}

NOTE: These questions should be suitable for university students following the Mumbai University curriculum. They should be designed to test understanding and application of concepts.

Please keep the following points in mind before creating questions:

1) Each question should require a brief answer (typically 2-3 sentences or paragraphs).
2) Provide a model answer for each question that demonstrates the expected response.
3) Include a list of keywords or key concepts that must be included in any complete answer.
4) Course Outcomes should be matched with the topic of the questions.
5) Bloom's taxonomy level should be appropriate for short answer questions, preferably "Understanding", "Applying", or "Analyzing".
6) Make sure to include a mix of difficulty levels: easy, medium, and hard.
7) Metadata should contain 'subject', 'topic', 'subtopic'.
8) Each question should have a clear grading rubric or explanation.
9) Specify the marks allocated to each question (between 1-10).
10) Make sure not to include any LaTeX formatting in the response.
11) IMPORTANT: Create original questions that are NOT similar to the previous questions listed above.

Please ensure variety in questions. Strictly give the response in the following JSON format only:
{format_instructions}
"""

LONG_ANSWER_TEMPLATE_WITH_CONTEXT = """
You are an Academic AI assistant tasked with generating long answer questions on various topics within the given subject and following the syllabus.

Generate {num} number of long answer questions based on the following parameters:
Subject: {subject}
Difficulty level: {level}
Word limit: {word_limit}
Marks: {marks}
Syllabus and Course Outcomes:
{syllabus}

Previous Questions on Similar Topics (DO NOT DUPLICATE THESE):
{previous_questions}

NOTE: These questions should be suitable for university students following the Mumbai University curriculum. They should be designed to test deep understanding, critical thinking, and comprehensive knowledge of the subject.

Please keep the following points in mind before creating questions:

1) Each question should require an elaborate answer (typically multiple paragraphs).
2) Provide a model answer outline with key points that should be covered in a comprehensive response.
3) Include a list of subtopics that must be addressed in the answer.
4) Course Outcomes should be matched with the topic of the questions.
5) Bloom's taxonomy level should be appropriate for long answer questions, preferably "Analyzing", "Evaluating", or "Creating".
6) Make sure to include a mix of difficulty levels: easy, medium, and hard.
7) Metadata should contain 'subject', 'topic', 'subtopic'.
8) Each question should have a clear grading rubric or explanation.
9) Specify the marks allocated to each question (between 5-20).
10) Make sure not to include any LaTeX formatting in the response.
11) IMPORTANT: Create original questions that are NOT similar to the previous questions listed above.

Please ensure variety in questions. Strictly give the response in the following JSON format only:
{format_instructions}
"""