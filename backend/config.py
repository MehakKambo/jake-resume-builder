import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DEBUG = False
    TESTING = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    MONGO_URI = os.getenv("MONGO_URI")

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

class TestingConfig(Config):
    TESTING = True
