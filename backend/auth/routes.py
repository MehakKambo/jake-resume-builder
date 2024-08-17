from flask import Blueprint, request, jsonify
import bcrypt
from flask_jwt_extended import create_access_token, jwt_required
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize MongoDB client
client = MongoClient(os.getenv("MONGO_URI"))
db = client['resume_builder']
users_collection = db['users']

# Create a Blueprint for authentication
auth_bp = Blueprint('auth', __name__)

# User Signup Route
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    # Check if user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 409
    
    # check if password and confirm_password match
    if password != confirm_password:
        return jsonify({"error": "Passwords don't match"}), 400
    
    # validate email

    # Hash the password and store it
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user = {"email": email, "password": hashed_pw}
    users_collection.insert_one(user)

    return jsonify({"message": "User created successfully"}), 201

# User Login Route
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Find user in the database
    user = users_collection.find_one({"username": username})
    if not user:
        return jsonify({"error": "Invalid username or password"}), 401

    # Verify password
    if bcrypt.checkpw(password.encode('utf-8'), user['password']):
        # Create JWT token
        access_token = create_access_token(identity=username)
        return jsonify({"token": access_token}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

# Protected Route Example
@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({"message": "You are viewing a protected route!"})