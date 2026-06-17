from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    GENERATIVE_AI_API_KEY: str
    app_name: str= "OutfitRater"
    debug: bool = True

    class Config:
        env_file = ".env"

settings = Settings()