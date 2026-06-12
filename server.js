const express = require("express");// Framework para crear el servidor HTTP y gestionar rutas
const path = require("path");// Módulo nativo de Node.js para manejar y normalizar rutas de archivos
const cors = require("cors"); // Middleware para permitir solicitudes de recursos desde otros dominios (CORS)
const loginRoutes = require("./Login");// Importa las rutas de autenticación definidas en el archivo Login.js

const app = express();//Inicialización de la aplicación
app.use(cors());// Habilita CORS para evitar problemas de seguridad al conectar con el frontend
app.use(express.json());// Permite que el servidor entienda y procese datos en formato JSON que vengan en el cuerpo (body) de las peticiones


// Servir la carpeta de programas
app.use(express.static(path.join(__dirname, "Programas")));

// Servir los estilos
app.use(
    "/estilos",
    express.static(path.join(__dirname, "Programas", "estilos"))
);

// Conectar las rutas de Login.js
app.use(loginRoutes);

// URLs de las páginas
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Programas", "Kios_login.html"));
});

app.get("/ventas", (req, res) => {
    res.sendFile(path.join(__dirname, "Programas", "ventaspag2.html"));
});

app.get("/olvide-contrasena", (req, res) => {
    res.sendFile(path.join(__dirname, "Programas", "olvide-contrasena.html"));
});

app.get("/abm_productos", (req, res) => {
    res.sendFile(path.join(__dirname, "Programas", "abm_productos.html"));
});

app.get("/registro", (req, res) => {
    res.sendFile(path.join(__dirname, "Programas", "registro.html"));
});
// Inicialización del servidor
// Hace que la aplicación escuche las peticiones en el puerto 3000
app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});
