from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

# Initialize MongoDB client using the URI from the environment variables
client = MongoClient(os.getenv("MONGO_URI"))
db = client['resume_builder']  # Set the database

# Import and register Blueprints
from auth.routes import auth_bp  # Import the auth blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')  # Register the auth blueprint under /auth


if __name__ == "__main__":
    app.run(debug=True)