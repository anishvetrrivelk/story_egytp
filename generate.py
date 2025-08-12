import os
import requests

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
CLAUDE_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"

def generate_story_text(story_idea, q1, a1, q2, a2, q3, a3):
    prompt = f"""You are an egypt-themed story writer.

Here is the user’s input:

Story Idea: {story_idea}
{q1}: {a1}
{q2}: {a2}
{q3}: {a3}

Write a fun, imaginative story in 10 short paragraphs. Keep it culturally egypt and emotionally engaging."""

    print("🟡 Prompt sent to model:\n", prompt)

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "mistralai/mistral-7b-instruct",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 500
    }

    try:
        response = requests.post(CLAUDE_ENDPOINT, json=payload, headers=headers)
        print("🟡 Raw response status code:", response.status_code)

        if response.status_code != 200:
            print("🔴 Error response from OpenRouter API:", response.text)
            return f"API Error: {response.status_code} - {response.text}"

        data = response.json()
        print("🟢 API responded successfully.")

        if "choices" not in data or not data["choices"]:
            print("🔴 Malformed API response:", data)
            return "Error: Invalid response format from Claude API."

        story_text = data["choices"][0]["message"]["content"]
        print("🟢 Story generated successfully.")
        return story_text

    except requests.exceptions.RequestException as req_err:
        print("🔴 Network-related error:", str(req_err))
        return f"Network error occurred: {str(req_err)}"
    except Exception as e:
        print("🔴 General exception:", str(e))
        return f"Exception occurred: {str(e)}"
