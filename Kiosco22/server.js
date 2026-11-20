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



// ===================================================

// URLs de las páginas (CORREGIDO PARA INICIAR EN VENTAS)

// ===================================================



// Al entrar a http://localhost:3000/ ahora cargará la Tienda/Ventas

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "Programas", "ventaspag2.html"));

});



// Dejamos también la ruta alternativa por si querés escribir /ventas explícitamente

app.get("/ventas", (req, res) => {

    res.sendFile(path.join(__dirname, "Programas", "ventaspag2.html"));

});



// Pasamos el Login a su propia ruta para que no se pierda el archivo

app.get("/login", (req, res) => {

    res.sendFile(path.join(__dirname, "Programas", "Kios_login.html"));

});


app.get("/abm_usauario", (req, res) => {

    res.sendFile(path.join(__dirname, "Programas", "abm_usauario.html"));

});

app.get("/olvide-contrasena", (req, res) => {

    res.sendFile(path.join(__dirname, "Programas", "olvide-contrasena.html"));

});



//res.sendFile: Se encarga de responder a la petición del navegador enviándole el archivo HTML correspondiente para que lo renderice.

app.get("/abm_productos", (req, res) => {

    res.sendFile(path.join(__dirname, "Programas", "abm_productos.html"));

});



//__dirname: Es una variable global de Node.js que contiene la ruta absoluta del directorio donde se encuentra este archivo server.js.

app.get("/registro", (req, res) => {

    res.sendFile(path.join(__dirname, "Programas", "registro.html"));

});




app.listen(3000, () => {

    console.log("Servidor en http://localhost:3000");

}); 

