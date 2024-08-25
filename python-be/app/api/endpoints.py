from fastapi import APIRouter
from app.services.stock_service import StockService

router = APIRouter()
stock_service = StockService()

@router.get("/analyze-industry/{industry}")
async def analyze_industry(industry: str):
    result = await stock_service.analyze_industry(industry)
    if "error" in result:
        return {"error": True, "message": result["error"], "data": None}
    return {"error": False, "message": "Success", "data": result}

@router.get("/analyze-stock/{ticker}")
async def analyze_stock(ticker: str):
    result = await stock_service.analyze_stock(ticker)
    if "error" in result:
        return {"error": True, "message": result["error"], "data": None}
    return {"error": False, "message": "Success", "data": result}

@router.get("/stock-data/{ticker}")
async def get_stock_data(ticker: str, years: int = 1):
    result = await stock_service.get_stock_data(ticker, years)
    if result is None:
        return {"error": True, "message": "Error retrieving stock data", "data": None}
    return {"error": False, "message": "Success", "data": result}

@router.get("/generate-ticker-ideas/{industry}")
async def generate_ticker_ideas(industry: str):
    result = await stock_service.generate_ticker_ideas(industry)
    if not result:
        return {"error": True, "message": "Error generating ticker ideas", "data": None}
    return {"error": False, "message": "Success", "data": result}

@router.get("/sentiment-analysis/{ticker}")
async def get_sentiment_analysis(ticker: str):
    stock_data = await stock_service.get_stock_data(ticker, 1)
    if stock_data is None:
        return {"error": True, "message": "Error retrieving stock data", "data": None}
    result = await stock_service.get_sentiment_analysis(ticker, stock_data[3])
    if "error" in result:
        return {"error": True, "message": result, "data": None}
    return {"error": False, "message": "Success", "data": result}

@router.get("/analyst-ratings/{ticker}")
async def get_analyst_ratings(ticker: str):
    result = await stock_service.get_analyst_ratings(ticker)
    if "error" in result:
        return {"error": True, "message": result, "data": None}
    return {"error": False, "message": "Success", "data": result}

@router.get("/industry-analysis/{ticker}")
async def get_industry_analysis(ticker: str):
    result = await stock_service.get_industry_analysis(ticker)
    if "error" in result:
        return {"error": True, "message": result, "data": None}
    return {"error": False, "message": "Success", "data": result}

@router.get("/final-analysis/{ticker}")
async def get_final_analysis(ticker: str):
    analysis = await stock_service.analyze_stock(ticker)
    if "error" in analysis:
        return {"error": True, "message": analysis["error"], "data": None}
    return {"error": False, "message": "Success", "data": analysis['final_analysis']}

@router.get("/current-price/{ticker}")
async def get_current_price(ticker: str):
    result = await stock_service.get_current_price(ticker)
    if "error" in result:
        return {"error": True, "message": result, "data": None}
    return {"error": False, "message": "Success", "data": result}

@router.get("/rank-companies/{industry}")
async def rank_companies(industry: str):
    analysis = await stock_service.analyze_industry(industry)
    if "error" in analysis:
        return {"error": True, "message": analysis["error"], "data": None}
    return {"error": False, "message": "Success", "data": analysis['ranking']}
