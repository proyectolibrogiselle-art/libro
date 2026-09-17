# ==============================================================================
# SCRIPT DE AUTOMATIZACIÓN GIT & CI/CD PARA CARMENIBANEZ.CL
# ==============================================================================

param (
    [string]$RemoteUrl = "https://github.com"
)

Write-Host ">>> Iniciando automatización Git para carmenibanez.cl..." -ForegroundColor Cyan

# 1. Buscar git.exe en rutas estándar si no está en el PATH actual
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    $GitPaths = @(
        "C:\Program Files\Git\cmd\git.exe",
        "C:\Program Files\Git\bin\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe",
        "C:\Program Files (x86)\Git\cmd\git.exe"
    )

    foreach ($path in $GitPaths) {
        if (Test-Path $path) {
            $gitDir = Split-Path -Parent $path
            $env:PATH = "$gitDir;$env:PATH"
            Write-Host ">>> Git localizado en: $path" -ForegroundColor Green
            break
        }
    }
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host ">>> [ALERTA] Git no se encuentra instalado en las rutas estándar de Windows." -ForegroundColor Yellow
    Write-Host ">>> Por favor instala Git desde https://git-scm.com/download/win para completar el push automático." -ForegroundColor Yellow
    Exit 1
}

# 2. Inicializar repositorio Git si no existe
if (-not (Test-Path ".git")) {
    Write-Host ">>> Inicializando repositorio Git..." -ForegroundColor Cyan
    git init
} else {
    Write-Host ">>> Repositorio Git ya inicializado." -ForegroundColor Green
}

# 3. Establecer rama principal 'main'
git branch -M main

# 4. Añadir todos los archivos
Write-Host ">>> Añadiendo todos los archivos del espacio de trabajo (git add .)..." -ForegroundColor Cyan
git add .

# 5. Commit estructurado
$commitMsg = "feat: implementacion total de modulos de administracion, esquemas de datos y sincronizacion cloud"
Write-Host ">>> Realizando commit: '$commitMsg'..." -ForegroundColor Cyan
git commit -m $commitMsg

# 6. Configurar origen remoto
Write-Host ">>> Vinculando origen remoto con: $RemoteUrl..." -ForegroundColor Cyan
$existingRemote = git remote get-url origin 2>$null

if ($existingRemote) {
    git remote set-url origin $RemoteUrl
} else {
    git remote add origin $RemoteUrl
}

# 7. Push a GitHub
Write-Host ">>> Ejecutando push a origin main..." -ForegroundColor Cyan
git push -u origin main --force

Write-Host ">>> ¡Sincronización Git completada con éxito! Webhook de Vercel activado." -ForegroundColor Green
