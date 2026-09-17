# REGLA DE PERSISTENCIA Y PROTOCOLO DE CIERRE CI/CD
Proyecto: carmenibanez.cl
Entorno: c:\libro

## 1. Identidad de Autor Fija
En toda interacción y commit de Git en este proyecto:
- Email: `proyectolibrogiselle@gmail.com`
- Nombre: `Carmen Ibanez`

Comandos de configuración:
```bash
git config --local user.email "proyectolibrogiselle@gmail.com"
git config --local user.name "Carmen Ibanez"
```

## 2. Configuración Remota
- URL Remota: `https://github.com` (o la URL del repositorio vinculada)

## 3. Protocolo Obligatorio de Cierre al Final de Cada Prompt
Cada vez que se cree, modifique o extienda código en `c:\libro`, se DEBE ejecutar internamente y de manera automática la secuencia:
1. `git remote remove origin`
2. `git remote add origin https://github.com`
3. `git add .`
4. `git commit -m "sync: automatización de cambios y despliegue continuo"`
5. `git push -u origin main --force`
