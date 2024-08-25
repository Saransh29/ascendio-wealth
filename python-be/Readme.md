# PYTHON FAST API BACKEND WITH REDIS CACHING FOR STOCK ANALYSIS

This project implements a FastAPI backend with Redis caching for stock analysis. It provides endpoints for generating ticker ideas, analyzing stocks, and ranking companies within an industry.

## Features

- Generate ticker ideas for a given industry
- Analyze individual stocks
- Rank companies within an industry
- Redis caching for improved performance

## Setup

1. Install dependencies:
   ```
   pip install fastapi uvicorn redis yfinance beautifulsoup4 requests
   ```

2. Ensure Redis is installed and running on your system.

3. Set up environment variables:
   - `IBM_API_KEY`: Your IBM API key
   - `PROJECT_ID`: Your IBM project ID

## Running the Server

To start the FastAPI server, run:

```
python main.py