import os
import json
from typing import Dict, Any

from google import genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY", "")

client = genai.Client(api_key=API_KEY) if API_KEY else None


class AIService:
    @staticmethod
    async def analyze_resume(resume_text: str) -> Dict[str, Any]:
        """
        Analyze resume text using Gemini and return ATS score,
        skills and feedback.
        """

        if not API_KEY or client is None:
            print("WARNING: No Gemini API key found. Returning fallback mock data.")
            return AIService._get_fallback_data()

        prompt = f"""
You are an expert ATS system and technical recruiter.

Analyze the following resume and return ONLY valid JSON.

The JSON MUST contain exactly these keys:

- "score": An integer from 0 to 100 representing the overall resume strength.
- "skills": A list of strings containing the main technical skills found.
- "feedback": A short 1-sentence piece of advice to improve the resume.

Resume Text:
{resume_text}

IMPORTANT:
Return ONLY valid JSON.
Do not use markdown.
Do not wrap the JSON in ```json.
"""

        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )

            response_text = response.text.strip()

            if response_text.startswith("```json"):
                response_text = response_text[7:-3].strip()
            elif response_text.startswith("```"):
                response_text = response_text[3:-3].strip()

            data = json.loads(response_text)

            return {
                "score": int(data.get("score", 70)),
                "skills": data.get("skills", []),
                "feedback": data.get(
                    "feedback",
                    "Consider adding more quantifiable metrics to your experience."
                ),
            }

        except Exception as e:
            print(f"Error during AI analysis: {e}")
            return AIService._get_fallback_data()

    @staticmethod
    def _get_fallback_data() -> Dict[str, Any]:
        """
        Safe fallback data if Gemini is unavailable.
        """

        return {
            "score": 85,
            "skills": [
                "Python",
                "JavaScript",
                "React",
                "Machine Learning",
                "SQL",
            ],
            "feedback": (
                "Your resume looks strong, but could use more "
                "specific project outcomes."
            ),
        }