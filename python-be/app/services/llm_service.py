import requests
import os
from dotenv import load_dotenv
import logging
from .cache_service import CacheService

load_dotenv()

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        try:
            self.access_token = self.generate_access_token()
            self.headers = {
                "Authorization": f"Bearer {self.access_token}",
                "content-type": "application/json"
            }
        except Exception as e:
            logger.error(f"Failed to initialize LLMService: {e}")
            raise

    def generate_access_token(self):
        IBM_API_KEY = os.getenv('IBM_API_KEY')
        if not IBM_API_KEY:
            raise ValueError("IBM_API_KEY environment variable is not set")
        
        url = "https://iam.cloud.ibm.com/identity/token"
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        data = {"grant_type": "urn:ibm:params:oauth:grant-type:apikey",
                "apikey": IBM_API_KEY}
        try:
            response = requests.post(url, headers=headers, data=data)
            response.raise_for_status()
            response_json = response.json()
            access_token = response_json["access_token"]
            return access_token
        except requests.RequestException as e:
            logger.error(f"Failed to generate access token: {e}")
            raise

    async def generate_text(self, system_prompt, input_text, max_tokens=400, model_id="meta-llama/llama-3-1-70b-instruct"):
        PROJECT_ID = os.getenv('PROJECT_ID')
        if not PROJECT_ID:
            raise ValueError("PROJECT_ID environment variable is not set")
        
        body = {
            "input": f"{system_prompt} {input_text}",
            "parameters": {
                "decoding_method": "greedy",
                "max_new_tokens": max_tokens,
                "stop_sequences": [],
                "repetition_penalty": 1.05
            },
            "model_id": model_id,
            "project_id": PROJECT_ID
        }

        try:
            response = requests.post(
                "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29",
                headers=self.headers,
                json=body
            )
            response.raise_for_status()
            return response.json()['results'][0]['generated_text']
        except requests.RequestException as e:
            logger.error(f"Failed to generate text: {e}")
            raise
        except (KeyError, IndexError) as e:
            logger.error(f"Unexpected response format: {e}")
            raise