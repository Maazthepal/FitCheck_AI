from colorthief import ColorThief
from PIL import Image
import io
import math
from src.utils.logger import get_logger

logger = get_logger(__name__)

def rgb_to_hex(rgb: tuple) -> str:
    return "#{:02x}{:02x}{:02x}".format(rgb[0], rgb[1], rgb[2]).upper()

def rgb_to_hsv(rgb: tuple) -> tuple:
    r, g, b = rgb[0]/255, rgb[1]/255, rgb[2]/255
    max_c = max(r, g, b)
    min_c = min(r, g, b)
    diff = max_c - min_c

    # Hue
    if diff == 0:
        h = 0
    elif max_c == r:
        h = (60 * ((g - b) / diff) + 360) % 360
    elif max_c == g:
        h = (60 * ((b - r) / diff) + 120) % 360
    else:
        h = (60 * ((r - g) / diff) + 240) % 360

    # Saturation
    s = 0 if max_c == 0 else diff / max_c

    # Value
    v = max_c

    return (h, s, v)

def calculate_color_harmony(colors_rgb: list) -> int:
    if len(colors_rgb) < 2:
        return 70

    hsv_colors = [rgb_to_hsv(c) for c in colors_rgb]
    hues = [c[0] for c in hsv_colors]
    saturations = [c[1] for c in hsv_colors]
    values = [c[2] for c in hsv_colors]

    score = 100

    # Rule 1: Check hue relationships
    hue_diffs = []
    for i in range(len(hues)):
        for j in range(i+1, len(hues)):
            diff = abs(hues[i] - hues[j])
            if diff > 180:
                diff = 360 - diff
            hue_diffs.append(diff)

    avg_hue_diff = sum(hue_diffs) / len(hue_diffs)

    # Complementary colors (180 degrees apart) = high harmony
    # Analogous colors (30 degrees apart) = high harmony
    # Random colors = low harmony
    if avg_hue_diff < 30:
        score += 10   # analogous - great
    elif avg_hue_diff < 60:
        score += 5    # close analogous - good
    elif 150 < avg_hue_diff < 210:
        score += 8    # complementary - great
    else:
        score -= 15   # clashing

    # Rule 2: Neutral colors are always safe
    low_sat_count = sum(1 for s in saturations if s < 0.2)
    neutral_ratio = low_sat_count / len(saturations)
    if neutral_ratio > 0.5:
        score += 10   # mostly neutrals = safe and clean

    # Rule 3: Too many bright colors clash
    high_sat_count = sum(1 for s in saturations if s > 0.7)
    if high_sat_count > 2:
        score -= 20   # too loud

    # Rule 4: Consistent brightness looks cleaner
    value_variance = max(values) - min(values)
    if value_variance < 0.3:
        score += 5
    elif value_variance > 0.6:
        score -= 10

    return max(0, min(100, score))

def extract_colors(image_bytes: bytes) -> dict:
    try:
        logger.info("Starting color extraction")

        # ColorThief needs a file-like object
        image_file = io.BytesIO(image_bytes)
        ct = ColorThief(image_file)

        # Get 6 dominant colors
        palette = ct.get_palette(color_count=6, quality=1)
        logger.info(f"Extracted {len(palette)} dominant colors")

        hex_colors = [rgb_to_hex(c) for c in palette]
        harmony_score = calculate_color_harmony(palette)

        logger.info(f"Color harmony score: {harmony_score}")

        return {
            "dominant_colors": hex_colors,
            "color_harmony": harmony_score
        }

    except Exception as e:
        logger.error(f"Color extraction failed: {e}")
        return {
            "dominant_colors": [],
            "color_harmony": 70
        }