from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import StockPredictionRequest, StockPredictionResponse
from .prediction import plot_values, predict_stock
from .utils import fetch_stock_data
from datetime import datetime, timedelta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict", response_model=StockPredictionResponse)
async def predict(request: StockPredictionRequest):
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=250)
        
        data = fetch_stock_data(request.ticker, start_date, end_date)
        prediction = predict_stock(data)
        
        return StockPredictionResponse(
            ticker=request.ticker,
            prediction=prediction.tolist()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/health")
async def health():
    return {"status": "ok"}