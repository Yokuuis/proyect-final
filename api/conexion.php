<?php
require_once 'cors.php';

$host = 'localhost';
$dbname = 'sistema_crud';
$username = 'root';
$password = '';

try {
   $conexion = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
   // Configurar el modo de error de PDO para que lance excepciones
   $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
   // Configurar el charset a utf8
   $conexion->exec("SET NAMES utf8");
} catch (PDOException $e) {
   echo json_encode(["error" => $e->getMessage()]);
   die();
}
