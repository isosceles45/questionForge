from fastapi import FastAPI, HTTPException, UploadFile, File
import pdfplumber
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
import yagmail

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

# Function to send email
def send_email(to_email, subject, body, attachments):
    try:
        yag = yagmail.SMTP("atharvasardal06@gmail.com", "Sardal#99.99")  # Your email and password
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
        else:
            response_model = FIBList
            template = FIB_TEMPLATE

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
        raise HTTPException(status_code=422, detail=f"Validation Error: {e.errors()}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post("/send_email")
async def send_email_with_pdfs(email: str, subject: str, body: str, files: list[UploadFile] = File(...)):
    """
    Send an email with PDF attachments.
    """
    attachments = []

    try:
        # Process each uploaded file
        for file in files:
            if not file.filename.endswith('.pdf'):
                raise HTTPException(status_code=400, detail="File must be a PDF")
            
            # Read the file into memory
            contents = await file.read()
            attachments.append((file.filename, contents))  # Append filename and contents for attachment

        # Send the email with the attachments
        send_email(email, subject, body, attachments)
        return {"message": "Email sent successfully!"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing email: {str(e)}")
    finally:
        for file in files:
            await file.close()

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
