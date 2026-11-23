@echo off
echo ========================================================
echo   Starting PaperScope 100%% Local Offline AI Backend
echo   No Cloud APIs - No Ollama - Direct Local Inference
echo ========================================================
call .\.venv312\Scripts\activate.bat
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload --timeout-keep-alive 180
pause
