
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi.middleware.cors import CORSMiddleware
import json
from flask import Flask, request, jsonify
from fastapi import Request
from fastapi.responses import JSONResponse

from dotenv import load_dotenv
load_dotenv()

from pydantic import BaseModel

class ImageRequest(BaseModel):
    story_text: str



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174" ],  # 👈 match your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from dotenv import load_dotenv
load_dotenv()

# Database connection
conn = psycopg2.connect(
    dbname="postgres",     # Replace with your DB name
    user="postgres",       # Replace with your username
    password="ak8485",  # Replace with your password
    host="localhost",      # Replace with your DB host
    port="5432"            # Default PostgreSQL port
)
cursor = conn.cursor()

# Request schema
class AnswerInput(BaseModel):
    user_id: int
    ans1: str
    ans2: str
    ans3: str
    ans4: str

@app.post("/submit-answers")
def submit_answers(data: AnswerInput):
    try:
        insert_query = """
        INSERT INTO user_answers (user_id, ans1, ans2, ans3, ans4)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING query_id;
        """
        cursor.execute(insert_query, (data.user_id, data.ans1, data.ans2, data.ans3, data.ans4))
        new_id = cursor.fetchone()[0]
        conn.commit()
        return {"message": "Answers submitted", "query_id": new_id}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/get-answers/{query_id}")
def get_answers(query_id: int):
    try:
        cursor.execute("""
            SELECT ans1, ans2, ans3, ans4
            FROM user_answers
            WHERE query_id = %s;
        """, (query_id,))
        result = cursor.fetchone()
        
        if result is None:
            raise HTTPException(status_code=404, detail="Query ID not found")

        answer_list = list(result)
        return {"query_id": query_id, "answers": answer_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

import os
import requests

# Ensure the API key is set in your environment
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
CLAUDE_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"


@app.get("/generate-story/{query_id}")
def generate_story(query_id: int):
    try:
        # 1. Fetch answers from DB
        cursor.execute("""
            SELECT ans1, ans2, ans3, ans4
            FROM user_answers
            WHERE query_id = %s;
        """, (query_id,))
        result = cursor.fetchone()

        if result is None:
            raise HTTPException(status_code=404, detail="Query ID not found")

        answers = list(result)  # [ans1, ans2, ans3, ans4]

        # 2. Build a basic prompt (you'll enhance it later)
        prompt = f"""
You are an imaginative Egyptian storyteller.

Here is the user's input:
- Story idea: {answers[0]}
- Main characters: {answers[1]}
- Conflict or challenge: {answers[2]}
- Ending: {answers[3]}

Write a culturally rich **10-paragraph story set in Ancient Egypt**, following these rules:

- Each paragraph should represent a unique scene or event.
- Each paragraph must be vivid, descriptive, and emotional.
- Use rich sensory and cultural imagery (e.g., “The pharaoh entered a golden tomb lit by torchlight…”).
- Each paragraph should be short enough to fit on a single screen (~500 words).
- the story has to be minimum of 5000 words (500(words)*10(pages/paragraph))

- Each paragraph should be **illustratable**.

⚠️ **IMPORTANT**:
- DO NOT include any introduction, explanation, or notes.
- ONLY return a valid JSON array of 10 string elements.
- Example format:

[
  "Paragraph 1...",
  "Paragraph 2...",
  "...",
  "Paragraph 10..."

]
"""


        # 3. Prepare LLM request
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "mistralai/mistral-7b-instruct",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 15000
        }

        # 4. Send request to OpenRouter
        response = requests.post(CLAUDE_ENDPOINT, json=payload, headers=headers)

        if response.status_code != 200:
            return {"error": f"API Error: {response.status_code}", "details": response.text}

        data = response.json()

        if "choices" not in data or not data["choices"]:
            return {"error": "Invalid response format from LLM"}

        story_text = data["choices"][0]["message"]["content"]
        return {"query_id": query_id, "answers": answers, "story": story_text}

    except requests.exceptions.RequestException as req_err:
        raise HTTPException(status_code=500, detail=f"Network error: {str(req_err)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


from fastapi import Request
import replicate

# Replicate setup
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
if not REPLICATE_API_TOKEN:
    raise ValueError("REPLICATE_API_TOKEN is not set in environment variables.")



@app.post("/generate-image")
async def generate_image(request: Request):
    try:
        body = await request.json()
        story_text = body.get("story_text", "")

        # Clean prompt
        prompt = story_text.strip().replace("\n", " ")[:200]  # limit to 200 chars

        # Pollinations image URL generation
        image_url = f"https://image.pollinations.ai/prompt/{prompt.replace(' ', '%20')}"

        return JSONResponse(content={"image_url": image_url})

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Image generation error: {str(e)}"})
