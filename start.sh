#!/bin/bash

# AntarikshaVaani - One-Click Launcher
# Author: Team Stackverse-labs

echo "=================================================="
echo "🚀 Launching AntarikshaVaani Space Mission AI..."
echo "=================================================="

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# 1. Kill any existing processes on 8000 and 3000
echo "🧹 Clearing ports 8000 and 3000..."
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

# 2. Start Backend
echo "⚙️ Starting FastAPI Backend on http://localhost:8000..."
cd "$DIR/backend"
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 3. Start Frontend
echo "🖥️ Starting Next.js Frontend on http://localhost:3000..."
cd "$DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo "=================================================="
echo "✅ AntarikshaVaani is LIVE!"
echo "📡 Backend API:    http://localhost:8000"
echo "🖥️ Frontend UI:    http://localhost:3000"
echo "=================================================="
echo "Press Ctrl+C to terminate both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM EXIT
wait
