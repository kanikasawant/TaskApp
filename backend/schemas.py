from pydantic import BaseModel
from datetime import date

# ===== USER SCHEMAS =====
class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True

# ===== TASK SCHEMAS =====
class TaskBase(BaseModel):
    title: str
    description: str
    due_date: date

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    status: str

class TaskResponse(TaskBase):
    id: int
    status: str

    class Config:
        from_attributes = True