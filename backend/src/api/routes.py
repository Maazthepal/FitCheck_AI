from fastapi import APIRouter, UploadFile, File, HTTPException
from src.core.analyzer import analyze_outfit
from src.core.color import extract_colors
from src.core.scorer import build_final_response
from src.utils.image import validate_image, preprocess_image
from src.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter()

@router.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    logger.info(f"Request received: {file.filename}")

    # Step 1 — Read image bytes
    try:
        image_bytes = await file.read()
        logger.info(f"Image read: {len(image_bytes)} bytes")
    except Exception as e:
        logger.error(f"Failed to read uploaded file: {e}")
        raise HTTPException(status_code=400, detail="Failed to read image file.")

    # Step 2 — Validate
    validation = validate_image(image_bytes)
    if not validation["valid"]:
        logger.warning(f"Validation failed: {validation['error']}")
        raise HTTPException(status_code=422, detail=validation["error"])

    # Step 3 — Preprocess
    processed_bytes = preprocess_image(image_bytes)

    # Step 4 — Analyze with Gemini
    logger.info("Starting Gemini analysis")
    gemini_result = analyze_outfit(processed_bytes)

    if "error" in gemini_result and gemini_result["error"]:
        logger.error(f"Gemini analysis failed: {gemini_result['error']}")
        raise HTTPException(status_code=500, detail=gemini_result["error"])

    # Step 5 — Extract colors
    logger.info("Starting color extraction")
    color_result = extract_colors(processed_bytes)

    # Step 6 — Build final response
    logger.info("Building final response")
    final = build_final_response(gemini_result, color_result)

    if final.get("error"):
        raise HTTPException(status_code=500, detail=final["error"])

    logger.info(f"Analysis complete. Drip Score: {final['scores']['drip_score']}")
    return final


@router.get("/health")
async def health():
    logger.info("Health check hit")
    return {"status": "ok", "service": "Outfit Rater API"}