FROM python:3.11.4-slim

ENV PYTHONBUFFERED 1

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5002

ENV PORT=5002

CMD ["python", "main.py"]
