<?php
require_once 'cors.php';
require_once 'conexion.php';

try {
   // Intentar obtener todos los productos
   $query = "SELECT * FROM productos LIMIT 1";
   $stmt = $conexion->prepare($query);
   $stmt->execute();
   $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

   echo "Conexión exitosa a la base de datos!<br>";
   echo "Primer producto encontrado:<br>";
   print_r($resultado);
} catch (PDOException $e) {
   echo "Error: " . $e->getMessage();
}
