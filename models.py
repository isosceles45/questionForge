from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class Option(BaseModel):
    text: str = Field(description="The text of the option.")
    correct: str = Field(description="Whether the option is correct or not. Either 'true' or 'false'")

class MCQ(BaseModel):
    question: str = Field(description="The quiz question")
    options: List[Option] = Field(description="The possible answers to the question. The list should contain 4 options.")
    explanation: str = Field(default=None, description="Explanation of the question")
    course_outcomes: int = Field(default=None, description="Mapping the course outcome of the topic for the question")
    blooms_taxanomy: str = Field(default=None, description="The Bloom's taxonomy level of the question")
    difficulty_level: str = Field(default=None, description="The difficulty level of the question. Can be 'easy', 'medium' or 'hard'")
    difficulty_rating: int = Field(ge=1, le=5, description="The difficulty rating of the question should be strictly between 1-3 and is mapped with difficulty level")
    metadata: Dict[str, Any] = Field(default={}, description="Additional metadata for the question.")

class MCQList(BaseModel):
    questions: List[MCQ]

class FIB(BaseModel):
    question: str = Field(description="The quiz question")
    answer: str = Field(description="The answers to the question.")
    explanation: str = Field(default=None, description="Explanation of the question")
    course_outcomes: int = Field(default=None, description="Mapping the course outcome of the topic for the question")
    blooms_taxanomy: str = Field(default=None, description="The Bloom's taxonomy level of the question")
    difficulty_level: str = Field(default=None, description="The difficulty level of the question. Can be 'easy', 'medium' or 'hard'")
    difficulty_rating: int = Field(ge=1, le=5, description="The difficulty rating of the question should be strictly between 1-3 and is mapped with difficulty level")
    metadata: Dict[str, Any] = Field(default={}, description="Additional metadata for the question.")

class FIBList(BaseModel):
    questions: List[FIB]

class QuestionRequest(BaseModel):
    subject: str
    syllabus: str
    level: str = "medium"
    num: int = 1