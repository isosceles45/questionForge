from fastapi import FastAPI, HTTPException, UploadFile, File, Query, Body
import pdfplumber
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import ValidationError, EmailStr, BaseModel
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser
import io
from dotenv import load_dotenv
import os
from typing import Optional
from openai import AsyncOpenAI  # Using AsyncOpenAI
from nano_graphrag import GraphRAG, QueryParam

from question_pipeline.models import (
    MCQList, FIBList, ShortAnswerList, LongAnswerList,
    QuestionRequest
)
from question_pipeline.prompts import MCQ_TEMPLATE, FIB_TEMPLATE, SHORT_ANSWER_TEMPLATE, LONG_ANSWER_TEMPLATE

# Load environment variables
load_dotenv()

# Initialize GraphRAG - ensure the Graph directory exists
GRAPH_DIR = "graph_rag/Graph"
os.makedirs(GRAPH_DIR, exist_ok=True)
graph_rag = GraphRAG(working_dir=GRAPH_DIR)

# System prompts for processing syllabus and PYQ content
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

app = FastAPI(title="Question Generator API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AsyncOpenAI client
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize LLM instances
groq = ChatOpenAI(model="gpt-4o")

# Data model for the content save endpoint
class ContentData(BaseModel):
    user: EmailStr
    syllabus: str
    pyq: Optional[str] = None

# Function to generate questions
def generate_questions(request_data: dict, question_type: str = "mcq"):
    try:
        # Choose the appropriate model and template based on question type
        if question_type == "mcq":
            response_model = MCQList
            template = MCQ_TEMPLATE
        elif question_type == "fib":
            response_model = FIBList
            template = FIB_TEMPLATE
        elif question_type == "short":
            response_model = ShortAnswerList
            template = SHORT_ANSWER_TEMPLATE
        elif question_type == "long":
            response_model = LongAnswerList
            template = LONG_ANSWER_TEMPLATE
        else:
            raise HTTPException(status_code=400, detail=f"Invalid question type: {question_type}")

        # Set up the parser
        parser = PydanticOutputParser(pydantic_object=response_model)
        format_instructions = parser.get_format_instructions()

        # Create prompt template with conditional variables
        input_variables = ["num", "subject", "syllabus", "level"]

        # Add word_limit and marks for short and long answer types
        if question_type in ["short", "long"]:
            input_variables.extend(["word_limit", "marks"])

        # Create prompt template
        prompt = PromptTemplate(
            input_variables=input_variables,
            template=template,
            partial_variables={"format_instructions": format_instructions}
        )

        # Create chain and generate response
        chain = prompt | groq
        results = chain.invoke(request_data)

        # Parse and validate the response
        structured_output = parser.parse(results.content)
        return structured_output

    except ValidationError as e:
        raise HTTPException(status_code=422, detail=f"Validation Error: {e.errors()}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

async def process_syllabus(syllabus_text: str):
    """Process syllabus text with OpenAI and return structured content"""
    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYLLABUS_PROMPT},
                {"role": "user", "content": syllabus_text}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error processing syllabus: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing syllabus: {str(e)}")

async def process_pyq(pyq_text: str):
    """Process PYQ text with OpenAI and return structured content"""
    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": PYQ_PROMPT},
                {"role": "user", "content": pyq_text}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error processing PYQ: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing PYQ: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to the Question Generator API"}

@app.post("/upload/pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Extract text directly from an uploaded PDF file without storing it locally."""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    try:
        # Read the file into memory
        contents = await file.read()

        # Create a BytesIO object from the contents
        pdf_file = io.BytesIO(contents)

        # Extract text using pdfplumber
        text = ""
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"

        if not text.strip():
            raise HTTPException(status_code=400, detail="No text found in PDF")

        # Print the extracted text for debugging
        print("===== EXTRACTED TEXT FROM PDF =====")
        print(text[:500] + "..." if len(text) > 500 else text)
        print("===================================")

        return {"text": text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
    finally:
        await file.close()
        pdf_file.close()

@app.post("/content/save")
async def save_content(data: ContentData):
    """
    Process and save syllabus and optional PYQ content directly to GraphRAG.
    """
    try:
        # Process syllabus (mandatory)
        print(f"Processing syllabus content from user: {data.user}")
        processed_syllabus = await process_syllabus(data.syllabus)
        
        # Add processed syllabus to GraphRAG with detailed error handling
        try:
            print("Attempting to insert syllabus into GraphRAG...")
            print(f"Syllabus content type: {type(processed_syllabus)}")
            print(f"Syllabus content length: {len(processed_syllabus)}")
            print(f"First 100 chars: {processed_syllabus[:100]}...")
            
            # Use the async version of insert instead of the synchronous one
            await graph_rag.ainsert(processed_syllabus)
            print("✓ Syllabus added to GraphRAG")
        except Exception as insert_err:
            print(f"Error during syllabus insert: {str(insert_err)}")
            print(f"Error type: {type(insert_err)}")
            raise HTTPException(status_code=500, detail=f"Error inserting syllabus: {str(insert_err)}")
        
        # Process PYQ if provided
        if data.pyq:
            print("Processing PYQ content...")
            processed_pyq = await process_pyq(data.pyq)
            
            # Add processed PYQ to GraphRAG using async method
            try:
                await graph_rag.ainsert(processed_pyq)
                print("✓ PYQ added to GraphRAG")
            except Exception as pyq_err:
                print(f"Error during PYQ insert: {str(pyq_err)}")
                # Continue even if PYQ insert fails, since syllabus is mandatory
        
        return {
            "status": "success",
            "message": "Content processed and added to knowledge graph",
            "data": {
                "user": data.user,
                "syllabus_processed": True,
                "pyq_processed": data.pyq is not None
            }
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error in save_content: {str(e)}")
        print(f"Error type: {type(e)}")
        raise HTTPException(status_code=500, detail=f"Error saving content: {str(e)}")
    
@app.post("/graph/query")
async def query_graph(query: str = Body(..., embed=True), mode: str = Body("global", embed=True)):
    """
    Query the knowledge graph with the provided query string.
    """
    try:
        # Always create a QueryParam object, regardless of mode
        param = QueryParam(mode=mode)
        
        # Check if GraphRAG query is async or sync
        if hasattr(graph_rag, 'aquery') and callable(graph_rag.aquery):
            # If there's an async version, use it
            result = await graph_rag.aquery(query, param=param)
        else:
            # Use synchronous version in a way that doesn't block the event loop
            import asyncio
            loop = asyncio.get_event_loop()
            
            # Run the synchronous method in a thread pool
            result = await loop.run_in_executor(
                None, lambda: graph_rag.query(query, param=param)
            )
        
        return {
            "status": "success", 
            "result": result
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error in query_graph: {str(e)}")
        print(f"Error type: {type(e)}")
        raise HTTPException(status_code=500, detail=f"Error querying graph: {str(e)}")

@app.post("/generate/mcq", response_model=MCQList)
async def generate_mcq(request: QuestionRequest):
    try:
        return generate_questions(request.dict(), question_type="mcq")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/fib", response_model=FIBList)
async def generate_fib(request: QuestionRequest):
    """Generate Fill in the Blanks questions"""
    try:
        return generate_questions(request.dict(), question_type="fib")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/short", response_model=ShortAnswerList)
async def generate_short_answer(
        request: QuestionRequest,
        word_limit: int = Query(150, description="Maximum word count for short answers"),
        marks: int = Query(5, description="Marks allocated to each question")
):
    try:
        request_dict = request.dict()
        request_dict["word_limit"] = word_limit
        request_dict["marks"] = marks
        return generate_questions(request_dict, question_type="short")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/long", response_model=LongAnswerList)
async def generate_long_answer(
        request: QuestionRequest,
        word_limit: int = Query(500, description="Suggested word count for long answers"),
        marks: int = Query(10, description="Marks allocated to each question")
):
    try:
        request_dict = request.dict()
        request_dict["word_limit"] = word_limit
        request_dict["marks"] = marks
        return generate_questions(request_dict, question_type="long")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/paper")
async def generate_paper(marks: int = Body(60, embed=True)):
    """
    Generate a complete question paper using the knowledge in GraphRAG.
    """
    try:
        query = f"Create a {marks} Marks Question Paper using your knowledge of syllabus and PYQs"
        
        # Always create a QueryParam object with "global" mode
        param = QueryParam(mode="global")
        
        # Check if GraphRAG query is async or sync
        if hasattr(graph_rag, 'aquery') and callable(graph_rag.aquery):
            # If there's an async version, use it
            result = await graph_rag.aquery(query, param=param)
        else:
            # Use synchronous version in a way that doesn't block the event loop
            import asyncio
            loop = asyncio.get_event_loop()
            
            # Run the synchronous method in a thread pool
            result = await loop.run_in_executor(
                None, lambda: graph_rag.query(query, param=param)
            )
        
        return {
            "status": "success",
            "paper": result
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error in generate_paper: {str(e)}")
        print(f"Error type: {type(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating paper: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)