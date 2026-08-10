from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.resume import router as resume_router


app = FastAPI(
    title="CareerLens AI API",
    description="Backend API for CareerLens AI",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(resume_router)


@app.get("/")
def root():
    return {
        "message": "CareerLens AI backend is running"
    }
