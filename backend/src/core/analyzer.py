import google.generativeai as genai
import json
from PIL import Image
import io
from src.config.settings import settings
from src.utils.logger import get_logger

logger = get_logger(__name__)

genai.configure(api_key=settings.GENERATIVE_AI_API_KEY)

# Use the short name 'gemini-1.5-flash'. 
# We add generation_config to strictly enforce JSON responses.
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    generation_config={"response_mime_type": "application/json"}
)

OUTFIT_PROMPT = """
You are a Professional fashion stylist and outfit analyzer. Analyze this outfit photo and return a JSON Object following this exact structure:
{
    "style_types": [
        {"name": "Streetwear", "confidence": 82.0},
        {"name": "Casual", "confidence": 12.0},
        {"name": "Smart Casual", "confidence": 6.0}
    ],
    "proportions": {
        "shirt_length": "oversized/crop/regular/long",
        "bottom_length": "short/regular/ankle/floor",
        "length_match": "good/okay/poor",
        "length_match_reason": "explain why in one sentence"
    },
    "fit_balance": {
        "top_fit": "slim/regular/oversized",
        "bottom_fit": "slim/regular/baggy",
        "overall_balance": 78,
        "balance_reason": "explain in one sentence"
    },
    "outfit_balance_score": 78,
    "style_confidence_score": 82,
    "suggestions": [
        "specific suggestion 1",
        "specific suggestion 2",
        "specific suggestion 3"
    ]
}

Rules:
- confidence values must add up to 100
- all scores are integers between 0 and 100
- suggestions must be specific and actionable
- if no person or outfit is visible, return an "error" key with an appropriate message.
"""

def analyze_outfit(image_bytes: bytes) -> dict:
    try:
        logger.info("Opening Image for analysis")
        image = Image.open(io.BytesIO(image_bytes))

        logger.info("Sending Image to API for analysis")
        response = model.generate_content(
            [OUTFIT_PROMPT, image]
        )

        logger.info("Received response from API")
        raw = response.text.strip()

        # Since response_mime_type is set to application/json, 
        # Gemini will NOT include backticks (```json) anymore.
        result = json.loads(raw)
        
        if "error" in result:
            logger.warning(f"Analysis warning: {result['error']}")
            return result

        logger.info(f"Style detected: {result['style_types'][0]['name']}")
        return result
    
    except json.JSONDecodeError as e:
        logger.error(f"JSON decoding failed: {e}. Raw response: {response.text}")
        return {"error": "Failed to decode API response"}
    
    except Exception as e:
        logger.error(f"Error during outfit analysis: {e}")
        return {"error": "An error occurred during outfit analysis"}