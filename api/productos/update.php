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
        $id = $_POST['id'] ?? '';
        $nombre = $_POST['nombre'] ?? '';
        $descripcion = $_POST['descripcion'] ?? '';
        $precio = $_POST['precio'] ?? 0;
        $proveedor = $_POST['proveedor'] ?? '';
        
        // Validaciones básicas
        if (empty($id) || empty($nombre) || empty($precio) || empty($proveedor)) {
            echo json_encode([
                'success' => false,
                'message' => 'ID, nombre, precio y proveedor son obligatorios'
            ]);
            exit;
        }
        
        // Verificar si el producto existe
        $check_sql = "SELECT imagen FROM productos WHERE id = :id";
        $check_stmt = $pdo->prepare($check_sql);
        $check_stmt->execute([':id' => $id]);
        $existing_product = $check_stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$existing_product) {
            echo json_encode([
                'success' => false,
                'message' => 'Producto no encontrado'
            ]);
            exit;
        }
        
        $imagen_path = $existing_product['imagen'];
        
        // Manejo de nueva imagen
        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = '../uploads/';
            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
            
            // Eliminar imagen anterior si existe
            if ($imagen_path && file_exists('..' . $imagen_path)) {
                unlink('..' . $imagen_path);
            }
            
            $file_extension = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
            $filename = uniqid() . '.' . $file_extension;
            $upload_path = $upload_dir . $filename;
            
            if (move_uploaded_file($_FILES['imagen']['tmp_name'], $upload_path)) {
                $imagen_path = '/uploads/' . $filename;
            }
        }
        
        // Actualizar en la base de datos
        $sql = "UPDATE productos 
                SET nombre = :nombre, descripcion = :descripcion, precio = :precio, 
                    proveedor = :proveedor, imagen = :imagen, updated_at = NOW() 
                WHERE id = :id";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':nombre' => $nombre,
            ':descripcion' => $descripcion,
            ':precio' => $precio,
            ':proveedor' => $proveedor,
            ':imagen' => $imagen_path
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Producto actualizado exitosamente'
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
