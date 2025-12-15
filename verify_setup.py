#!/usr/bin/env python3
"""
Verification script to check if environment is properly configured
"""
import os
import sys
from pathlib import Path

def check_file_exists(filepath, description):
    """Check if a file exists"""
    if Path(filepath).exists():
        print(f"✓ {description}: {filepath}")
        return True
    else:
        print(f"✗ {description}: {filepath} - NOT FOUND")
        return False

def check_env_file(filepath, required_vars, description):
    """Check if .env file exists and has required variables"""
    if not Path(filepath).exists():
        print(f"✗ {description}: {filepath} - NOT FOUND")
        print(f"  Run: cp {filepath}.example {filepath}")
        return False
    
    print(f"✓ {description}: {filepath}")
    
    # Read and check variables
    with open(filepath, 'r') as f:
        content = f.read()
        missing = []
        for var in required_vars:
            if var not in content:
                missing.append(var)
        
        if missing:
            print(f"  ⚠ Missing variables: {', '.join(missing)}")
        else:
            print(f"  ✓ All required variables present")
    
    return True

def main():
    print("=" * 60)
    print("Med-Rank-Flow Environment Verification")
    print("=" * 60)
    print()
    
    all_good = True
    
    # Check backend
    print("Backend Configuration:")
    print("-" * 60)
    backend_env = check_env_file(
        "backend/.env",
        ["MONGODB_URL", "JWT_SECRET_KEY", "CORS_ORIGINS"],
        "Backend .env file"
    )
    if not backend_env:
        all_good = False
    
    check_file_exists("backend/requirements.txt", "Backend requirements.txt")
    check_file_exists("backend/main.py", "Backend main.py")
    print()
    
    # Check admin app
    print("Admin App Configuration:")
    print("-" * 60)
    admin_env = check_env_file(
        "med-rank-flow-admin/.env",
        ["VITE_API_URL"],
        "Admin app .env file"
    )
    if not admin_env:
        all_good = False
    
    check_file_exists("med-rank-flow-admin/package.json", "Admin package.json")
    check_file_exists("med-rank-flow-admin/src/services/api.ts", "Admin API service")
    print()
    
    # Check student app
    print("Student App Configuration:")
    print("-" * 60)
    student_env = check_env_file(
        "med-rank-flow-student/.env",
        ["VITE_API_URL"],
        "Student app .env file"
    )
    if not student_env:
        all_good = False
    
    check_file_exists("med-rank-flow-student/package.json", "Student package.json")
    check_file_exists("med-rank-flow-student/src/services/api.ts", "Student API service")
    print()
    
    # Summary
    print("=" * 60)
    if all_good:
        print("✓ All environment files are configured!")
        print()
        print("Next steps:")
        print("1. Start MongoDB (if using local MongoDB)")
        print("2. Start backend: cd backend && uvicorn main:app --reload")
        print("3. Start admin app: cd med-rank-flow-admin && npm run dev")
        print("4. Start student app: cd med-rank-flow-student && npm run dev")
    else:
        print("✗ Some configuration files are missing!")
        print("  Please create the missing .env files from .env.example")
        sys.exit(1)

if __name__ == "__main__":
    main()

