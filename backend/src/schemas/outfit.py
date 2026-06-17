from pydantic import BaseModel
from typing import List, Optional

class StyleType(BaseModel):
    name: str
    confidence: float

class Proportions(BaseModel):
    shirt_length: str
    bottom_length: str
    length_match: str
    length_match_reason: str

class FitBalance(BaseModel):
    top_fit: str
    bottom_fit: str
    overall_balance: str
    overall_reason: str

class Scores(BaseModel):
    drip_score: int
    color_harmony: int
    outfit_balance: int
    style_confidence: int

class OutfitAnalysisResponse(BaseModel):
    style_types: List[StyleType]
    proportions: Proportions
    fit_balance: FitBalance
    scores: Scores
    suggestions: List[str]
    dominant_colors: List[str]
    error: Optional[str] = None