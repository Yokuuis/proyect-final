<?php
require_once 'cors.php';
require_once 'conexion.php';

function login($usuario, $password)
{
   global $conexion;
   try {
      $query = "SELECT * FROM usuarios WHERE usuario = :usuario AND password = SHA2(:password, 512) LIMIT 1";
      $stmt = $conexion->prepare($query);
      $stmt->bindParam(':usuario', $usuario);
      $stmt->bindParam(':password', $password);
      $stmt->execute();
      $user = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($user) {
         // Puedes guardar sesión aquí si quieres
         return ["success" => true, "tipo_usuario" => $user['tipo_usuario'], "usuario" => $user['usuario']];
      } else {
         return ["success" => false, "error" => "Usuario o contraseña incorrectos"];
      }
   } catch (PDOException $e) {
      return ["success" => false, "error" => $e->getMessage()];
   }
}

function registrar($usuario, $password, $tipo_usuario)
{
   global $conexion;
   try {
      // Verifica si ya existe
      $query = "SELECT id FROM usuarios WHERE usuario = :usuario";
      $stmt = $conexion->prepare($query);
      $stmt->bindParam(':usuario', $usuario);
      $stmt->execute();
      if ($stmt->fetch()) {
         return ["success" => false, "error" => "El usuario ya existe"];
      }
      // Inserta
      $query = "INSERT INTO usuarios (usuario, password, tipo_usuario) VALUES (:usuario, SHA2(:password, 512), :tipo_usuario)";
      $stmt = $conexion->prepare($query);
      $stmt->bindParam(':usuario', $usuario);
      $stmt->bindParam(':password', $password);
      $stmt->bindParam(':tipo_usuario', $tipo_usuario);
      $stmt->execute();
      return ["success" => true];
   } catch (PDOException $e) {
      return ["success" => false, "error" => $e->getMessage()];
   }
}

$metodo = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

if ($metodo === 'POST') {
   $data = json_decode(file_get_contents('php://input'), true);
   if (!empty($data['registro'])) {
      $usuario = $data['usuario'] ?? '';
      $password = $data['password'] ?? '';
      $tipo_usuario = $data['tipo_usuario'] ?? 'usuario';
      echo json_encode(registrar($usuario, $password, $tipo_usuario));
      exit;
   } else {
      $usuario = $data['usuario'] ?? '';
      $password = $data['password'] ?? '';
      echo json_encode(login($usuario, $password));
      exit;
   }
} else {
   http_response_code(405);
   echo json_encode(["error" => "Método no permitido"]);
   exit;
}
