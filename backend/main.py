from fastapi import FastAPI, Request
from fastapi.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware
from contextlib import asynccontextmanager
import os
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

# CORS middleware - configurable for production
class CORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin")
        
        # Get allowed origins from environment or use defaults
        cors_origins = os.getenv("CORS_ORIGINS", "").split(",")
        if not cors_origins or cors_origins == [""]:
            # Default to localhost for development
            allowed_origins = [
                "http://localhost:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174",
            ]
        else:
            # Use environment variable origins (comma-separated)
            allowed_origins = [o.strip() for o in cors_origins if o.strip()]
        
        # Handle preflight OPTIONS request
        if request.method == "OPTIONS":
            response = Response()
            if origin in allowed_origins:
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Credentials"] = "true"
                response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS"
                response.headers["Access-Control-Allow-Headers"] = "*"
            return response
        
        # Process the request
        response = await call_next(request)
        
        # Add CORS headers to response
        if origin in allowed_origins:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "*"
        
        return response

app.add_middleware(CORSMiddleware)

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

