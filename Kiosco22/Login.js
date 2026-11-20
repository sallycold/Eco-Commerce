// ---- Backend Unificado ----
const express = require("express"); // Trae el framework Express
const db = require("./BaseDatos");  // Tu conexión a la base de datos MySQL
const router = express.Router();    // Permite agrupar todas las rutas juntas

// Variables temporales en memoria para la recuperación de contraseña
let codigoVerificacionTemporal = null;
let correoVerificacionTemporal = null;

// PROCESAR LOGIN CON CONTROL DE ROL 
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

// REGISTRAR USUARIO (Desde la página de registro público)
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

            // Imprimimos el código en letras gigantes en tu Git Bash / Terminal
            console.log("==================================================");
            console.log(`[CÓDIGO GENERADO] El correo ${email} solicita recuperar clave.`);
            console.log(` TU CÓDIGO DE 5 DÍGITOS ES:  ${codigoVerificacionTemporal}  `);
            console.log("==================================================");

            res.send("Código enviado. Revisá la terminal de tu servidor.");
        }
    );
});

// VERIFICAR EL CÓDIGO DE 5 DÍGITOS
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

            // Limpiamos las variables temporales para seguridad
            codigoVerificacionTemporal = null;
            correoVerificacionTemporal = null;

            res.send("Contraseña modificada con éxito.");
        }
    );
});



// DESCONTAR STOCK DESPUÉS DE UNA COMPRA EN LA TIENDA
router.post("/descontar-stock", (req, res) => {
    const { productos } = req.body;

    if (!productos || productos.length === 0) {
        return res.status(400).json({
            mensaje: "El carrito está vacío o no se enviaron productos."
        });
    }

    let productosProcesados = 0;
    let huboError = false;

    productos.forEach((item) => {

        // Verificar stock actual
        db.query(
            "SELECT stock, nombre FROM productos WHERE id = ?",
            [item.id],
            (err, resultado) => {

                if (huboError) return;

                if (err) {
                    huboError = true;
                    return res.status(500).json({
                        mensaje: "Error al consultar el stock."
                    });
                }

                if (resultado.length === 0) {
                    huboError = true;
                    return res.status(404).json({
                        mensaje: `Producto ID ${item.id} no encontrado.`
                    });
                }

                const stockActual = resultado[0].stock;
                const nombreProducto = resultado[0].nombre;

                if (stockActual < item.cantidad) {
                    huboError = true;
                    return res.status(400).json({
                        mensaje: `No hay suficiente stock de ${nombreProducto}. Stock disponible: ${stockActual}`
                    });
                }

                // Descontar stock
                db.query(
                    "UPDATE productos SET stock = stock - ? WHERE id = ?",
                    [item.cantidad, item.id],
                    (err) => {

                        if (huboError) return;

                        if (err) {
                            huboError = true;
                            return res.status(500).json({
                                mensaje: "Error al actualizar el stock."
                            });
                        }

                        productosProcesados++;

                        if (productosProcesados === productos.length) {
                            return res.status(200).json({
                                mensaje: "Stock actualizado correctamente."
                            });
                        }
                    }
                );
            }
        );
    });
});

// OBTENER TODOS LOS PRODUCTOS
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
    const { nombre, precio, imagen, stock, categoria } = req.body;

    if (!nombre || !categoria || precio === undefined || !imagen || stock === undefined) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    db.query(
        "INSERT INTO productos (nombre, precio, imagen, stock, categoria) VALUES (?, ?, ?, ?, ?)",
        [nombre, precio, imagen, stock, categoria],
        (err, result) => {
            if (err) {
                console.error("[ERROR BD] Al insertar producto:", err);
                return res.status(500).json({ error: "Error al guardar en la base de datos" });
            }
            res.status(201).json({ mensaje: "Producto creado con éxito", id: result.insertId });
        }
    );
});

// MODIFICAR UN PRODUCTO EXISTENTE (Edición)
router.put("/productos/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, precio, imagen, stock, categoria } = req.body;

    db.query(
        "UPDATE productos SET nombre = ?, precio = ?, imagen = ?, stock = ?, categoria = ? WHERE id = ?",
        [nombre, precio, imagen, stock, categoria, id],
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



// OBTENER TODOS LOS USUARIOS
router.get("/usuarios", (req, res) => {
    db.query("SELECT id, usuario, email, rol FROM usuarios ORDER BY id DESC", (err, results) => {
        if (err) {
            console.error("[ERROR BD] Al traer usuarios:", err);
            return res.status(500).json({ error: "Error al leer la base de datos" });
        }
        res.status(200).json(results);
    });
});

// CREAR UN NUEVO USUARIO DESDE EL PANEL (Alta con contraseña por defecto)
router.post("/usuarios", (req, res) => {
    const { usuario, email, rol } = req.body;
    const contrasenaPredeterminada = "1234"; 

    db.query(
        "INSERT INTO usuarios (usuario, email, rol, contrasena) VALUES (?, ?, ?, ?)",
        [usuario, email, rol, contrasenaPredeterminada],
        (err, result) => {
            if (err) {
                console.error("[ERROR BD] Al insertar nuevo usuario:", err);
                return res.status(500).json({ error: "Error al guardar en la base de datos" });
            }
            res.status(201).json({ mensaje: "Usuario creado con éxito", id: result.insertId });
        }
    );
});

// MODIFICAR UN USUARIO EXISTENTE (Cambiar datos / Rol)
router.put("/usuarios/:id", (req, res) => {
    const { id } = req.params;
    const { usuario, email, rol } = req.body;

    db.query(
        "UPDATE usuarios SET usuario = ?, email = ?, rol = ? WHERE id = ?",
        [usuario, email, rol, id],
        (err, result) => {
            if (err) {
                console.error("[ERROR BD] Al actualizar rol del usuario:", err);
                return res.status(500).json({ error: "Error al modificar la base de datos" });
            }
            res.status(200).json({ mensaje: "Usuario y rol actualizados con éxito" });
        }
    );
});

// ELIMINAR UN USUARIO
router.delete("/usuarios/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM usuarios WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("[ERROR BD] Al eliminar usuario:", err);
            return res.status(500).json({ error: "Error al eliminar de la base de datos" });
        }
        res.status(200).json({ mensaje: "Usuario eliminado con éxito" });
    });
});



module.exports = router;