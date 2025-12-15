#!/bin/bash
# Start Admin App

echo "🚀 Starting Med-Rank-Flow Admin App..."
echo ""

cd med-rank-flow-admin

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found! Copying from .env.example..."
    cp .env.example .env
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
fi

# Check API URL
API_URL=$(grep VITE_API_URL .env | cut -d '=' -f2)
echo "🔗 API URL: $API_URL"
echo ""

echo "🌐 Starting Admin App on http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev

