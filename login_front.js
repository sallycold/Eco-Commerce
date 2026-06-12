// INICIO DE SESIÓN 
async function login() {
    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;
    const mensajeP = document.getElementById("mensaje");

    mensajeP.innerText = ""; 

    try {
        const res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, contrasena })
        });

        const datos = await res.json();

        if (res.ok) {
            
            if (datos.rol === "Administrador") {
                window.location.href = "/abm_productos.html";
            } else {
                window.location.href = "/ventaspag2.html";
            }
        } else {
            // El estado es 400 o 401, mostramos el error exacto que mandó el backend
            mensajeP.innerText = datos.error;
        }

    } catch (error) {
        console.error("Error en la petición:", error);
        mensajeP.innerText = "Error de comunicación con el servidor.";
    }
}


async function registrar() {
    const usuario = document.getElementById("regUsuario").value;
    const email = document.getElementById("regEmail").value;
    const contrasena = document.getElementById("regContrasena").value;

    try {
        const res = await fetch("/registrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, email, contrasena })
        });

        document.getElementById("mensajeRegistro").innerText = await res.text();
    } catch (error) {
        document.getElementById("mensajeRegistro").innerText = "Error de conexión.";
    }
}


///OLVIDA DE CONTRASEÑA

async function enviarRecuperacion() {
    const email = document.getElementById("emailRecuperar").value;

    try {
        const res = await fetch("/recuperar-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const texto = await res.text();
        document.getElementById("mensajeRecuperar").innerText = texto;

        if (res.ok) {
            // Ocultamos el campo del mail y mostramos el campo para poner los 5 números
            document.getElementById("seccionEmail").style.display = "none";
            document.getElementById("seccionCodigo").style.display = "block";
        }
    } catch (error) {
        document.getElementById("mensajeRecuperar").innerText = "Error de conexión.";
    }
}

//  VERIFICAR LOS CINCO DIGITOS PARA RECUPERAR CONTRASEÑA 
async function validarCodigo() {
    const codigo = document.getElementById("inputCodigo").value;

    try {
        const res = await fetch("/verificar-codigo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codigo })
        });

        const texto = await res.text();

        if (res.ok) {
            // Código correcto: Ocultamos los números y abrimos los inputs de la nueva contraseña
            document.getElementById("seccionCodigo").style.display = "none";
            document.getElementById("seccionNuevaClave").style.display = "block";
            document.getElementById("mensajeRecuperar").innerText = "Código verificado. Escribí tu nueva contraseña.";
        } else {
            document.getElementById("mensajeRecuperar").innerText = texto;
        }
    } catch (error) {
        document.getElementById("mensajeRecuperar").innerText = "Error al verificar.";
    }
}

//  GUARDAR LA CONTRASEÑA 
async function guardarNuevaClave() {
    const nuevaContrasena = document.getElementById("nuevaContrasena").value;

    try {
        const res = await fetch("/actualizar-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nuevaContrasena })
        });

        const texto = await res.text();
        document.getElementById("mensajeRecuperar").innerText = texto;

        if (res.ok) {
            // Si todo salió bien, a los 2 segundos lo mandamos de vuelta a iniciar sesión
            setTimeout(() => {
                window.location.href = "/";
            }, 2500);
        }
    } catch (error) {
        document.getElementById("mensajeRecuperar").innerText = "Error al guardar.";
    }
}