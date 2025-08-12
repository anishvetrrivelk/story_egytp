import jwt
import datetime

# 🔐 Replace with a strong secret key in production
SECRET_KEY = "super-secret-key"  # You can move this to an environment variable later

# ✅ Generate JWT token
def generate_token(user_id, username, email, expires_in=3600):
    try:
        payload = {
            "user_id": user_id,
            "username": username,
            "email": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_in)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        return token
    except Exception as e:
        print(f"[utils.py] Token generation failed: {e}")
        return None

# ✅ Verify and decode JWT token
def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        print("[utils.py] Token expired")
        return {"error": "Token has expired"}
    except jwt.InvalidTokenError:
        print("[utils.py] Invalid token")
        return {"error": "Invalid token"}
