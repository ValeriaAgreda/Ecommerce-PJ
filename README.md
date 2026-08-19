# Proyecto inicial: React + Node.js + MySQL

Plantilla mínima para comenzar un proyecto full-stack. La base de datos y sus tablas se crean de manera independiente en MySQL Workbench; este repositorio no contiene archivos SQL.

## Requisitos

- Node.js 20 o superior
- MySQL 8 o superior

## Configuración

1. Crea tu base de datos en MySQL Workbench.
2. Copia `backend/.env.example` como `backend/.env` y coloca el nombre y las credenciales de tu base de datos.
3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Inicia frontend y backend:

   ```bash
   npm run dev
   ```

Frontend: http://localhost:5173  
API: http://localhost:3000/api

## Rutas iniciales

- `GET /api/health`: comprueba que el backend está activo.
- `GET /api/database`: comprueba la conexión con la base creada en MySQL Workbench.
