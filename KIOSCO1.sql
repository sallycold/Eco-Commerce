CREATE SCHEMA kiosco;
USE kiosco;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    rol varchar(30) NULL
);

INSERT INTO usuarios (usuario, contrasena, email, rol) VALUES 
('catalina', '1234', 'catalina@kiosco.com', 'Administrador'),
('juan_perez', 'abcd5678', 'juan.perez@correo.com', 'Empleado'),
('gaby_admin', 'admin2026', 'gabriela@kiosco.com', 'Administrador'),
('carlos_m', 'empleado3', 'carlos.mendoza@correo.com', 'Empleado'),
('marina_lucero', 'cliente123', 'marina@gmail.com', 'Cliente');


CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    imagen TEXT NOT NULL,
    stock INT NOT NULL DEFAULT 0 ,
    categoria VARCHAR(70)
);

insert into usuarios (usuario,contrasena,email,rol) values('catalina','1234','ghjgj@gfhg', 'Administrador');

select * from usuarios;

INSERT INTO productos (nombre, precio, imagen, stock, categoria) VALUES 
( 'Alfajor', 250.00, 'https://imgs.search.brave.com/vnQPuqX6XhyRNJUDholfSeeRvnwhytw9mXa4ii-NbRE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2Q1L2Iz/LzYwL2Q1YjM2MDFk/MTNhNTUxOWI5OGJi/NmQ4ZmMwYTg3MDE5/LmpwZw', 50 , 'Golosinas'),

('Gomitas Mogul', 250.00, 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600', 100, 'Golosinas'),

('Ferrero Rocher', 250.00, 'https://imgs.search.brave.com/qeFkS4dYpnkJoN8-_btJetqDp2PmF3dXZaxv-Qhvy8Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI2/NTIzNzExMC9waG90/by9mZXJyZXJvLXJv/Y2hlci1jaG9jb2xh/dGUuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPW4zZVBEU19L/dXJHRFREZl_EYmN2/YVVGSmRadXV2ajZa/NU0wT1VfcUU3Wnc9', 30 , 'Golosinas'),

('Postre de helado Maracuya', 250.00, 'https://veganvvocals.com/wp-content/uploads/2021/07/Vegan-Passion-Fruit-Mango-Ice-Cream-6-scaled.jpg', 15, 'Postres'),

('Papas Lays', 250.00, 'https://www.appsuper.com.ar/wp-content/uploads/2020/05/Papas-Lays-clasicas-250-gr-600x629.jpg', 40, 'Snacks');

INSERT INTO productos (nombre, precio, imagen, stock, categoria) VALUES 
('Doritos Queso 150g', 700.00, 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fthfvnext.bing.com%2Fth%2Fid%2FOIP.wbuOVhe_Fs57v7ptLpVDDAHaHa%3Fcb%3Dthfvnextfalcon2%26pid%3DApi&sp=1781912000Te8e57b46ba7f9961840778ca1fd239c0627222c2867bd253651c96558202950b',70,'Snacks'),
('Maní Salado Pehuamar',900.00,'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fthfvnext.bing.com%2Fth%2Fid%2FOIP.TlMhoSbMYeTv5LlKiWK4hwHaHa%3Fcb%3Dthfvnextfalcon2%26pid%3DApi&sp=1781912207T052d0639d381a2c2e50ee68665c1b9e26dfdf9ce30c7ede6e09cc7bd449ae659',80,'Snacks'),
('Postre Danette Chocolate', 8000.99, 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fthfvnext.bing.com%2Fth%2Fid%2FOIP.IfoH_l4jjX7XRGbHZFtFMQHaFD%3Fr%3D0%26cb%3Dthfvnextfalcon2%26pid%3DApi&sp=1781912348T090267fd991afaa4a030f980f2b80ba079f8a3f205e7a85a6c95369d48f35df9',90,'Postres'),
('Helado Torpedo Frutilla',4000.00,'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fardiaprod.vtexassets.com%2Farquivos%2Fids%2F343959-500-auto%3Fv%3D638736549303170000%26width%3D500%26height%3Dauto%26aspect%3Dtrue&sp=1781912468T697c18e7cae57de420f7f75ed750d2648083a255460d764c9fd3e631c64694f6', 90,'Postres');

select * from productos;