CREATE SCHEMA kiosco;
USE kiosco;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    rol varchar(30) NULL
);



CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    imagen TEXT NOT NULL,
    stock INT NOT NULL DEFAULT 0 
);

insert into usuarios (usuario,contrasena,email,rol) values('catalina','1234','ghjgj@gfhg', 'Administrador');

select * from usuarios;

INSERT INTO productos (nombre, precio, imagen, stock) VALUES 
( 'Alfajor', 250.00, 'https://imgs.search.brave.com/vnQPuqX6XhyRNJUDholfSeeRvnwhytw9mXa4ii-NbRE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2Q1L2Iz/LzYwL2Q1YjM2MDFk/MTNhNTUxOWI5OGJi/NmQ4ZmMwYTg3MDE5/LmpwZw', 50),

('Gomitas Mogul', 250.00, 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600', 100),

('Ferrero Rocher', 250.00, 'https://imgs.search.brave.com/qeFkS4dYpnkJoN8-_btJetqDp2PmF3dXZaxv-Qhvy8Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI2/NTIzNzExMC9waG90/by9mZXJyZXJvLXJv/Y2hlci1jaG9jb2xh/dGUuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPW4zZVBEU19L/dXJHRFREZl_EYmN2/YVVGSmRadXV2ajZa/NU0wT1VfcUU3Wnc9', 30),

('Postre de helado Maracuya', 250.00, 'https://veganvvocals.com/wp-content/uploads/2021/07/Vegan-Passion-Fruit-Mango-Ice-Cream-6-scaled.jpg', 15),

('Papas Lays', 250.00, 'https://www.appsuper.com.ar/wp-content/uploads/2020/05/Papas-Lays-clasicas-250-gr-600x629.jpg', 40);



