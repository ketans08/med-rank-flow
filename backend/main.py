from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core.config import settings
from core.database import connect_to_mongo, close_mongo_connection
from routes import auth, tasks, analytics, users

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


app = FastAPI(
    title="Med-Rank-Flow API",
    description="Medical Institute ERP - Patient-linked task management system",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware - Handle both string and list formats from settings
cors_origins = settings.cors_origins
if isinstance(cors_origins, str):
    cors_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]
elif not isinstance(cors_origins, list):
    cors_origins = ["http://localhost:5173", "http://localhost:5174"]

cors_methods = settings.cors_allow_methods
if isinstance(cors_methods, str):
    cors_methods = [m.strip() for m in cors_methods.split(",") if m.strip()]
elif not isinstance(cors_methods, list):
    cors_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]

cors_headers = settings.cors_allow_headers
if isinstance(cors_headers, str):
    cors_headers = [h.strip() for h in cors_headers.split(",") if h.strip()]
elif not isinstance(cors_headers, list):
    cors_headers = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=cors_methods,
    allow_headers=cors_headers,
)

# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(analytics.router)
app.include_router(users.router)


@app.get("/")
async def root():
    return {"message": "Med-Rank-Flow API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

