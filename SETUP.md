# Configuración del Backend PHP

## 1. Configurar XAMPP

1. Inicia XAMPP Control Panel
2. Inicia Apache y MySQL
3. Verifica que Apache esté corriendo en el puerto 80

## 2. Crear la Base de Datos

1. Abre phpMyAdmin: http://localhost/phpmyadmin
2. Crea una nueva base de datos llamada `productos_db`
3. Ejecuta el script SQL proporcionado

## 3. Configurar los Archivos PHP

1. Crea la carpeta del proyecto en `C:\xampp\htdocs\tu-proyecto\`
2. Copia los archivos PHP en la estructura:
   \`\`\`
   C:\xampp\htdocs\tu-proyecto\
   ├── api\
   │   └── productos\
   │       ├── create.php
   │       ├── read.php
   │       ├── update.php
   │       └── delete.php
   └── uploads\ (crear esta carpeta)
   \`\`\`

## 4. Configurar Next.js

1. Crea el archivo `.env.local` en la raíz del proyecto Next.js
2. Configura la URL: `NEXT_PUBLIC_API_URL=http://localhost/tu-proyecto`
3. Reemplaza "tu-proyecto" con el nombre real de tu carpeta

## 5. Probar la Conexión

1. Usa el componente "Test de Conexión" en la página
2. Verifica que todos los endpoints respondan correctamente
3. Si hay errores, revisa:
   - XAMPP esté ejecutándose
   - La URL en .env.local sea correcta
   - Los archivos PHP estén en la ubicación correcta
   - La base de datos esté creada

## URLs de Prueba

- Backend: http://localhost/tu-proyecto/api/productos/read.php
- phpMyAdmin: http://localhost/phpmyadmin
- Frontend: http://localhost:3000
