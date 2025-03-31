from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Query
import pdfplumber
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import ValidationError, EmailStr
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser
import io
from dotenv import load_dotenv
import yagmail

import graph_rag.graph_routes
# Import database and graph routes
from graph_rag.database import get_db
from graph_rag.graph_repository import GraphRepository
from graph_rag.graph_service import GraphService

from question_pipeline.models import (
    MCQList, FIBList, ShortAnswerList, LongAnswerList,
    QuestionRequest
)
from question_pipeline.prompts import (
    MCQ_TEMPLATE, FIB_TEMPLATE,
    SHORT_ANSWER_TEMPLATE, LONG_ANSWER_TEMPLATE, MCQ_TEMPLATE_WITH_CONTEXT, FIB_TEMPLATE_WITH_CONTEXT,
    SHORT_ANSWER_TEMPLATE_WITH_CONTEXT, LONG_ANSWER_TEMPLATE_WITH_CONTEXT
)

# Load environment variables
load_dotenv()

# Define lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: No additional code needed for startup
    yield
    # Shutdown: Close database connection
    db = get_db()
    db.close()

app = FastAPI(title="Question Generator API", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM instances with a currently supported model
groq = ChatOpenAI(model="gpt-4o")

app.include_router(graph_rag.graph_routes.router)

# Function to send email
def send_email(to_email, subject, body, attachments):
    try:
        yag = yagmail.SMTP("your-email@example.com", "your-password")  # Replace with real credentials
        yag.send(to=to_email, subject=subject, contents=body, attachments=attachments)
        print("Email sent successfully!")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending email: {str(e)}")

# Function to generate questions
def generate_questions(request_data: dict, question_type: str = "mcq", graph_context=None):
    try:
        # Choose the appropriate model and template based on question type and whether we have graph context
        if question_type == "mcq":
            response_model = MCQList
            template = MCQ_TEMPLATE_WITH_CONTEXT if graph_context else MCQ_TEMPLATE
        elif question_type == "fib":
            response_model = FIBList
            template = FIB_TEMPLATE_WITH_CONTEXT if graph_context else FIB_TEMPLATE
        elif question_type == "short":
            response_model = ShortAnswerList
            template = SHORT_ANSWER_TEMPLATE_WITH_CONTEXT if graph_context else SHORT_ANSWER_TEMPLATE
        elif question_type == "long":
            response_model = LongAnswerList
            template = LONG_ANSWER_TEMPLATE_WITH_CONTEXT if graph_context else LONG_ANSWER_TEMPLATE
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

        # If we have graph context, use it to enhance the prompt
        if graph_context:
            # Add context from the graph database
            input_variables.append("previous_questions")

            # Format previous questions from the graph
            previous_questions_text = ""
            if "example_questions" in graph_context and graph_context["example_questions"]:
                for i, q in enumerate(graph_context["example_questions"][:5]):  # Limit to 5 examples
                    previous_questions_text += f"{i+1}. {q['text']}\n"
                    if q.get('answer'):
                        previous_questions_text += f"   Answer: {q['answer']}\n"

                request_data["previous_questions"] = previous_questions_text
            else:
                request_data["previous_questions"] = "No previous questions available."

            # Use syllabus from graph if available
            if "syllabus_text" in graph_context and graph_context["syllabus_text"]:
                request_data["syllabus"] = graph_context["syllabus_text"]

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

@app.get("/")
async def root():
    return {"message": "Welcome to the Question Generator API"}

@app.post("/upload/pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Extract text directly from an uploaded PDF file without storing it locally.
    """
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

        return {"text": text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
    finally:
        await file.close()
        pdf_file.close()

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

# Add these endpoints to your main.py

@app.post("/evaluate/question-uniqueness")
async def check_question_uniqueness(
        question_text: str,
        question_type: Optional[str] = None
):
    """Check if a question is unique or similar to existing ones"""
    try:
        graph_service = GraphService()
        result = await graph_service.check_question_uniqueness(question_text, question_type)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/evaluate/paper")
async def evaluate_paper(
        syllabus_id: str,
        paper_id: str
):
    """Evaluate a question paper against a syllabus"""
    try:
        graph_service = GraphService()
        result = await graph_service.evaluate_paper(syllabus_id, paper_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/knowledge/syllabus-context")
async def get_syllabus_context(
        syllabus_id: Optional[str] = None,
        topic_ids: Optional[List[str]] = None
):
    """Get syllabus context for question generation"""
    try:
        graph_service = GraphService()
        result = await graph_service.get_syllabus_context(syllabus_id, topic_ids)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/short-with-context")
async def generate_short_answer_with_context(
        request: QuestionRequest,
        syllabus_id: Optional[str] = None,
        topic_ids: Optional[List[str]] = None,
        word_limit: int = Query(150, description="Maximum word count for short answers"),
        marks: int = Query(5, description="Marks allocated to each question")
):
    """Generate short answer questions using graph knowledge"""
    try:
        # Get syllabus context from graph
        syllabus_context = None
        if syllabus_id or topic_ids:
            graph_service = GraphService()
            syllabus_context = await graph_service.get_syllabus_context(syllabus_id, topic_ids)

        # Add word limit and marks to request
        request_dict = request.dict()
        request_dict["word_limit"] = word_limit
        request_dict["marks"] = marks

        # Generate questions using the context
        return generate_questions(request_dict, question_type="short", syllabus_context=syllabus_context)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/long-with-context")
async def generate_long_answer_with_context(
        request: QuestionRequest,
        syllabus_id: Optional[str] = None,
        topic_ids: Optional[List[str]] = None,
        word_limit: int = Query(500, description="Suggested word count for long answers"),
        marks: int = Query(10, description="Marks allocated to each question")
):
    """Generate long answer questions using graph knowledge"""
    try:
        # Get syllabus context from graph
        syllabus_context = None
        if syllabus_id or topic_ids:
            graph_service = GraphService()
            syllabus_context = await graph_service.get_syllabus_context(syllabus_id, topic_ids)

        # Add word limit and marks to request
        request_dict = request.dict()
        request_dict["word_limit"] = word_limit
        request_dict["marks"] = marks

        # Generate questions using the context
        return generate_questions(request_dict, question_type="long", syllabus_context=syllabus_context)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/structured-paper")
async def generate_structured_paper(
        email: EmailStr,
        syllabus_id: str,
        paper_name: str,
        short_marks: int = 5,
        long_marks: int = 10
):
    """Generate a paper with 6 short and 4 long questions"""
    try:
        # Create services
        graph_service = GraphService()
        repo = GraphRepository()

        # 1. Create a new PYQ entry
        pyq_result = repo.save_pyq(
            email=email,
            title=paper_name,
            subject="University Examination",
            year="2025",
            exam_type="Midterm",
            description="Structured paper with 6 short and 4 long questions"
        )
        paper_id = pyq_result["data"]["pyq_id"]

        # 2. Get topic information from syllabus
        topics_result = repo.get_syllabus_topics(syllabus_id)
        topics = topics_result["data"]

        if len(topics) < 10:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough topics in syllabus (found {len(topics)}, need at least 10)"
            )

        # 3. Select topics for questions (first 10 for simplicity)
        # In production, you would use a more sophisticated selection algorithm
        short_topics = topics[:6]
        long_topics = topics[6:10]

        # 4. Generate questions
        all_questions = {
            "short_questions": [],
            "long_questions": []
        }

        # Generate short questions
        for topic in short_topics:
            # Get context for this topic
            context = await graph_service.get_syllabus_context(topic_ids=[topic["id"]])

            # Request data
            request_data = {
                "subject": topic["module_name"],
                "syllabus": topic["description"],
                "level": "medium",
                "num": 1,
                "word_limit": 150,
                "marks": short_marks
            }

            # Generate a question
            question = generate_questions(request_data, "short", context)

            # Store the generated question
            for q in question.questions:
                result = repo.add_question_to_pyq(
                    pyq_id=paper_id,
                    question_text=q.question,
                    answer=q.model_answer,
                    question_type="short",
                    marks=short_marks,
                    topics=[topic["id"]]
                )

            all_questions["short_questions"].append(question)

        # Generate long questions
        for topic in long_topics:
            # Get context for this topic
            context = await graph_service.get_syllabus_context(topic_ids=[topic["id"]])

            # Request data
            request_data = {
                "subject": topic["module_name"],
                "syllabus": topic["description"],
                "level": "medium",
                "num": 1,
                "word_limit": 500,
                "marks": long_marks
            }

            # Generate a question
            question = generate_questions(request_data, "long", context)

            # Store the generated question
            for q in question.questions:
                result = repo.add_question_to_pyq(
                    pyq_id=paper_id,
                    question_text=q.question,
                    answer=q.model_answer,
                    question_type="long",
                    marks=long_marks,
                    topics=[topic["id"]]
                )

            all_questions["long_questions"].append(question)

        # 5. Evaluate the generated paper
        evaluation = await graph_service.evaluate_paper(syllabus_id, paper_id)

        return {
            "status": "success",
            "message": "Paper generated successfully",
            "data": {
                "paper_id": paper_id,
                "paper_name": paper_name,
                "questions": all_questions,
                "evaluation": evaluation
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)