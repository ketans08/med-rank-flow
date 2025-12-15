#!/bin/bash
# Start Backend Server

echo "🚀 Starting Med-Rank-Flow Backend..."
echo ""

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
if [ ! -f "venv/.installed" ]; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
    touch venv/.installed
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found! Copying from .env.example..."
    cp .env.example .env
    echo "✅ Please edit backend/.env with your MongoDB URL"
fi

# Check MongoDB connection (basic check)
echo "🔍 Checking MongoDB configuration..."
python3 -c "
import sys
try:
    from core.config import settings
    print(f'✓ MongoDB URL configured: {settings.mongodb_url[:40]}...')
    print(f'✓ CORS Origins: {len(settings.cors_origins)} configured')
    print(f'✓ API will run on port: {settings.api_port}')
except Exception as e:
    print(f'⚠️  Config check failed: {e}')
    print('   Make sure dependencies are installed: pip install -r requirements.txt')
    sys.exit(1)
" || exit 1

echo ""
echo "🌐 Starting FastAPI server on http://localhost:8000"
echo "📚 API docs available at http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop"
echo ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000

