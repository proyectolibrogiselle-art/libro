# ==============================================================================
# SCRIPT DE AUTOMATIZACIÓN GIT & CI/CD PARA CARMENIBANEZ.CL
# ==============================================================================

param (
    [string]$RemoteUrl = "https://github.com"
)

Write-Host ">>> Iniciando protocolo CI/CD para carmenibanez.cl..." -ForegroundColor Cyan

# 1. Localizar git.exe
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    $GitPaths = @(
        "C:\Program Files\Git\cmd\git.exe",
        "C:\Program Files\Git\bin\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe"
    )

    foreach ($path in $GitPaths) {
        if (Test-Path $path) {
            $gitDir = Split-Path -Parent $path
            $env:PATH = "$gitDir;$env:PATH"
            break
        }
    }
}

# 2. Inicializar repo si no existe y cambiar a main
if (-not (Test-Path ".git")) {
    git init
}
git branch -M main

# 3. Configurar identidad fija del autor
git config --local user.email "proyectolibrogiselle@gmail.com"
git config --local user.name "Carmen Ibanez"

# 4. Vincular origen remoto
git remote remove origin 2>$null
git remote add origin $RemoteUrl

# 5. Añadir todos los archivos y commit
git add .
git commit -m "sync: automatización de cambios y despliegue continuo"

# 6. Push forzado a la rama main
Write-Host ">>> Enviando cambios a $RemoteUrl..." -ForegroundColor Cyan
git push -u origin main --force
