from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from database import get_db
from models import Task, User
from schemas import TaskCreate, TaskUpdate
from auth import get_current_user   # ✅ ADD THIS

router = APIRouter(prefix="/tasks", tags=["Tasks"])


# ---------------- CREATE TASK ----------------
@router.post("/")
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)   # ✅ ADD
):
    new_task = Task(
        title=task.title,
        description=task.description,
        due_date=task.due_date,
        status="pending",
        user_id=current_user.id   # ✅ IMPORTANT
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


# ---------------- GET ALL TASKS ----------------
@router.get("/")
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)   # ✅ ADD
):
    return db.query(Task).filter(Task.user_id == current_user.id).all()   # ✅ FIX


# ---------------- GET SINGLE TASK ----------------
@router.get("/{task_id}")
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)   # ✅ ADD
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id   # ✅ FIX
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


# ---------------- UPDATE TASK ----------------
@router.put("/{task_id}")
def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)   # ✅ ADD
):
    db_task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id   # ✅ FIX
    ).first()

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db_task.title = task.title
    db_task.description = task.description
    db_task.status = task.status
    db_task.due_date = task.due_date

    db.commit()
    db.refresh(db_task)
    return db_task


# ---------------- DELETE TASK ----------------
@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)   # ✅ ADD
):
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id   # ✅ FIX
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}