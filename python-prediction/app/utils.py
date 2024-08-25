import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd

cache = {}
CACHE_DURATION = timedelta(days=1)

def fetch_stock_data(ticker, start_date, end_date):
    current_time = datetime.now()
    if ticker in cache and (current_time - cache[ticker]['timestamp']) < CACHE_DURATION:
        return cache[ticker]['data']

    stock = yf.Ticker(ticker)
    data = stock.history(start=start_date, end=end_date)
    data = data.reset_index()
    data = data.rename(columns={
        'Date': 'Date',
        'Open': 'Open',
        'High': 'High',
        'Low': 'Low',
        'Close': 'Close',
        'Volume': 'Volume'
    })
    
    data = data[['Date', 'Low', 'Open', 'Volume', 'High', 'Close', 'Close']]
    
    data.columns = ['Date', 'Low', 'Open', 'Volume', 'High', 'Close', 'Adjusted Close']
    
    cache[ticker] = {
        'data': data,
        'timestamp': current_time
    }
    
    return data