# ==============================================================================
# SCRIPT DE AUTOMATIZACIÓN GIT & CI/CD PARA CARMENIBANEZ.CL
# ==============================================================================

param (
    [string]$RemoteUrl = "https://github.com/proyectolibrogiselle-art/libro.git"
)

Write-Host ">>> Iniciando sincronización CI/CD con $RemoteUrl..." -ForegroundColor Cyan

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

# 2. Configurar identidad fija
git config --local user.email "proyectolibrogiselle@gmail.com"
git config --local user.name "Carmen Ibanez"

# 3. Vincular origen remoto oficial
git remote remove origin 2>$null
git remote add origin $RemoteUrl

# 4. Añadir, commit y push
git add .
git commit -m "auto-sync: actualización continua" 2>$null
Write-Host ">>> Enviando cambios al repositorio remoto..." -ForegroundColor Cyan
git push -u origin main --force
