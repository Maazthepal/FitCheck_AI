from src.utils.logger import get_logger

logger = get_logger(__name__)

def calculate_drip_score(
    style_confidence: int,
    color_harmony: int,
    outfit_balance: int
) -> int:
    """
    Drip Score Formula:
    0.5 × Style Confidence
    0.3 × Color Harmony
    0.2 × Outfit Balance
    """
    drip_score = (
        0.5 * style_confidence +
        0.3 * color_harmony +
        0.2 * outfit_balance
    )

    final = round(drip_score)
    logger.info(
        f"Drip Score calculated: {final} "
        f"(style={style_confidence}, "
        f"color={color_harmony}, "
        f"balance={outfit_balance})"
    )
    return max(0, min(100, final))


def build_final_response(
    gemini_result: dict,
    color_result: dict
) -> dict:
    try:
        # Extract scores from Gemini
        style_confidence = gemini_result.get("style_confidence_score", 70)
        outfit_balance = gemini_result.get("outfit_balance_score", 70)

        # Extract color harmony from color extractor
        color_harmony = color_result.get("color_harmony", 70)

        # Calculate final drip score
        drip_score = calculate_drip_score(
            style_confidence,
            color_harmony,
            outfit_balance
        )

        response = {
            "style_types": gemini_result.get("style_types", []),
            "proportions": gemini_result.get("proportions", {}),
            "fit_balance": gemini_result.get("fit_balance", {}),
            "scores": {
                "drip_score": drip_score,
                "color_harmony": color_harmony,
                "outfit_balance": outfit_balance,
                "style_confidence": style_confidence
            },
            "suggestions": gemini_result.get("suggestions", []),
            "dominant_colors": color_result.get("dominant_colors", []),
            "error": None
        }

        logger.info("Final response built successfully")
        return response

    except Exception as e:
        logger.error(f"Failed to build final response: {e}")
        return {"error": str(e)}