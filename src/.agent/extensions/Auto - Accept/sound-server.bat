@echo off
title Auto Accept Sound Server - Port 8765
color 0A
echo ============================================
echo    Auto Accept Sound Server
echo    Port: 8765 (CORS Enabled!)
echo ============================================
echo.
echo Starting local server for sound files...
echo Working directory: %~dp0
echo.

cd /d "%~dp0"

:: Check if Python is available
echo [INFO] Checking for Python...
python --version 2>&1
if %errorlevel% equ 0 (
    echo.
    echo [OK] Python found! Starting HTTP Server with CORS...
    echo [INFO] Server running at http://127.0.0.1:8765
    echo [INFO] Press Ctrl+C to stop the server
    echo ============================================
    echo.
    python cors_server.py
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Python server crashed with error code: %errorlevel%
        echo.
        pause
    )
    goto :end
)

:: Check if Node.js is available
echo [INFO] Python not found, checking for Node.js...
node --version 2>&1
if %errorlevel% equ 0 (
    echo.
    echo [OK] Node.js found! Starting HTTP Server with CORS...
    echo [INFO] Server running at http://127.0.0.1:8765
    echo [INFO] Press Ctrl+C to stop the server
    echo ============================================
    echo.
    npx -y http-server -p 8765 -c-1 --cors
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Node.js server crashed with error code: %errorlevel%
        echo.
        pause
    )
    goto :end
)

echo.
echo ============================================
echo [ERROR] Neither Python nor Node.js found!
echo ============================================
echo.
echo Please install one of them:
echo   - Python: https://www.python.org/downloads/
echo   - Node.js: https://nodejs.org/
echo.
pause
goto :realend

:end
echo.
echo ============================================
echo Server stopped.
echo ============================================
echo.
pause

:realend
