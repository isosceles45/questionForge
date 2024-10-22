from fastapi import FastAPI, HTTPException, UploadFile, File
import pdfplumber
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser
import io
from dotenv import load_dotenv
from models import MCQList, FIBList, QuestionRequest
from prompts import MCQ_TEMPLATE, FIB_TEMPLATE

# Load environment variables
load_dotenv()

app = FastAPI(title="Question Generator API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM instances
groq = ChatGroq(model="llama-3.1-70b-versatile")
# openai = ChatOpenAI(model="gpt-4o-mini")

def generate_questions(request_data: dict, question_type: str = "mcq"):
    try:
        # Choose the appropriate model and template based on question type
        if question_type == "mcq":
            response_model = MCQList
            template = MCQ_TEMPLATE
        else:
            response_model = FIBList
            template = FIB_TEMPLATE

        # Update syllabus in request data based on input
        # if request_data.get("syllabus") == "dl":
        #     request_data["syllabus"] = DL_SYLLABUS
        # elif request_data.get("syllabus") == "css":
        #     request_data["syllabus"] = CSS_SYLLABUS
        # else:
        #     request_data["syllabus"] = BDA_SYLLABUS

        # Set up the parser
        parser = PydanticOutputParser(pydantic_object=response_model)
        format_instructions = parser.get_format_instructions()

        # Create prompt template
        prompt = PromptTemplate(
            input_variables=["num", "subject", "syllabus", "level"],
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
        # Handle validation errors for data parsing
        raise HTTPException(status_code=422, detail=f"Validation Error: {e.errors()}")
    except HTTPException as e:
        raise e  # Propagate known HTTP exceptions
    except Exception as e:
        # Handle any other uncaught exceptions
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
    """
    Generate Multiple Choice Questions based on the provided parameters.
    """
    try:
        result = generate_questions(request.dict(), question_type="mcq")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/fib", response_model=FIBList)
async def generate_fib(request: QuestionRequest):
    """
    Generate Fill in the Blanks questions based on the provided parameters.
    """
    try:
        result = generate_questions(request.dict(), question_type="fib")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)