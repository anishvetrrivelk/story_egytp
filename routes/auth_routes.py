from flask import Blueprint, request, jsonify
from db.connection import get_connection
from utils import generate_token

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    try:
        conn = get_connection()
        cursor = conn.cursor()

        # ✅ Use correct table and fetch required fields
        cursor.execute("SELECT id, username, email, password FROM anish WHERE email = %s", (email,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if user and password == user[3]:
            # ✅ Pass all required fields to generate_token
            token = generate_token(user[0], user[1], user[2])  # id, username, email
            return jsonify({
                "id": user[0],
                "username": user[1],
                "email": user[2],
                "token": token
            }), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500
