<?php
require_once 'cors.php';
require_once 'conexion.php';

// Función para obtener todos los proveedores
function obtenerProveedores()
{
   global $conexion;
   try {
      $query = "SELECT * FROM proveedores";
      $stmt = $conexion->prepare($query);
      $stmt->execute();
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
   } catch (PDOException $e) {
      return ["error" => $e->getMessage()];
   }
}

// Función para obtener un proveedor por ID
function obtenerProveedor($id)
{
   global $conexion;
   try {
      $query = "SELECT * FROM proveedores WHERE id = :id";
      $stmt = $conexion->prepare($query);
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->execute();
      return $stmt->fetch(PDO::FETCH_ASSOC);
   } catch (PDOException $e) {
      return ["error" => $e->getMessage()];
   }
}

// Función para crear un nuevo proveedor
function crearProveedor($datos)
{
   global $conexion;
   try {
      $query = "INSERT INTO proveedores (nombre) VALUES (:nombre)";
      $stmt = $conexion->prepare($query);
      $stmt->bindParam(':nombre', $datos['nombre']);
      $stmt->execute();
      return ["id" => $conexion->lastInsertId()];
   } catch (PDOException $e) {
      return ["error" => $e->getMessage()];
   }
}

// Función para actualizar un proveedor
function actualizarProveedor($id, $datos)
{
   global $conexion;
   try {
      $query = "UPDATE proveedores SET nombre = :nombre WHERE id = :id";
      $stmt = $conexion->prepare($query);
      $stmt->bindParam(':id', $id);
      $stmt->bindParam(':nombre', $datos['nombre']);
      $stmt->execute();
      return ["success" => true];
   } catch (PDOException $e) {
      return ["error" => $e->getMessage()];
   }
}

// Función para eliminar un proveedor
function eliminarProveedor($id)
{
   global $conexion;
   try {
      $query = "DELETE FROM proveedores WHERE id = :id";
      $stmt = $conexion->prepare($query);
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->execute();
      return ["success" => true];
   } catch (PDOException $e) {
      return ["error" => $e->getMessage()];
   }
}

// Manejar las peticiones HTTP
$metodo = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

switch ($metodo) {
   case 'GET':
      if (isset($_GET['id'])) {
         echo json_encode(obtenerProveedor($_GET['id']));
      } else {
         echo json_encode(obtenerProveedores());
      }
      break;

   case 'POST':
      $datos = json_decode(file_get_contents('php://input'), true);
      echo json_encode(crearProveedor($datos));
      break;

   case 'PUT':
      $datos = json_decode(file_get_contents('php://input'), true);
      $id = $_GET['id'];
      echo json_encode(actualizarProveedor($id, $datos));
      break;

   case 'DELETE':
      $id = $_GET['id'];
      echo json_encode(eliminarProveedor($id));
      break;

   default:
      http_response_code(405);
      echo json_encode(["error" => "Método no permitido"]);
      break;
}
