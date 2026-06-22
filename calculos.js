// =========================================================
// VARIABLES GLOBALES
// =========================================================
let carrito = [];
let listaProductosBD = [];

// =========================================================
// USUARIO
function obtenerUsuario() {
    try {
        return JSON.parse(localStorage.getItem("usuario"));
    } catch {
        return null;
    }
}

function mostrarUsuario() {
    let user = obtenerUsuario();
    let box = document.getElementById("userBox");

    if (!box) return;

    if (user && user.nombre) {
        box.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-weight: bold; color: #000000; ">👤 ${user.nombre}</span>
            </div>
        `;
    } else {
        box.innerHTML = `<a href="Kios_login.html" style="text-decoration: none; font-size: 20px;">👤</a>`;
    }
}

function logout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("login_exitoso");
    window.location.href = "Kios_login.html";
}

// =========================================================
// CARGA DE PRODUCTOS
// =========================================================
function cargarProductosTienda() {
    fetch("/productos")
        .then(response => response.json())
        .then(productos => {
            listaProductosBD = productos;
            dibujarProductos(productos);
        })
        .catch(err => {
            console.error("Error al cargar productos:", err);
            document.getElementById("productos").innerHTML =
                "<p>Error al conectar con la tienda.</p>";
        });
}

// =========================================================
// RENDERIZADO (🔥 RESPETA TU DISEÑO ORIGINAL)
// =========================================================
function dibujarProductos(productos) {
    const contenedor = document.getElementById("productos");

    if (productos.length === 0) {
        contenedor.innerHTML = "<p>No hay productos</p>";
        return;
    }

    const agrupados = {};

    productos.forEach(p => {
        let cat = (p.categoria || 'Otros').toLowerCase().trim();
        if (!agrupados[cat]) agrupados[cat] = [];
        agrupados[cat].push(p);
    });

    let html = "";

    for (const categoria in agrupados) {

        html += `
        <section id="seccion-${categoria}" class="grupo-categoria">
            <h2>${categoria}</h2>
            <div class="contenedor-tarjetas">
        `;

        agrupados[categoria].forEach(p => {
            html += `
            <div class="caja">
                <img src="${p.imagen}">
                <h3>${p.nombre}</h3>
                <p class="precio">$${p.precio}</p>

                <div class="contador">
                    <button onclick="restar(this)">-</button>
                    <span class="cantidad">0</span>
                    <button onclick="sumar(this)">+</button>
                </div>

                <button class="btn-agregar"  onclick="agregarCarrito(this)">
                    Agregar
                </button>
            </div>
            `;
        });

        html += `</div></section>`;
    }

    contenedor.innerHTML = html;
}

// =========================================================
// BOTONES + -
// =========================================================
function sumar(boton) {
    let span = boton.parentElement.querySelector('.cantidad');
    span.innerText = parseInt(span.innerText) + 1;
}

function restar(boton) {
    let span = boton.parentElement.querySelector('.cantidad');
    let cantidad = parseInt(span.innerText);
    if (cantidad > 0) span.innerText = cantidad - 1;
}

// =========================================================
// CARRITO (CON LOGIN)
// =========================================================
function agregarCarrito(boton) {
    let usuario = obtenerUsuario();

    if (!usuario) {
        alert("⚠️ Tenés que iniciar sesión para comprar");

        localStorage.setItem("redirect", "ventaspag2.html");
        window.location.href = "Kios_login.html";
        return;
    }

    let caja = boton.closest('.caja');

    let nombre = caja.querySelector('h3').innerText;
    let precio = parseFloat(
        caja.querySelector('.precio').innerText.replace('$', '')
    );
    let cantidad = parseInt(
        caja.querySelector('.cantidad').innerText
    );

    if (cantidad === 0) {
        alert("Selecciona al menos 1 unidad.");
        return;
    }

    let itemExistente = carrito.find(item => item.nombre === nombre);

    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({ nombre, precio, cantidad });
    }

    caja.querySelector('.cantidad').innerText = "0";

    actualizarBotonCarrito();

    alert(`Se agregaron ${cantidad}x ${nombre} al carrito.`);
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    actualizarBotonCarrito();
    abrirFactura();
}

// =========================================================
// BOTÓN CARRITO
// =========================================================
function actualizarBotonCarrito() {
    let total = 0;
    carrito.forEach(item => total += item.cantidad);

    let boton = document.querySelector('.btn-flotante');
    if (!boton) return;

    boton.innerText = total > 0
        ? `🛒 Ver Cuenta (${total})`
        : `🛒 Ver Cuenta`;
}


function cerrarFactura() {
    document.getElementById("miModal").style.display = "none";
}

function abrirFactura() {
    let lista = document.getElementById("lista-carrito");
    let spanTotal = document.getElementById("total");
    lista.innerHTML = ""; 
    let totalPrecio = 0;

    carrito.forEach((item, index) => {
        let subtotal = item.precio * item.cantidad;
        totalPrecio += subtotal;

        let li = document.createElement("li");
        li.innerHTML = `
            ${item.cantidad}x ${item.nombre} - $${subtotal} 
            <button onclick="eliminarItem(${index})">X</button>
        `;
        lista.appendChild(li);
    });

    spanTotal.innerText = totalPrecio;
    document.getElementById("miModal").style.display = "flex"; 
}




function generarPDF() {

    if (carrito.length === 0) {
        alert("La cuenta está en cero.");
        return;
    }

    if (!window.jspdf) {
        alert("Error: jsPDF no está cargado");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 10;
    let total = 0;

    doc.text("FACTURA", 10, y);
    y += 10;

    carrito.forEach(item => {
        let subtotal = item.precio * item.cantidad;
        total += subtotal;

        doc.text(`${item.cantidad}x ${item.nombre} - $${subtotal}`, 10, y);
        y += 10;
    });

    doc.text(`TOTAL: $${total}`, 10, y + 10);

    doc.save("factura.pdf");
}
// =========================================================



document.addEventListener("DOMContentLoaded", () => {
    // Revisamos si venimos directo desde el formulario de login exitoso
    let vieneDeLogin = localStorage.getItem("login_exitoso");

    if (vieneDeLogin === "true") {
        // Si viene del login, NO lo borramos, solo gastamos el "ticket" para la próxima vez
        localStorage.removeItem("login_exitoso");
    } else {
        // Si entró escribiendo la URL de cero o cerró la pestaña y volvió, se limpia
        localStorage.removeItem("usuario");
    }

    mostrarUsuario(); 
    cargarProductosTienda();
});


function logout() {
    localStorage.removeItem("usuario");
   window.location.href = "Kios_login.html";
}

function filtrarPorCategoria(categoria) {

    if (categoria === 'todos') {
        document.getElementById("productos")
            .scrollIntoView({ behavior: "smooth" });
        return;
    }

    let catDestino = categoria.toLowerCase().trim();

    // 🔥 Normalización correcta
    if (catDestino === 'snack') catDestino = 'snacks';
    if (catDestino === 'dulces') catDestino = 'golosinas';

    const elemento = document.getElementById(`seccion-${catDestino}`);

    if (elemento) {
        elemento.scrollIntoView({ behavior: "smooth" });
    } else {
        console.warn("No existe:", `seccion-${catDestino}`);
    }
}