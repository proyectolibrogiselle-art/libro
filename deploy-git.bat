@echo off
REM ==============================================================================
REM SCRIPT DE AUTOMATIZACIÓN GIT & CI/CD PARA CARMENIBANEZ.CL (BATCH)
REM ==============================================================================
SET REMOTE_URL=https://github.com/proyectolibrogiselle-art/libro.git

where git >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    IF EXIST "C:\Program Files\Git\cmd\git.exe" SET PATH=C:\Program Files\Git\cmd;%PATH%
    IF EXIST "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" SET PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%
)

git config --local user.email "proyectolibrogiselle@gmail.com"
git config --local user.name "Carmen Ibanez"

git remote remove origin 2>nul
git remote add origin %REMOTE_URL%

git add .
git commit -m "auto-sync: actualización continua" 2>nul
git push -u origin main --force
