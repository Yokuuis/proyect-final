<?php
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$allowed_origins = [
   'http://localhost:3000', // Next.js
   'http://localhost',      // PHP
   // Agrega aquí otros orígenes si los necesitas
];

if (in_array($origin, $allowed_origins)) {
   header("Access-Control-Allow-Origin: $origin");
   header("Access-Control-Allow-Credentials: true");
}

// Permitir métodos HTTP específicos
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// Permitir headers específicos
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
// Establecer el tipo de contenido
header("Content-Type: application/json; charset=UTF-8");

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
   http_response_code(200);
   exit();
}
