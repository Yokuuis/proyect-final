<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "productos_db";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $nombre = $_POST['nombre'] ?? '';
        $descripcion = $_POST['descripcion'] ?? '';
        $precio = $_POST['precio'] ?? 0;
        $proveedor = $_POST['proveedor'] ?? '';
        
        // Validaciones básicas
        if (empty($nombre) || empty($precio) || empty($proveedor)) {
            echo json_encode([
                'success' => false,
                'message' => 'Nombre, precio y proveedor son obligatorios'
            ]);
            exit;
        }
        
        $imagen_path = null;
        
        // Manejo de imagen
        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = '../uploads/';
            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
            
            $file_extension = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
            $filename = uniqid() . '.' . $file_extension;
            $upload_path = $upload_dir . $filename;
            
            if (move_uploaded_file($_FILES['imagen']['tmp_name'], $upload_path)) {
                $imagen_path = '/uploads/' . $filename;
            }
        }
        
        // Insertar en la base de datos
        $sql = "INSERT INTO productos (nombre, descripcion, precio, proveedor, imagen, created_at) 
                VALUES (:nombre, :descripcion, :precio, :proveedor, :imagen, NOW())";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nombre' => $nombre,
            ':descripcion' => $descripcion,
            ':precio' => $precio,
            ':proveedor' => $proveedor,
            ':imagen' => $imagen_path
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Producto creado exitosamente',
            'product_id' => $pdo->lastInsertId()
        ]);
        
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Método no permitido'
        ]);
    }
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error de base de datos: ' . $e->getMessage()
    ]);
}
?>
