from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from backend.services.job_matcher import JobMatcher

# Create a router we will attach to our main app
router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

# Mock database of jobs (In a real app, this would come from PostgreSQL/MongoDB)
MOCK_JOBS = [
    {
        "id": 1,
        "title": "Frontend Developer Intern",
        "company": "TechNova",
        "location": "Bangalore, India",
        "type": "Internship",
        "salary": "₹15k - ₹25k/month",
        "description": "Build responsive web applications and reusable frontend components. Ideal for students.",
        "skills": ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind"]
    },
    {
        "id": 2,
        "title": "AI/ML Engineer Intern",
        "company": "NeuralWorks",
        "location": "Bangalore, India",
        "type": "Internship",
        "salary": "₹20k - ₹30k/month",
        "description": "Work on machine learning models, data preprocessing, and AI applications.",
        "skills": ["Python", "Machine Learning", "TensorFlow", "PyTorch", "SQL", "Pandas"]
    },
    {
        "id": 3,
        "title": "Full Stack Developer",
        "company": "Digital Labs",
        "location": "Remote",
        "type": "Full-time",
        "salary": "₹6 LPA - ₹9 LPA",
        "description": "Develop and maintain end-to-end web architectures.",
        "skills": ["React", "Node.js", "Express", "MongoDB", "TypeScript"]
    },
    {
        "id": 4,
        "title": "Software Engineering Intern",
        "company": "Future Systems",
        "location": "Hyderabad, India",
        "type": "Internship",
        "salary": "₹18k - ₹25k/month",
        "description": "Develop and maintain scalable backend services and APIs.",
        "skills": ["Python", "FastAPI", "Git", "Docker", "Software Design"]
    }
]

# Request model for the frontend payload
class MatchRequest(BaseModel):
    skills: List[str]

@router.get("/")
async def get_all_jobs():
    """Returns all available jobs in the database."""
    return {"jobs": MOCK_JOBS}

@router.post("/match")
async def match_jobs(request: MatchRequest):
    """Takes a list of skills and returns the top matching jobs."""
    try:
        # Use our JobMatcher service to calculate percentages and sort
        matched_jobs = JobMatcher.get_top_matches(request.skills, MOCK_JOBS, top_n=3)
        return {"matches": matched_jobs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job matching failed: {str(e)}")