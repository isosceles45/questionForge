import os
import asyncio
import time
import aiofiles
from pathlib import Path
from openai import AsyncOpenAI
import pdfplumber  # Add this line
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize variables
api_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(api_key=api_key)

# Define paths
INPUT_DIR_SYLLABUS = "input/Syllabus"
INPUT_DIR_PYQ = "./Input/PreviousQuestionPapers"
OUTPUT_DIR = "./Output/Processed"

# Ensure output directories exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Updated prompt for processing Syllabus as text
SYLLABUS_PROMPT = """
# Task
You are an expert education analyst extracting structured information from a course Syllabus. Your task is to identify and extract the hierarchical structure of topics and subtopics from this Syllabus document.

## Instructions
- Carefully read the provided Syllabus document
- Extract the hierarchical structure of topics and subtopics
- Preserve ALL original organization, numbering schemes, and formatting
- Include EVERY detail about each topic - do not summarize or omit information
- Preserve all learning objectives or outcomes associated with topics
- Include all reference books, materials, or resources mentioned
- DO NOT miss any detail from the original document, no matter how minor it seems

## Response Format
Respond with a clear, structured text format:

SUBJECT: [Course name and code]
DESCRIPTION: [Full course description]

TOPICS:
1. [Topic Title]
   Description: [Complete topic description with all details]
   Learning Objectives: [All learning objectives for this topic]
   
   Subtopics:
   1.1 [Subtopic Title]
       [Full subtopic description with all details]
   1.2 [Subtopic Title]
       [Full subtopic description with all details]
   ...

2. [Topic Title]
   ...

REFERENCES:
- [Reference 1]
- [Reference 2]
...

## Important Note
Do not summarize or condense information. Include EVERY detail from the original document.
"""

# Updated prompt for processing previous year questions as text
PYQ_PROMPT = """
# Task
You are an expert education analyst extracting questions from previous year question papers. Your task is to identify each question and classify it according to its topic and subtopic in the course Syllabus.

## Instructions
- Carefully read the provided question paper
- Extract each question COMPLETELY, preserving all parts, sub-questions, and marks allocation
- Include ALL text formatting, numbering, and special instructions from the original
- Identify the most likely topic and subtopic from the Syllabus that each question relates to
- Note the difficulty level, cognitive domain (knowledge, comprehension, application, analysis, etc.), and marks allocated
- Do not omit ANY part of the question, including diagrams (describe them), formulas, or instructions

## Response Format
Respond with a clearly structured text format:

EXAM DETAILS:
Year: [YEAR]
Semester: [SEMESTER]
Subject: [SUBJECT_NAME]
Total Marks: [TOTAL_MARKS]
Duration: [DURATION]

QUESTIONS:
---------------------
Question 1: [COMPLETE question text with ALL formatting preserved]
Topic: [Related Topic]
Subtopic: [Related Subtopic]
Marks: [Marks]
Difficulty: [Easy/Medium/Hard]
Cognitive Level: [Knowledge/Comprehension/Application/Analysis/etc.]
Question Type: [Short Answer/Long Answer/MCQ/etc.]
---------------------

Question 2: [COMPLETE question text with ALL formatting preserved]
...

## Important Note
The extraction must be EXHAUSTIVE and COMPLETE. Don't miss any detail, instruction, or part of any question.
"""

async def extract_text_from_pdf(pdf_path):
    """Extract text from PDF page by page"""
    full_text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            full_text += page.extract_text() + "\n\n"
    return full_text

async def process_syllabus(file_path, semaphore):
    """Process a Syllabus document"""
    async with semaphore:
        try:
            # Extract text from file (PDF or TXT)
            if file_path.lower().endswith('.pdf'):
                document_text = await extract_text_from_pdf(file_path)
            else:
                async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
                    document_text = await f.read()

            # Process with LLM
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": SYLLABUS_PROMPT},
                    {"role": "user", "content": document_text}
                ]
            )
            result = response.choices[0].message.content

            # Save output as text file
            filename = os.path.basename(file_path)
            output_file = os.path.join(OUTPUT_DIR, f"{os.path.splitext(filename)[0]}_syllabus.txt")

            async with aiofiles.open(output_file, "w", encoding="utf-8") as out_file:
                await out_file.write(result)

            print(f"✓ Processed Syllabus: {filename}")
            return output_file

        except Exception as e:
            print(f"✗ Error processing Syllabus {file_path}: {str(e)}")
            return f"Error: {str(e)}"

async def process_pyq(file_path, semaphore):
    """Process a previous year question paper"""
    async with semaphore:
        try:
            # Extract text from file (PDF or TXT)
            if file_path.lower().endswith('.pdf'):
                document_text = await extract_text_from_pdf(file_path)
            else:
                async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
                    document_text = await f.read()

            # Process with LLM
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": PYQ_PROMPT},
                    {"role": "user", "content": document_text}
                ]
            )
            result = response.choices[0].message.content

            # Save output as text file
            filename = os.path.basename(file_path)
            output_file = os.path.join(OUTPUT_DIR, f"{os.path.splitext(filename)[0]}_pyq.txt")

            async with aiofiles.open(output_file, "w", encoding="utf-8") as out_file:
                await out_file.write(result)

            print(f"✓ Processed PYQ: {filename}")
            return output_file

        except Exception as e:
            print(f"✗ Error processing PYQ {file_path}: {str(e)}")
            return f"Error: {str(e)}"

async def process_all_documents():
    """Process all Syllabus and PYQ documents"""
    # Get all input files
    syllabus_files = [os.path.join(INPUT_DIR_SYLLABUS, f) for f in os.listdir(INPUT_DIR_SYLLABUS)
                      if f.lower().endswith(('.pdf', '.txt'))]

    pyq_files = [os.path.join(INPUT_DIR_PYQ, f) for f in os.listdir(INPUT_DIR_PYQ)
                 if f.lower().endswith(('.pdf', '.txt'))]

    print(f"Found {len(syllabus_files)} Syllabus files and {len(pyq_files)} PYQ files")

    # Use a semaphore to limit concurrent API calls
    semaphore = asyncio.Semaphore(5)

    # Process Syllabus files
    syllabus_tasks = [process_syllabus(file_path, semaphore) for file_path in syllabus_files]

    # Process PYQ files
    pyq_tasks = [process_pyq(file_path, semaphore) for file_path in pyq_files]

    # Start processing
    start_time = time.time()
    all_tasks = syllabus_tasks + pyq_tasks
    completed = await asyncio.gather(*all_tasks)
    end_time = time.time()

    successful = [c for c in completed if not isinstance(c, str) or not c.startswith("Error")]

    print(f"\nProcessing completed in {end_time - start_time:.2f} seconds")
    print(f"Successfully processed {len(successful)} out of {len(all_tasks)} files")

    return completed

def main():
    """Main entry point"""
    print("Starting document processing...")
    asyncio.run(process_all_documents())

if __name__ == "__main__":
    main()