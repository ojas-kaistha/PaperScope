@echo off
echo ========================================================
echo   Starting PaperScope Next.js Research UI
echo   Running at http://localhost:3000 (accessible on network & dev tunnels)
echo ========================================================
cd frontend
if not exist ".next\BUILD_ID" (
    echo [PaperScope] Compiling optimized UI build for smooth DevTunnel performance...
    call npm run build
)
call npm run start
pause
