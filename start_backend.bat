@echo off
cd /d "%~dp0"
title PAIMANA Backend (FastAPI)

echo ==============================================================================
echo   PAIMANA - FastAPI Backend Service
echo   Swagger Docs: http://127.0.0.1:8000/docs
echo   Health Check: http://127.0.0.1:8000/health
echo ==============================================================================
echo.

python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000

if %errorlevel% neq 0 (
    echo.
    echo ==============================================================================
    echo [ERROR] FastAPI backend failed to start or crashed with error code %errorlevel%!
    echo ==============================================================================
    pause
)
