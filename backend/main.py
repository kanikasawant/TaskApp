from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# import routers
from routes import router as tasks_router
from auth import router as auth_router
import models
from database import engine

# create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# ✅ FIXED CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✔️ correct
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "TaskApp API is running"}

# include routers
app.include_router(auth_router)
app.include_router(tasks_router)