from fastapi import FastAPI, HTTPException, UploadFile, File, Query
import pdfplumber
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import ValidationError
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

from question_pipeline.models import (
    MCQList, FIBList, ShortAnswerList, LongAnswerList,
    QuestionRequest
)
from question_pipeline.prompts import (
    MCQ_TEMPLATE, FIB_TEMPLATE,
    SHORT_ANSWER_TEMPLATE, LONG_ANSWER_TEMPLATE
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

@app.get("/")
async def root():
    return {"message": "Welcome to the Question Generator API"}

@app.get("/hello")
async def hello():
    return {"message": "Hello World"}

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)