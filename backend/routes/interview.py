from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import json

from google import genai
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(
    prefix="/api/interview",
    tags=["Interview"]
)


API_KEY = os.getenv("GEMINI_API_KEY", "")

client = genai.Client(api_key=API_KEY) if API_KEY else None


# --------------------------------------------------
# Request Models
# --------------------------------------------------

class GenerateRequest(BaseModel):
    role: str
    skills: List[str]
    experience_level: Optional[str] = "Entry Level"


class EvaluateRequest(BaseModel):
    question: str
    answer: str
    role: str


# --------------------------------------------------
# Generate Interview Questions
# --------------------------------------------------

@router.post("/generate")
async def generate_questions(request: GenerateRequest):
    """
    Generate 3 technical interview questions
    based on role, skills and experience level.
    """

    if not API_KEY or client is None:
        return {
            "questions": [
                (
                    f"Can you explain your experience with "
                    f"{request.skills[0] if request.skills else 'these technologies'}?"
                ),
                (
                    f"Describe a challenging bug you fixed while "
                    f"building a {request.role} project. How did you solve it?"
                ),
                "How do you ensure your code is maintainable and scalable?",
            ]
        }

    try:

        prompt = f"""
You are an expert technical interviewer hiring for a
{request.experience_level} {request.role}.

The candidate claims to have these skills:

{', '.join(request.skills)}

Generate exactly 3 relevant technical interview questions.

The questions should test:
1. Technical knowledge
2. Practical problem solving
3. Real-world development experience

Return ONLY a JSON array of strings.

Example:

["Question 1", "Question 2", "Question 3"]

Do not use markdown.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        text = response.text.strip()

        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()

        questions = json.loads(text)

        return {
            "questions": questions
        }

    except Exception as e:

        print(f"Error generating questions: {e}")

        raise HTTPException(
            status_code=500,
            detail="Failed to generate interview questions."
        )


# --------------------------------------------------
# Evaluate Interview Answer
# --------------------------------------------------

@router.post("/evaluate")
async def evaluate_answer(request: EvaluateRequest):
    """
    Evaluate a candidate's interview answer.
    """

    if not API_KEY or client is None:

        return {
            "score": 80,
            "feedback": (
                "This is a solid start. "
                "You addressed the core concept well."
            ),
            "ideal_answer": (
                "An ideal answer would include specific metrics, "
                "tools used, and follow the STAR format."
            ),
        }

    try:

        prompt = f"""
You are an expert technical interviewer hiring for
a {request.role} position.

Evaluate the candidate's answer.

Question:
{request.question}

Candidate's Answer:
{request.answer}

Return a JSON object with exactly these keys:

- "score": An integer from 0 to 100 rating the answer.
- "feedback": 1 to 2 sentences of constructive feedback.
- "ideal_answer": A short 2-sentence example of a strong answer.

Evaluate based on:

- Technical accuracy
- Understanding
- Depth
- Practical knowledge
- Communication

Return ONLY valid JSON.
Do not use markdown.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        text = response.text.strip()

        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()

        evaluation = json.loads(text)

        return evaluation

    except Exception as e:

        print(f"Error evaluating answer: {e}")

        raise HTTPException(
            status_code=500,
            detail="Failed to evaluate interview answer."
        )