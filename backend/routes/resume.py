import os
import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.services.resume_parser import extract_resume_text


router = APIRouter(
    prefix="/api/resume",
    tags=["Resume"],
)

# Vercel serverless functions can write to /tmp
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
        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is empty.",
            )

        with open(file_path, "wb") as buffer:
            buffer.write(content)

        text = extract_resume_text(file_path)

        if not text or not text.strip():
            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract text from this PDF. "
                    "Please upload a text-based PDF resume."
                ),
            )

        return {
            "success": True,
            "filename": file.filename,
            "text": text,
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
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass