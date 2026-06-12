const express = require("express"); //Trae el framework Express (podés usar las funciones de Express en este archivo)
const db = require("./BaseDatos"); 
const router = express.Router();//permite crear este router para agrupar rutas que tengan sentido juntas (como todo lo relacionado a Login y Usuarios).

// PROCESAR LOGIN CON CONTROL DE ROL 
//req (Request): Es un objeto lleno de información que viene desde el navegador del usuario. Contiene cosas como qué datos escribieron en el formulario 
//res (Response): Es un objeto con métodos que usás vos para responderle al navegador. Tiene funciones como res.status() (para decir si salió todo bien o mal) o res.json() (para mandarle datos de vuelta al usuario).
router.post("/login", (req, res) => { 
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    db.query(
        "SELECT * FROM usuarios WHERE usuario = ?",
        [usuario],
        (err, results) => { 
            if (err) {
                return res.status(500).json({ error: "Error interno del servidor" });
            }
            
            if (results.length === 0) {
                return res.status(401).json({ error: "Usuario o contraseña incorrecto" });
            }

            const usuarioEncontrado = results[0];

            // Comparación directa en texto plano
            if (contrasena !== usuarioEncontrado.contrasena) {
                return res.status(401).json({ error: "Usuario o Contraseña incorrecta" });
            }

            // ÉXITO: Mandamos el rol en un objeto JSON limpio
            res.status(200).json({ 
                mensaje: "Login correcto", 
                rol: usuarioEncontrado.rol 
            });
        }
    );
});

// 2. REGISTRAR (Guarda usuario, email y contraseña )
router.post("/registrar", (req, res) => {
    const { usuario, email, contrasena } = req.body; 

    if (!usuario || !email || !contrasena) {
        return res.status(400).send("Faltan datos obligatorios");
    }

    try {
        db.query(
            "INSERT INTO usuarios (usuario, email, contrasena) VALUES (?, ?, ?)",
            [usuario, email, contrasena], 
            (err) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(400).send("El usuario o el correo ya existen");
                    }
                    return res.status(500).send("Error al registrar en la base de datos");
                }
                res.send("Usuario registrado correctamente");
            }
        );
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
});


// RECUPERACIÓN DE CONTRASEÑA
router.post("/recuperar-password", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send("Falta el correo");
    }

    db.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        (err, results) => {
            if (err) return res.status(500).send("Error en la base de datos");
            if (results.length === 0) return res.status(404).send("El correo no está registrado.");

            // Generamos un número al azar de 5 dígitos (entre 10000 y 99999)
            const numeroAzar = Math.floor(10000 + Math.random() * 90000);
            
            // Guardamos en la memoria del servidor para validar después
            codigoVerificacionTemporal = numeroAzar.toString();
            correoVerificacionTemporal = email;

            // Imprimimos el código en letras gigantes en tu Git Bash
            console.log("==================================================");
            console.log(`[CÓDIGO GENERADO] El correo ${email} solicita recuperar clave.`);
            console.log(` TU CÓDIGO DE 5 DÍGITOS ES:  ${codigoVerificacionTemporal}  `);
            console.log("==================================================");

            res.send("Código enviado. Revisá la terminal de tu servidor.");
        }
    );
});

// VERIFICAR EL CÓDIGO DE 5 DÍGITOS ES CORRECTO 
router.post("/verificar-codigo", (req, res) => {
    const { codigo } = req.body;

    if (!codigo) {
        return res.status(400).send("Falta escribir el código");
    }

    if (codigo === codigoVerificacionTemporal) {
        res.status(200).send("Código correcto");
    } else {
        res.status(400).send("El código de 5 dígitos es incorrecto.");
    }
});

// GUARDAR LA NUEVA CONTRASEÑA 
router.post("/actualizar-password", (req, res) => {
    const { nuevaContrasena } = req.body;

    if (!nuevaContrasena) {
        return res.status(400).send("Falta la nueva contraseña");
    }

    if (!correoVerificacionTemporal) {
        return res.status(400).send("Sesión de recuperación expirada o inválida");
    }

    db.query(
        "UPDATE usuarios SET contrasena = ? WHERE email = ?",
        [nuevaContrasena, correoVerificacionTemporal],
        (err) => {
            if (err) return res.status(500).send("Error al actualizar en la base de datos");

            // Limpiamos las variables temporales para que no se vuelvan a usar
            codigoVerificacionTemporal = null;
            correoVerificacionTemporal = null;

            res.send("Contraseña modificada con éxito.");
        }
    );
});


// NUEVA RUTA: DESCONTAR STOCK DESPUÉS DE LA COMPRA
router.post("/descontar-stock", (req, res) => {
    const { productos } = req.body; // Aquí llega nuestro array 'carrito' enviado desde el frontend

    //  Validación básica de seguridad
    if (!productos || productos.length === 0) {
        return res.status(400).json({ mensaje: "El carrito está vacío o no se enviaron productos." });
    }

    let productosProcesados = 0;
    let huboError = false;

    // Recorremos cada producto del carrito para actualizar la base de datos
    productos.forEach((item) => {
        
        // Ejecutamos el UPDATE con marcadores '?' tal cual como usás en tus otras rutas
        db.query(
            "UPDATE productos SET stock = stock - ? WHERE id = ?",
            [item.cantidad, item.id],
            (err, result) => {
                // Si otra query del bucle ya dio error, evitamos duplicar respuestas al cliente
                if (huboError) return; 

                if (err) {
                    huboError = true;
                    console.error(`[ERROR BD] Falló al descontar stock del producto ID: ${item.id}`, err);
                    return res.status(500).json({ mensaje: "Error interno al actualizar el stock en la base de datos." });
                }

                productosProcesados++;

                // 3. ÉXITO: Una vez que se terminaron de procesar TODOS los elementos de la lista, respondemos OK
                if (productosProcesados === productos.length) {
                    return res.status(200).json({ mensaje: "Stock actualizado correctamente en la base de datos." });
                }
            }
        );
    });
});


//  OBTENER TODOS LOS PRODUCTOS (Para cargar la tabla)
router.get("/productos", (req, res) => {
    db.query("SELECT * FROM productos ORDER BY id DESC", (err, results) => {
        if (err) {
            console.error("[ERROR BD] Al traer productos:", err);
            return res.status(500).json({ error: "Error al leer la base de datos" });
        }
        res.status(200).json(results);
    });
});

// CREAR UN NUEVO PRODUCTO (Alta)
router.post("/productos", (req, res) => {
    const { nombre, precio, imagen, stock } = req.body;

    if (!nombre || precio === undefined || !imagen || stock === undefined) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    db.query(
        "INSERT INTO productos (nombre, precio, imagen, stock) VALUES (?, ?, ?, ?)",
        [nombre, precio, imagen, stock],
        (err, result) => {
            if (err) {
                console.error("[ERROR BD] Al insertar producto:", err);
                return res.status(500).json({ error: "Error al guardar en la base de datos" });
            }
            res.status(201).json({ mensaje: "Producto creado con éxito", id: result.insertId });
        }
    );
});

//  MODIFICAR UN PRODUCTO EXISTENTE (Cambios / Edición)
router.put("/productos/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, precio, imagen, stock } = req.body;

    db.query(
        "UPDATE productos SET nombre = ?, precio = ?, imagen = ?, stock = ? WHERE id = ?",
        [nombre, precio, imagen, stock, id],
        (err, result) => {
            if (err) {
                console.error("[ERROR BD] Al actualizar producto:", err);
                return res.status(500).json({ error: "Error al modificar la base de datos" });
            }
            res.status(200).json({ mensaje: "Producto actualizado con éxito" });
        }
    );
});

// ELIMINAR UN PRODUCTO (Baja)
router.delete("/productos/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM productos WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("[ERROR BD] Al eliminar producto:", err);
            return res.status(500).json({ error: "Error al eliminar de la base de datos" });
        }
        res.status(200).json({ mensaje: "Producto eliminado con éxito" });
    });
});



module.exports = router;// conecta con el servidor 
