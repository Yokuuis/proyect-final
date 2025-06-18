<?php
require_once 'cors.php';
require_once 'conexion.php';

// Función para obtener todos los productos
function obtenerProductos()
{
   global $conexion;
   try {
      $query = "SELECT p.*, pr.nombre as nombre_proveedor 
                 FROM productos p 
                 LEFT JOIN proveedores pr ON p.proveedor_id = pr.id";
      $stmt = $conexion->prepare($query);
      $stmt->execute();
      return $stmt->fetchAll(PDO::FETCH_ASSOC);
   } catch (PDOException $e) {
      return ["error" => $e->getMessage()];
   }
}

// Función para obtener un producto por ID
function obtenerProducto($id)
{
   global $conexion;
   try {
      $query = "SELECT p.*, pr.nombre as nombre_proveedor 
                 FROM productos p 
                 LEFT JOIN proveedores pr ON p.proveedor_id = pr.id 
                 WHERE p.id = :id";
      $stmt = $conexion->prepare($query);
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->execute();
      return $stmt->fetch(PDO::FETCH_ASSOC);
   } catch (PDOException $e) {
      return ["error" => $e->getMessage()];
   }
}

// Función para crear un nuevo producto
function crearProducto($datos)
{
   global $conexion;
   try {
      $query = "INSERT INTO productos (nombre, descripcion, precio, imagen, proveedor_id) 
                 VALUES (:nombre, :descripcion, :precio, :imagen, :proveedor_id)";
      $stmt = $conexion->prepare($query);
      $stmt->bindParam(':nombre', $datos['nombre']);
      $stmt->bindParam(':descripcion', $datos['descripcion']);
      $stmt->bindParam(':precio', $datos['precio']);
      $stmt->bindParam(':imagen', $datos['imagen']);
      $stmt->bindParam(':proveedor_id', $datos['proveedor_id']);
      $stmt->execute();
      return ["id" => $conexion->lastInsertId()];
   } catch (PDOException $e) {
      return ["error" => $e->getMessage()];
   }
}

// Función para actualizar un producto
function actualizarProducto($id, $datos)
{
   global $conexion;
   try {
      $query = "UPDATE productos 
                 SET nombre = :nombre, 
                     descripcion = :descripcion, 
                     precio = :precio, 
                     imagen = :imagen, 
                     proveedor_id = :proveedor_id 
                 WHERE id = :id";
      $stmt = $conexion->prepare($query);
      $stmt->bindParam(':id', $id);
      $stmt->bindParam(':nombre', $datos['nombre']);
      $stmt->bindParam(':descripcion', $datos['descripcion']);
      $stmt->bindParam(':precio', $datos['precio']);
      $stmt->bindParam(':imagen', $datos['imagen']);
      $stmt->bindParam(':proveedor_id', $datos['proveedor_id']);
      $stmt->execute();
      return ["success" => true];
   } catch (PDOException $e) {
      return ["error" => $e->getMessage()];
   }
}

// Función para eliminar un producto
function eliminarProducto($id)
{
   global $conexion;
   try {
      $query = "DELETE FROM productos WHERE id = :id";
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
         echo json_encode(obtenerProducto($_GET['id']));
      } else {
         echo json_encode(obtenerProductos());
      }
      break;

   case 'POST':
      $datos = json_decode(file_get_contents('php://input'), true);
      echo json_encode(crearProducto($datos));
      break;

   case 'PUT':
      $datos = json_decode(file_get_contents('php://input'), true);
      $id = $_GET['id'];
      echo json_encode(actualizarProducto($id, $datos));
      break;

   case 'DELETE':
      $id = $_GET['id'];
      echo json_encode(eliminarProducto($id));
      break;

   default:
      http_response_code(405);
      echo json_encode(["error" => "Método no permitido"]);
      break;
}
