from PIL import Image
import io
from src.utils.logger import get_logger

logger = get_logger(__name__)

# Constants
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MIN_DIMENSION = 100               # 100px minimum
MAX_DIMENSION = 4096              # 4096px maximum
ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP", "JPG"}

def validate_image(image_bytes: bytes) -> dict:
    """
    Validates image before processing.
    Returns dict with valid: True/False and error message.
    """
    try:
        # Check file size
        size_mb = len(image_bytes) / (1024 * 1024)
        if len(image_bytes) > MAX_FILE_SIZE:
            logger.warning(f"Image too large: {size_mb:.1f}MB")
            return {
                "valid": False,
                "error": f"Image too large ({size_mb:.1f}MB). Max is 10MB."
            }

        # Check if it's a valid image
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()

        # Reopen after verify (verify closes the image)
        image = Image.open(io.BytesIO(image_bytes))

        # Check format
        if image.format not in ALLOWED_FORMATS:
            logger.warning(f"Invalid format: {image.format}")
            return {
                "valid": False,
                "error": f"Format {image.format} not supported. Use JPEG, PNG or WEBP."
            }

        # Check dimensions
        width, height = image.size
        if width < MIN_DIMENSION or height < MIN_DIMENSION:
            logger.warning(f"Image too small: {width}x{height}")
            return {
                "valid": False,
                "error": f"Image too small ({width}x{height}). Minimum is 100x100."
            }

        logger.info(f"Image valid: {image.format} {width}x{height} {size_mb:.1f}MB")
        return {"valid": True, "error": None}

    except Exception as e:
        logger.error(f"Image validation failed: {e}")
        return {"valid": False, "error": "Invalid or corrupted image file."}


def preprocess_image(image_bytes: bytes) -> bytes:
    """
    Resizes large images to speed up API call.
    Converts to RGB to avoid format issues.
    Returns processed image bytes.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))

        # Convert to RGB (handles PNG with transparency)
        if image.mode != "RGB":
            logger.info(f"Converting image from {image.mode} to RGB")
            image = image.convert("RGB")

        # Resize if too large
        width, height = image.size
        if width > MAX_DIMENSION or height > MAX_DIMENSION:
            logger.info(f"Resizing image from {width}x{height}")
            image.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)
            new_w, new_h = image.size
            logger.info(f"Resized to {new_w}x{new_h}")

        # Save back to bytes
        output = io.BytesIO()
        image.save(output, format="JPEG", quality=85)
        processed_bytes = output.getvalue()

        logger.info(f"Preprocessing complete")
        return processed_bytes

    except Exception as e:
        logger.error(f"Preprocessing failed: {e}")
        return image_bytes