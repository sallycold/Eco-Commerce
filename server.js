const express = require("express");
const path = require("path");
const cors = require("cors");
const loginRoutes = require("./Login");

const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});