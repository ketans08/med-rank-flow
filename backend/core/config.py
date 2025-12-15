from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    # Application
    app_name: str = "Med-Rank-Flow API"
    app_version: str = "1.0.0"
    environment: str = "development"  # development, staging, production
    debug: bool = False
    api_host: str = "0.0.0.0"
    api_port: int = int(os.getenv("PORT", "8000"))  # Render provides PORT env var
    
    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017/med_rank_flow"
    mongodb_db_name: str = "med_rank_flow"
    mongodb_max_pool_size: int = 100
    mongodb_min_pool_size: int = 10
    
    # Session Authentication (Simple token-based, no JWT)
    session_expiry_hours: int = 24  # Session expires after 24 hours
    
    
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


settings = Settings()

