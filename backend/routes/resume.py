import os
import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile

from services.resume_parser import extract_resume_text


router = APIRouter(
    prefix="/api/resume",
    tags=["Resume"],
)


UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    # Check file type
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are supported.",
        )

    # Create a unique filename
    filename = f"{uuid.uuid4()}.pdf"

    file_path = os.path.join(UPLOAD_DIR, filename)

    try:
        # Save uploaded PDF
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Extract text from PDF
        text = extract_resume_text(file_path)

        if not text:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from this PDF.",
            )

        return {
            "success": True,
            "filename": file.filename,
            "text": text,
        }

    except HTTPException:
        raise

    except Exception as error:
        print("Resume processing error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to process the resume.",
        )

    finally:
        # Remove temporary uploaded PDF
        if os.path.exists(file_path):
            os.remove(file_path)