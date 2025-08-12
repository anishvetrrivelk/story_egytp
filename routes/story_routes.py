from flask import Blueprint, jsonify, request
from db.connection import get_connection  # ✅ use the connection getter
from generate import generate_story_text
conn = get_connection()
cursor = conn.cursor
from pydantic import BaseModel
from fastapi import HTTPException



story_bp = Blueprint('story_routes', __name__)





class AnswerInput(BaseModel):
    user_id: int
    ans1: str
    ans2: str
    ans3: str
    ans4: str

@story_bp.post("/submit-answers")
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

# ✅ Fetch a single story input by story_id
@story_bp.route('/story/<int:story_id>', methods=['GET'])
def get_story_by_id(story_id):
    print(f"[DEBUG] Fetching story with story_id: {story_id}")
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM story_inputs WHERE story_id = %s", (story_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()

        if result:
            print(f"[DEBUG] Story found: {result}")
            return jsonify({
                'story_id': result[0],
                'story_idea': result[1],
                'question1': result[2],
                'answer1': result[3],
                'question2': result[4],
                'answer2': result[5],
                'question3': result[6],
                'answer3': result[7],
                'question4': result[8],
                'answer4': result[9],
                'question5': result[10],
                'answer5': result[11],
                'user_id': result[12]
            })
        else:
            print(f"[ERROR] No story found for story_id {story_id}")
            return jsonify({'error': 'Story not found'}), 404
    except Exception as e:
        print(f"[ERROR] Exception in get_story_by_id: {e}")
        return jsonify({'error': 'Internal server error'}), 500

# ✅ Generate story using story_id
@story_bp.route('/story/generate-story/<int:story_id>', methods=['GET'])
def generate_story(story_id):
    print(f"[DEBUG] Generating story for story_id: {story_id}")
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM story_inputs WHERE story_id = %s", (story_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()

        if result:
            print(f"[DEBUG] Story input retrieved for generation: {result}")
            story_text = generate_story_text(result)
            print(f"[DEBUG] Generated story: {story_text[:100]}...")  # print first 100 chars
            return jsonify({'generated_story': story_text})
        else:
            print(f"[ERROR] No story inputs found for story_id {story_id}")
            return jsonify({'error': 'No story inputs found for this story_id'}), 404
    except Exception as e:
        print(f"[ERROR] Exception in generate_story: {e}")
        return jsonify({'error': 'Internal server error'}), 500
