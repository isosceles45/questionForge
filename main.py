from fastapi import FastAPI, HTTPException, UploadFile, File, Query, Body
import pdfplumber
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError, EmailStr, BaseModel
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.output_parsers import PydanticOutputParser
import io
import os
from dotenv import load_dotenv
from typing import Optional
from openai import OpenAI
from nano_graphrag import GraphRAG, QueryParam

from question_pipeline.models import (
    MCQList, FIBList, ShortAnswerList, LongAnswerList,
    QuestionRequest, QuestionSimilarityRequest, SyllabusCoverageRequest, QuestionPaper, PaperGenerationRequest
)
from question_pipeline.prompts import MCQ_TEMPLATE, FIB_TEMPLATE, SHORT_ANSWER_TEMPLATE, LONG_ANSWER_TEMPLATE, \
    SYLLABUS_PROMPT, PYQ_PROMPT, PAPER_TEMPLATE_RAG

# Load environment variables
load_dotenv()

# Initialize GraphRAG - ensure the Graph directory exists
GRAPH_DIR = "graph_rag/Graph"
os.makedirs(GRAPH_DIR, exist_ok=True)
graph_rag = GraphRAG(working_dir=GRAPH_DIR)

app = FastAPI(title="Question Generator API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("GROQ_API_KEY"))

# Initialize LLM instances
groq = ChatOpenAI(model="gpt-4o")
# groq = ChatGroq(model="deepseek-r1-distill-llama-70b")

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

def process_syllabus(syllabus_text: str):
    """Process syllabus text with OpenAI and return structured content"""
    try:
        response = client.chat.completions.create(
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

def process_pyq(pyq_text: str):
    """Process PYQ text with OpenAI and return structured content"""
    try:
        response = client.chat.completions.create(
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
def save_content(data: ContentData):
    """
    Process and save syllabus and optional PYQ content directly to GraphRAG.
    """
    try:
        print(f"Processing syllabus content from user: {data.user}")
        
        # Process syllabus (mandatory)
        processed_syllabus = process_syllabus(data.syllabus)
        print(processed_syllabus[:50])
        
        # Add processed syllabus to GraphRAG
        try:
            print("Attempting to insert syllabus into GraphRAG...")
            print(f"Syllabus content type: {type(processed_syllabus)}")
            print(f"Syllabus content length: {len(processed_syllabus)}")
            print(f"First 100 chars: {processed_syllabus[:100]}...")
            
            # Insert into global graph
            graph_rag.insert(processed_syllabus)
            print("✓ Syllabus added to GraphRAG")
        except Exception as insert_err:
            print(f"Error during syllabus insert: {str(insert_err)}")
            print(f"Error type: {type(insert_err)}")
            raise HTTPException(status_code=500, detail=f"Error inserting syllabus: {str(insert_err)}")
        
        # Process PYQ if provided
        if data.pyq:
            print("Processing PYQ content...")
            processed_pyq = process_pyq(data.pyq)
            print(processed_pyq[:50])
            
            # Add processed PYQ to GraphRAG
            try:
                graph_rag.insert(processed_pyq)
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
def query_graph(
    query: str = Body(..., embed=True), 
    mode: str = Body("global", embed=True)
):
    """
    Query the knowledge graph with the provided query string.
    """
    try:
        # Use global graph for all queries
        print(f"Querying graph with mode: {mode}")
        
        # Create a QueryParam object if mode is specified
        param = QueryParam(mode=mode) if mode != "global" else None
        
        # Execute the query
        if mode == "global":
            result = graph_rag.query(query)
        else:
            result = graph_rag.query(query, param=param)
        
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

@app.post("/generate/paper", response_model=QuestionPaper)
def generate_paper(request: PaperGenerationRequest):
    """
    Generate a complete question paper using the knowledge in GraphRAG with Pydantic parsing.
    GraphRAG already contains subject syllabus and previous question information.
    """
    parser = PydanticOutputParser(pydantic_object=QuestionPaper)
    format_instructions = parser.get_format_instructions()

    # Default to three equal sections if not specified
    if request.section_distribution is None:
        section_marks = [request.total_marks // request.num_sections] * request.num_sections
        # Adjust for any remainder
        remainder = request.total_marks % request.num_sections
        for i in range(remainder):
            section_marks[i] += 1
    else:
        # Validate that the provided section distribution adds up to total marks
        if sum(request.section_distribution) != request.total_marks:
            raise HTTPException(
                status_code=400,
                detail=f"Section distribution sum ({sum(request.section_distribution)}) must equal total marks ({request.total_marks})"
            )
        section_marks = request.section_distribution

    # Format section distribution for the prompt
    section_info = []
    for i, marks in enumerate(section_marks, 1):
        section_info.append(f"Section {i}: {marks} marks")
    section_distribution_text = "\n".join(section_info)

    # Calculate a reasonable number of questions if not provided
    total_questions = request.total_questions
    if total_questions is None:
        # Simple heuristic: average 5 marks per question
        total_questions = max(request.total_marks // 5, request.num_sections)

    prompt = PAPER_TEMPLATE_RAG.format(
        total_marks=request.total_marks,
        num_sections=request.num_sections,
        section_distribution=section_distribution_text,
        total_questions=total_questions,
        format_instructions=format_instructions
    )

    try:
        # Execute the query with global mode to access the entire knowledge graph
        raw_output = graph_rag.query(prompt)

        try:
            structured: QuestionPaper = parser.parse(raw_output)
        except ValidationError as exc:
            raise HTTPException(
                status_code=422,
                detail=f"Output did not conform to QuestionPaper schema: {exc}"
            )

        return structured

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error in generate_paper: {str(e)}")
        print(f"Error type: {type(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating paper: {str(e)}")

@app.post("/check/question_similarity")
def check_question_similarity(request: QuestionSimilarityRequest):
    """
    Check if a question is similar to any existing PYQ questions.
    """
    try:
        query = f"""
        Is this question similar to any past question papers? 
        Question: '{request.question}'
        
        If similar, return: SIMILAR
        If not similar, return: UNIQUE
        
        Provide a brief explanation of your reasoning in either case.
        """

        # Use local search mode to focus on finding specific similar questions
        result = graph_rag.query(query)

        return {
            "status": "success",
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking question similarity: {str(e)}")

@app.post("/analyze/syllabus_coverage")
def analyze_syllabus_coverage(request: SyllabusCoverageRequest):
    """Analyze how well a set of questions covers the syllabus"""
    try:
        questions_text = "\n\n".join([f"Question {i+1}: {q}" for i, q in enumerate(request.questions)])

        query = f"""
        Analyze how well the following set of questions covers the course syllabus:
        
        {questions_text}
        
        Please provide:
        1. A mapping of each question to the most relevant topic(s) in the syllabus
        2. A list of important syllabus topics that aren't covered by these questions
        3. A list of over-represented topics that appear in multiple questions
        4. An overall assessment of syllabus coverage (as a percentage)
        5. Recommendations for additional questions to improve coverage
        """

        result = graph_rag.query(query)

        return {
            "status": "success",
            "number_of_questions": len(request.questions),
            "coverage_analysis": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing syllabus coverage: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)