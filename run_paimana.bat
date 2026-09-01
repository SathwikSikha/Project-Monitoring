@echo off
setlocal enabledelayedexpansion

set "PROJECT_ROOT=%~dp0"
if "%PROJECT_ROOT:~-1%"=="\" set "PROJECT_ROOT=%PROJECT_ROOT:~0,-1%"
cd /d "%PROJECT_ROOT%"
title PAIMANA Platform Launcher

echo ==============================================================================
echo   PAIMANA - Project Assessment, Intelligence, Monitoring ^& Analytics
echo   Smart India Hackathon (SIH) 2026 Platform Launcher
echo ==============================================================================
echo.

:: 1. Verify Python Availability
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not found in PATH. Please install Python 3.10+ and add it to PATH.
    echo.
    pause
    exit /b 1
)

:: 2. Check if ML models and database are ready
if not exist "%PROJECT_ROOT%\ml\models\risk_model.pkl" (
    echo [SETUP] ML models not found. Generating dataset and training models...
    python "%PROJECT_ROOT%\ml\generate_dataset.py"
    python "%PROJECT_ROOT%\ml\train_models.py"
    python -m backend.seed_data
    echo [SETUP] ML models and database initialized successfully.
    echo.
)

:: 3. Check if frontend node_modules exists
if not exist "%PROJECT_ROOT%\frontend\node_modules\" (
    echo [SETUP] Frontend dependencies not found. Installing node packages...
    cd /d "%PROJECT_ROOT%\frontend"
    call npm install
    cd /d "%PROJECT_ROOT%"
    echo [SETUP] Frontend dependencies installed successfully.
    echo.
)

:: 4. Start FastAPI Backend (if not already running on port 8000)
netstat -ano | findstr :8000 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] FastAPI backend is already active on http://127.0.0.1:8000.
) else (
    echo [1/3] Starting FastAPI Backend on http://127.0.0.1:8000 ...
    start "PAIMANA Backend (FastAPI)" "%PROJECT_ROOT%\start_backend.bat"
)

:: 5. Health Check: Poll http://127.0.0.1:8000/health until responsive
echo [2/3] Verifying Backend health at http://127.0.0.1:8000/health ...
set /a attempts=0
set /a max_attempts=15
set "backend_ready=0"

:HEALTHCHECK_LOOP
timeout /t 1 /nobreak >nul
python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=2)" >nul 2>&1
if %errorlevel% equ 0 (
    set "backend_ready=1"
    goto HEALTHCHECK_SUCCESS
)

set /a attempts+=1
if %attempts% lss %max_attempts% (
    echo       ... waiting for backend (attempt %attempts%/%max_attempts%)
    goto HEALTHCHECK_LOOP
)

:: If Backend Healthcheck Failed
echo.
echo ==============================================================================
echo [ERROR] PAIMANA BACKEND FAILED TO START OR TIMED OUT!
echo ==============================================================================
echo Please inspect the "PAIMANA Backend (FastAPI)" window to view the Python error.
echo Common issues:
echo   1. Missing Python dependencies (run: pip install -r backend\requirements.txt)
echo   2. Another application is blocking port 8000.
echo ==============================================================================
echo.
pause
exit /b 1

:HEALTHCHECK_SUCCESS
echo [SUCCESS] Backend is healthy and responding with HTTP 200 (status: healthy).
echo.

:: 6. Start React/Vite Frontend (if not already running on port 5173)
netstat -ano | findstr :5173 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] React Vite frontend is already active on http://localhost:5173.
) else (
    echo [3/3] Starting React Vite Frontend on http://localhost:5173 ...
    start "PAIMANA Frontend (Vite)" "%PROJECT_ROOT%\start_frontend.bat"
)

:: 7. Wait for Frontend to become ready
echo Verifying Frontend at http://localhost:5173 ...
set /a fe_attempts=0
set /a fe_max=10

:FE_HEALTHCHECK_LOOP
timeout /t 1 /nobreak >nul
python -c "import urllib.request; urllib.request.urlopen('http://localhost:5173', timeout=2)" >nul 2>&1
if %errorlevel% equ 0 (
    goto FE_SUCCESS
)
set /a fe_attempts+=1
if %fe_attempts% lss %fe_max% (
    goto FE_HEALTHCHECK_LOOP
)

:FE_SUCCESS
echo [SUCCESS] Frontend is ready.
echo.
echo ==============================================================================
echo   PAIMANA Platform is LIVE!
echo   - Frontend Application: http://localhost:5173
echo   - Backend REST API:     http://127.0.0.1:8000
echo   - Swagger API Docs:     http://127.0.0.1:8000/docs
echo   - Backend Health Check: http://127.0.0.1:8000/health
echo ==============================================================================
echo.
echo Opening PAIMANA Dashboard in your default browser...
start "" "http://localhost:5173"
echo.
echo Both servers are running in separate dedicated terminal windows.
echo You can close this launcher window at any time.
echo ==============================================================================
timeout /t 5
