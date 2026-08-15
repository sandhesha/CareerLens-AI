from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. Updated imports (removed 'backend.' prefix to prevent ModuleNotFoundError)
from backend.routes.resume import router as resume_router
from backend.routes.jobs import router as jobs_router
from backend.routes.interview import router as interview_router
from backend.routes.settings import router as settings_router
app = FastAPI(
    title="CareerLens AI",
    description="AI-powered resume analysis and interview preparation API",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://careerlensai-sandhesha.vercel.app",
    ],
    allow_origin_regex=r"https://careerlensai-sandhesha-[a-z0-9]+-sandheshas-projects\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Routes - Registering all the endpoints here
app.include_router(resume_router)
app.include_router(jobs_router)
app.include_router(interview_router)
app.include_router(settings_router)

@app.get("/")
async def root():
    return {
        "message": "CareerLens AI backend is running"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }