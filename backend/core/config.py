from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Application
    app_name: str = "Med-Rank-Flow API"
    app_version: str = "1.0.0"
    environment: str = "development"  # development, staging, production
    debug: bool = False
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    
    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017/med_rank_flow"
    mongodb_db_name: str = "med_rank_flow"
    mongodb_max_pool_size: int = 100
    mongodb_min_pool_size: int = 10
    
    # JWT Authentication
    jwt_secret_key: str = "your-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 1440  # 24 hours
    
    # CORS
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:5174"]
    cors_allow_credentials: bool = True
    cors_allow_methods: List[str] = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
    cors_allow_headers: List[str] = ["*"]
    
    # Security
    bcrypt_rounds: int = 12
    rate_limit_per_minute: int = 60
    
    # Logging
    log_level: str = "INFO"  # DEBUG, INFO, WARNING, ERROR, CRITICAL
    log_format: str = "json"  # json, text
    
    # Health Check
    health_check_enabled: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Parse CORS origins from comma-separated string if provided as string
        if isinstance(self.cors_origins, str):
            self.cors_origins = [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]
        # Parse CORS methods and headers if strings
        if isinstance(self.cors_allow_methods, str):
            self.cors_allow_methods = [m.strip() for m in self.cors_allow_methods.split(",") if m.strip()]
        if isinstance(self.cors_allow_headers, str):
            self.cors_allow_headers = [h.strip() for h in self.cors_allow_headers.split(",") if h.strip()]


settings = Settings()

