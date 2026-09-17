# REGLA DE PERSISTENCIA Y CI/CD OBLIGATORIA
Proyecto: carmenibanez.cl
Repositorio Oficial: https://github.com/proyectolibrogiselle-art/libro.git

## 1. Identidad de Autor Fija
- Email: `proyectolibrogiselle@gmail.com`
- Nombre: `Carmen Ibanez`

Configuración en entorno local:
```bash
git config --local user.email "proyectolibrogiselle@gmail.com"
git config --local user.name "Carmen Ibanez"
```

## 2. Configuración Remota Fija
- Origen Remoto: `https://github.com/proyectolibrogiselle-art/libro.git`
- Rama Principal: `main`

## 3. Protocolo Obligatorio de Cierre al Final de CADA Prompt
Tras crear, modificar o extender cualquier archivo de código en `c:\libro`, se DEBE ejecutar obligatoriamente de forma interna al final del prompt la siguiente secuencia de sincronización:
```bash
git add .
git commit -m "auto-sync: actualización continua"
git push origin main
```
