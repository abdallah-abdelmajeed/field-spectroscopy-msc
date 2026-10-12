@echo off
title Principles of Field Spectroscopy - Offline Launcher
echo ======================================================================
echo    Principles of Field Spectroscopy - MSc Course & Laboratory
echo    Launching Offline Platform on your Local PC...
echo ======================================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not in your system PATH!
    echo Please install Python 3 (https://www.python.org/downloads/)
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)

echo Starting standalone Python server...
python server.py --port 8000
pause
