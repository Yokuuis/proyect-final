<?php
require_once 'cors.php';

$host = 'localhost';
$dbname = 'sistema_crud';
$username = 'root';
$password = '';

header('Content-Type: application/json');

try {
   $conexion = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
   $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
   $conexion->exec("SET NAMES utf8");
   echo json_encode(["success" => true, "message" => "Conexión exitosa a la base de datos sistema_crud"]);
} catch (PDOException $e) {
   echo json_encode(["success" => false, "message" => "Error de conexión: " . $e->getMessage()]);
}
