import google.generativeai as genai
import json
from PIL import Image
import io
from src.config.settings import settings
from src.utils.logger import get_logger

logger = get_logger(__name__)

genai.configure(api_key=settings.GENERATIVE_AI_API_KEY)
model = genai.GenerativeModel("gemini-3.1-flash-lite")

COMPARE_PROMPT = """
You are a professional fashion stylist. Compare Outfit A (first image) and Outfit B (second image).

Return ONLY valid JSON, no extra text, no markdown:

{
  "overall_winner": "A" or "B",
  "overall_reason": "One short sentence explaining the winner",
  "category_winners": [
    {"category": "Old Money", "winner": "A/B", "reason": "short reason"},
    {"category": "Streetwear", "winner": "A/B", "reason": "short reason"},
    {"category": "Formal", "winner": "A/B", "reason": "short reason"},
    {"category": "Smart Casual", "winner": "A/B", "reason": "short reason"},
    {"category": "Date Night", "winner": "A/B", "reason": "short reason"},
    {"category": "Business Casual", "winner": "A/B", "reason": "short reason"}
  ],
  "outfit_a": {
    "style": "main style",
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness"]
  },
  "outfit_b": {
    "style": "main style",
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness"]
  },
  "verdict": "2 sentence final verdict"
}

Rules: Be honest, specific, and base judgment on real fashion principles.
"""

def compare_outfits(bytes1: bytes, bytes2: bytes) -> dict:
    try:
        image1 = Image.open(io.BytesIO(bytes1))
        image2 = Image.open(io.BytesIO(bytes2))

        logger.info("Sending both outfits to Gemini for comparison")
        response = model.generate_content([COMPARE_PROMPT, image1, image2],
                                          generation_config={
                "temperature": 0.7,
                "max_output_tokens": 800,   # Limit output size
            })

        raw = response.text.strip()
        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        result = json.loads(raw)
        logger.info(f"Comparison complete. Winner: Outfit {result['overall_winner']}")
        return result

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse failed: {e}")
        return {"error": "Failed to parse comparison response"}

    except Exception as e:
        error_str = str(e)
        logger.error(f"Comparison error: {error_str}")
        
        if "429" in error_str or "quota" in error_str.lower():
            return {"error": "AI is busy right now. Please wait 30-60 seconds and try again."}
        
        return {"error": "Failed to compare outfits. Please try again."}
    