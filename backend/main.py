from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import router
from src.utils.logger import get_logger

logger = get_logger(__name__)

app = FastAPI(
    title="Outfit Rater API",
    description="AI-powered outfit analysis using Gemini Vision",
    version="1.0.0"
)

# CORS — allows frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://fitcheck-ai-maaz.vercel.app",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router, prefix="/api/v1")

@app.on_event("startup")
async def startup():
    logger.info("Outfit Rater API starting up")

@app.on_event("shutdown")
async def shutdown():
    logger.info("Outfit Rater API shutting down")