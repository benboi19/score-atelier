@echo off
echo ================================================
echo    Privacy Checker - Complete System Startup
echo ================================================
echo.
echo Starting Backend on port 8003...
echo Starting Frontend on port 8080...
echo.
echo URLs:
echo   Frontend: http://localhost:8080
echo   Backend:  http://localhost:8003
echo   API Docs: http://localhost:8003/docs
echo.
echo Press Ctrl+C in either window to stop
echo ================================================
echo.

start "Privacy Backend" cmd /k "C:/Python313/python.exe start_backend.py"
timeout /t 3 /nobreak >nul
start "Privacy Frontend" cmd /k "start_frontend.bat"

echo.
echo Both services are starting...
echo Check the opened windows for status
pause