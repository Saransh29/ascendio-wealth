from pydantic import BaseModel
from typing import List

class StockPredictionRequest(BaseModel):
    ticker: str

class StockPredictionResponse(BaseModel):
    ticker: str
    prediction: List[float]