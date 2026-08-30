@echo off
cd /d "%~dp0frontend"
title PAIMANA Frontend (Vite)

echo ==============================================================================
echo   PAIMANA - React Vite Frontend
echo   Local App: http://localhost:5173
echo ==============================================================================
echo.

if not exist "node_modules\" (
    echo [SETUP] node_modules not found. Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo ==============================================================================
    echo [ERROR] React Vite frontend failed to start or crashed with error code %errorlevel%!
    echo ==============================================================================
    pause
)
