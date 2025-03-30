from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, EmailStr
from .graph_repository import GraphRepository

router = APIRouter(prefix="/graph", tags=["Graph Database"])

# Dependency for getting the repository
def get_repository():
    return GraphRepository()

# Pydantic models for request validation
class SyllabusCreate(BaseModel):
    email: EmailStr
    name: str
    subject: str
    description: Optional[str] = None

class TopicCreate(BaseModel):
    module_number: str
    module_name: str
    topic_number: Optional[str] = None
    name: str
    description: Optional[str] = None
    hours: Optional[int] = 0

class PYQCreate(BaseModel):
    email: EmailStr
    title: str
    subject: str
    year: str
    exam_type: str
    description: Optional[str] = None

class QuestionCreate(BaseModel):
    text: str
    answer: str
    question_type: str
    marks: int
    topic_ids: Optional[List[str]] = None

# API Routes
@router.post("/syllabus", response_model=Dict[str, Any])
async def create_syllabus(
        syllabus: SyllabusCreate,
        repo: GraphRepository = Depends(get_repository)
):
    """Create a new syllabus"""
    try:
        return repo.save_syllabus(
            syllabus.email,
            syllabus.name,
            syllabus.subject,
            syllabus.description
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/syllabus/{syllabus_id}/topic", response_model=Dict[str, Any])
async def add_topic(
        syllabus_id: str,
        topic: TopicCreate,
        parent_topic_id: Optional[str] = None,
        repo: GraphRepository = Depends(get_repository)
):
    """Add a topic to a syllabus"""
    try:
        return repo.add_topic(
            syllabus_id,
            topic.module_number,
            topic.module_name,
            topic.dict(),
            parent_topic_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/syllabus/user/{email}", response_model=Dict[str, Any])
async def get_syllabi_by_user(
        email: EmailStr,
        repo: GraphRepository = Depends(get_repository)
):
    """Get all syllabi for a user"""
    try:
        return repo.get_user_syllabi(email)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/syllabus/{syllabus_id}/topics", response_model=Dict[str, Any])
async def get_topics(
        syllabus_id: str,
        repo: GraphRepository = Depends(get_repository)
):
    """Get all topics for a syllabus"""
    try:
        return repo.get_syllabus_topics(syllabus_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/pyq", response_model=Dict[str, Any])
async def create_pyq(
        pyq: PYQCreate,
        repo: GraphRepository = Depends(get_repository)
):
    """Create a new past year question paper"""
    try:
        return repo.save_pyq(
            pyq.email,
            pyq.title,
            pyq.subject,
            pyq.year,
            pyq.exam_type,
            pyq.description
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/pyq/{pyq_id}/question", response_model=Dict[str, Any])
async def add_question(
        pyq_id: str,
        question: QuestionCreate,
        repo: GraphRepository = Depends(get_repository)
):
    """Add a question to a past year paper"""
    try:
        return repo.add_question_to_pyq(
            pyq_id,
            question.text,
            question.answer,
            question.question_type,
            question.marks,
            question.topic_ids
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/pyq/user/{email}", response_model=Dict[str, Any])
async def get_pyqs_by_user(
        email: EmailStr,
        repo: GraphRepository = Depends(get_repository)
):
    """Get all past year papers for a user"""
    try:
        return repo.get_user_pyqs(email)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/pyq/{pyq_id}/questions", response_model=Dict[str, Any])
async def get_questions(
        pyq_id: str,
        repo: GraphRepository = Depends(get_repository)
):
    """Get all questions for a past year paper"""
    try:
        return repo.get_pyq_questions(pyq_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/topic/{topic_id}/questions", response_model=Dict[str, Any])
async def get_questions_by_topic(
        topic_id: str,
        question_type: Optional[str] = None,
        repo: GraphRepository = Depends(get_repository)
):
    """Find questions related to a specific topic"""
    try:
        return repo.find_questions_by_topic(topic_id, question_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))