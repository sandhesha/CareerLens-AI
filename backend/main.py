from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.resume import router as resume_router
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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(resume_router)


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