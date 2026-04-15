#!/bin/bash

echo "🎯 Starting Skills Recommendation System..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Install dependencies if not already installed
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

echo "📦 Activating virtual environment..."
source venv/bin/activate

echo "📦 Installing dependencies..."
pip install -q -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting backend server on http://localhost:5000"
echo "🚀 Starting frontend server on http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start backend in background
python app.py &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 2

# Start frontend server
cd ../frontend
python3 -m http.server 8000 &
FRONTEND_PID=$!

echo ""
echo "✨ Application is running!"
echo "📱 Open http://localhost:8000 in your browser"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
