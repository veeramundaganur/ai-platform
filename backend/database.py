import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, MetaData
from databases import Database

load_dotenv()  # Load variables from .env file

DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_PORT = os.getenv("DB_PORT", "5432")  # default to 5432 if not in env

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# SQLAlchemy Engine and Database
engine = create_engine(DATABASE_URL)
metadata = MetaData()
database = Database(DATABASE_URL)
