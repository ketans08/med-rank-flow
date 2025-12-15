from beanie import Document
from typing import Literal
from pydantic import EmailStr, Field


class User(Document):
    name: str
    email: EmailStr = Field(unique=True)
    password_hash: str
    role: Literal["admin", "student"]
    
    class Settings:
        name = "users"
        indexes = ["email"]

