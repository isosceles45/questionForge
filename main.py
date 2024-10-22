from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser
import os
from dotenv import load_dotenv
from models import MCQList, FIBList, QuestionRequest
from prompts import MCQ_TEMPLATE, FIB_TEMPLATE, DL_SYLLABUS, CSS_SYLLABUS, BDA_SYLLABUS

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

        if request_data["syllabus"] == "dl":
            request_data["syllabus"] = DL_SYLLABUS
        elif request_data["syllabus"] == "css":
            request_data["syllabus"] = CSS_SYLLABUS
        else:
            request_data["syllabus"] = BDA_SYLLABUS

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

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/mcq", response_model=MCQList)
async def generate_mcq(request: QuestionRequest):
    """
    Generate Multiple Choice Questions based on the provided parameters.
    """
    result = generate_questions(request.dict(), question_type="mcq", )
    return result

@app.post("/generate/fib", response_model=FIBList)
async def generate_fib(request: QuestionRequest):
    """
    Generate Fill in the Blanks questions based on the provided parameters.
    """
    result = generate_questions(request.dict(), question_type="fib")
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)