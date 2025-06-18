-- Crear base de datos
CREATE DATABASE IF NOT EXISTS productos_db;
USE productos_db;

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    proveedor VARCHAR(255) NOT NULL,
    imagen VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, proveedor) VALUES
('MacBook Pro 14', 'Laptop profesional con chip M3 Pro', 2499.99, 'Apple Inc.'),
('iPhone 15 Pro', 'Smartphone con cámara profesional', 1199.99, 'Apple Inc.'),
('Samsung Galaxy S24', 'Smartphone Android flagship', 899.99, 'Samsung'),
('Dell XPS 13', 'Ultrabook compacto y potente', 1299.99, 'Dell'),
('Sony WH-1000XM5', 'Audífonos con cancelación de ruido', 399.99, 'Sony');
