from pydantic import BaseModel

class IndustryAnalysisRequest(BaseModel):
    industry: str

class StockAnalysisRequest(BaseModel):
    ticker: str

