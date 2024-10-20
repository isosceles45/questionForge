import openai
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get OpenAI API key from environment
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

# CORS middleware setup
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define input models
class GenerateQuestionsRequest(BaseModel):
    topic: str
    num: int = 1
    type: Literal["Multiple Choice", "Short Answer", "True/False", "Fill in the Blank"] = "Multiple Choice"
    custom_instructions: Optional[str] = None


class GenerateMCQsFromDataRequest(BaseModel):
    source: str
    source_type: Literal["pdf", "url", "text"]
    num: int = 1
    learning_objective: str = ""
    difficulty_level: str = ""
    custom_instructions: Optional[str] = None


class MCQRequest(BaseModel):
    grade: str
    subject: str
    topic: str
    subtopic: str
    isNcert: bool = False
    numberOfQuestions: int
    customInstructions: str = ""


class GenerateQuestionsWithLanguageRequest(BaseModel):
    topic: str
    num: int = 1
    type: Literal["Multiple Choice", "Short Answer", "True/False", "Fill in the Blank"] = "Multiple Choice"
    custom_instructions: Optional[str] = None
    language: Optional[str] = Field(default="eng", description="Language code for question generation")


# Language support dictionary
LANGUAGES = {
    "eng": "English",
    "hin": "Hindi",
    "tel": "Telugu",
    "mar": "Marathi",
    "tamil": "Tamil",
    "kannada": "Kannada",
    "guj": "Gujarati"
}


# Function for generating questions using OpenAI
def generate_questions_with_openai(prompt: str):
    try:
        response = client.chat.completions.create(
            model="gpt-4o",  # or your preferred model
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates educational questions."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            n=1,
            stop=None,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Function for generating questions with language support
def generate_questions_with_language(topic: str, num: int, q_type: str, language: str, custom_instructions: Optional[str] = None):
    language_name = LANGUAGES.get(language, "English")
    prompt_template = f"Generate {num} {q_type} questions on the topic '{topic}' in {language_name}."
    
    if custom_instructions:
        prompt_template += f"\nCustom Instructions: {custom_instructions}"
    
    return generate_questions_with_openai(prompt_template)


@app.get("/", status_code=status.HTTP_200_OK)
def root():
    return {"message": "Server is running"}


# MCQ generation endpoint
@app.post("/generate-mcq", status_code=status.HTTP_200_OK)
async def api_generate_mcq_questions(request: MCQRequest):
    try:
        custom_ncert_template = f"""
        Generate {request.numberOfQuestions} multiple-choice question (MCQ) based on the given topic and level.
        Provide the question, four answer options, and the correct answer.
        Topic: {request.topic}
        Subtopic: {request.subtopic}
        Subject: {request.subject}
        Grade: {request.grade}
        """

        # Generate the MCQ questions using OpenAI
        result = generate_questions_with_openai(custom_ncert_template + request.customInstructions)
        return {"questions": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# General question generation endpoint
@app.post("/generate-questions", status_code=status.HTTP_200_OK)
async def api_generate_questions(request: GenerateQuestionsRequest):
    try:
        result = generate_questions_with_language(
            topic=request.topic,
            num=request.num,
            q_type=request.type,
            language="eng",  # Defaulting to English
            custom_instructions=request.custom_instructions
        )
        return {"questions": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Generate questions from data endpoint
@app.post("/generate-mcqs-from-data", status_code=status.HTTP_200_OK)
async def api_generate_mcqs_from_data(request: GenerateMCQsFromDataRequest):
    try:
        prompt_template = f"""
        Generate {request.num} multiple-choice questions from the following data source:
        Source: {request.source_type}
        Learning Objective: {request.learning_objective}
        Difficulty Level: {request.difficulty_level}
        """
        result = generate_questions_with_openai(prompt_template)
        return {"questions": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Generate questions with language endpoint
@app.post("/generate-questions-with-language", status_code=status.HTTP_200_OK)
async def api_generate_questions_with_language(request: GenerateQuestionsWithLanguageRequest):
    try:
        result = generate_questions_with_language(
            topic=request.topic,
            num=request.num,
            q_type=request.type,
            language=request.language,
            custom_instructions=request.custom_instructions
        )
        return {"questions": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)