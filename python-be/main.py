from fastapi import FastAPI
from app.api.endpoints import router as api_router
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Stock Analysis API")

app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True)