from pydantic import BaseModel, EmailStr


class UserResponseSchema(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True

