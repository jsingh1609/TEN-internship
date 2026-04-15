@echo off
echo 🎯 Starting Skills Recommendation System...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Navigate to backend directory
cd /d "%~dp0backend"

REM Install dependencies
echo 📦 Installing dependencies...
pip install -q -r requirements.txt

echo.
echo ✅ Setup complete!
echo.
echo 🚀 Starting backend server on http://localhost:5000
echo 🚀 Starting frontend server on http://localhost:8000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start backend
start "Skills Recommendation Backend" cmd /k python app.py

REM Wait for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend
cd /d "%~dp0frontend"
start "Skills Recommendation Frontend" cmd /k python -m http.server 8000

echo.
echo ✨ Application is running!
echo 📱 Open http://localhost:8000 in your browser
echo.

pause
