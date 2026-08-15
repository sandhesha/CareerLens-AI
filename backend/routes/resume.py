import os
import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.services.resume_parser import extract_resume_text
from backend.services.ai_service import AIService


router = APIRouter(
    prefix="/api/resume",
    tags=["Resume"],
)

# Render allows temporary files in /tmp
UPLOAD_DIR = "/tmp/careerlens_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are supported.",
        )

    filename = f"{uuid.uuid4()}.pdf"
    file_path = os.path.join(UPLOAD_DIR, filename)

    try:
        # Read uploaded file
        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is empty.",
            )

        # Save temporarily
        with open(file_path, "wb") as buffer:
            buffer.write(content)

        # Extract resume text
        text = extract_resume_text(file_path)

        if not text or not text.strip():
            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract text from this PDF. "
                    "Please upload a text-based PDF resume."
                ),
            )

        # Analyze resume using Gemini
        analysis = await AIService.analyze_resume(text)

        return {
            "success": True,
            "filename": file.filename,
            "text": text,
            "analysis": analysis,
            "score": analysis.get("score"),
            "skills": analysis.get("skills", []),
            "feedback": analysis.get("feedback", ""),
        }

    except HTTPException:
        raise

    except Exception as error:
        print("Resume processing error:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="Failed to process the resume.",
        )

    finally:
        # Remove temporary file
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass