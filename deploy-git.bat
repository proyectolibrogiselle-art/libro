@echo off
REM ==============================================================================
REM SCRIPT DE AUTOMATIZACIÓN GIT & CI/CD PARA CARMENIBANEZ.CL (BATCH)
REM ==============================================================================
echo =======================================================
echo Iniciando sincronizacion Git para carmenibanez.cl...
echo =======================================================

SET REMOTE_URL=https://github.com

REM Verificar Git en PATH
where git >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    IF EXIST "C:\Program Files\Git\cmd\git.exe" SET PATH=C:\Program Files\Git\cmd;%PATH%
    IF EXIST "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" SET PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%
)

where git >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git no se encuentra en el PATH. Instala Git o agregalo al PATH del sistema.
    pause
    exit /b 1
)

IF NOT EXIST ".git" (
    echo Inicializando repositorio Git...
    git init
)

echo Cambiando a rama main...
git branch -M main

echo Anadiendo archivos...
git add .

echo Creando commit estructurado...
git commit -m "feat: implementacion total de modulos de administracion, esquemas de datos y sincronizacion cloud"

echo Configurando origen remoto...
git remote remove origin 2>nul
git remote add origin %REMOTE_URL%

echo Enviando cambios a GitHub...
git push -u origin main --force

echo =======================================================
echo Despliegue Git completado con exito.
echo =======================================================
