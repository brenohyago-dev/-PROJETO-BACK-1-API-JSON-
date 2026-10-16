CREATE DATABASE IF NOT EXISTS nasa_db;
USE nasa_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS fotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    url_imagem VARCHAR(255) NOT NULL,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT INTO usuarios (nome, email) VALUES 
('Astronauta Jessica', 'jessica@nasa.gov'),
('Astronauta Luke', 'luke@nasa.gov');

INSERT INTO fotos (titulo, url_imagem, usuario_id) VALUES 
('Galáxia Andrômeda', 'https://www.nasa.gov/wp-content/uploads/2023/03/52763262961_2d667c4e51_k.jpg', 1),
('Superfície de Marte', 'https://www.nasa.gov/wp-content/uploads/2023/03/52763262961_2d667c4e51_k.jpg', 1),
('Nebulosa de Órion', 'https://www.nasa.gov/wp-content/uploads/2023/03/52763262961_2d667c4e51_k.jpg', 2),
('Telescópio James Webb', 'https://www.nasa.gov/wp-content/uploads/2023/03/52763262961_2d667c4e51_k.jpg', 2);
