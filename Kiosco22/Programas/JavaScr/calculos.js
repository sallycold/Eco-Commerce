// =========================================================
let carrito = [];

// 1. DATOS FIJOS DEL KIOSCO (Sin MySQL)
const agrupados = {
    "Golosinas": [
        { nombre: "Alfajor Triple Chocotorta", precio: 1200, imagen: "https://imgs.search.brave.com/CBQTKXmfHz3ZnKQkz3zGnPGKmnutWFa-EZkGnNkh6Rk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hcmNv/cmVuY2FzYS5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjUv/MDUvMjAyNTA1MDYt/MTUwMDctMzAweDMw/MC53ZWJw" },
        { nombre: "Chocolate Cofler Block 100g", precio: 2100, imagen: "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.AC6qjN5dXhyGV-JRFYSVMQHaHa%3Fr%3D0%26pid%3DApi&sp=1792966025T5510b1b9cc6b1c83e10e54535cc5685d929f37bc91996ab968b0932d361d967e" },
         { nombre: "Caramelos Media Hora (10 u.)", precio: 500, imagen: "https://imgs.search.brave.com/EuJYrPCOlHV55Kc9PEoAdMZJeX_-PuDHNXfi8I50CmM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9OUV9OUF84/NjQ1OTItTUxBNDQx/OTk0OTI4MDJfMTEy/MDIwLVYud2VicA" },
        { nombre: "Chupetín Paragüitas", precio: 400, imagen: "https://imgs.search.brave.com/tMAo58qGd_OQ-4AngFVmPSB9MyzSwvjNQpTuqQz5JS8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9OUV9OUF84/OTM3NzYtTUxVNzM3/ODc1MzYxMjhfMDEy/MDI0LU8ud2VicA" },
    ],
    "Bebidas": [
        { nombre: "Coca-Cola 500ml", precio: 1500, imagen: "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.0zzSF6_EAkV_NvNuHSVblQHaHa%3Fr%3D0%26pid%3DApi&sp=1792966093T4f72095f3db8acc68305f2c1001f0c2ba6fb162c03b0f9dbd746a58e8cab06db" },
        { nombre: "Agua Saborizada Levite 500ml", precio: 1100, imagen: "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.2_iJlxGgZjjm3LNkXR2L3QHaHa%3Fr%3D0%26pid%3DApi&sp=1792966136T02ddaee4b905ce1709f1bfc403e5b65a0b4ff7beddd8115e41a9dca862eea2df" }
    ],
    "Snacks": [
        { nombre: "Papas Lays Clásicas 85g", precio: 2000, imagen: "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.jAEmqcCJ2f0o-rJzqLS0uAHaHa%3Fr%3D0%26pid%3DApi&sp=1792966239Te0995c16a67193d463fdf505955a0a459194aac3d1c02d0ada3a988d7f054770" },
        { nombre: "Galletitas Toddy 80g", precio: 900, imagen: "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.Pv93ainuxTv_WOXUizcIawHaHa%3Fr%3D0%26pid%3DApi&sp=1792966292Te846bad52cb5ea34e1c42ee7ee5cfab0ed520f5a486cdc2d19f53ed1d0ecd57c" }
    ]
};

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
// RENDERIZAR PRODUCTOS DIRECTAMENTE DESDE EL OBJETO FIJO
function cargarProductosTienda() {
    const contenedor = document.getElementById("productos");
    if (!contenedor) return;

    let html = "";

    for (const categoria in agrupados) {
        html += `
        <section id="seccion-${categoria.toLowerCase()}" class="grupo-categoria">
            <h2>${categoria}</h2>
            <div class="contenedor-tarjetas">
        `;

        agrupados[categoria].forEach(p => {
            html += `
            <div class="caja">
                <img src="${p.imagen}" alt="${p.nombre}">
                <h3>${p.nombre}</h3>
                <p class="precio">$${p.precio}</p>

                <div class="contador">
                    <button onclick="restar(this)">-</button>
                    <span class="cantidad">0</span>
                    <button onclick="sumar(this)">+</button>
                </div>

                <button class="btn-agregar" onclick="agregarCarrito(this)">
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
// FUNCIONES DEL CONTADOR Y CARRITO
function sumar(boton, index = null) {
    if (index !== null) {
        carrito[index].cantidad += 1;
        actualizarBotonCarrito();
        abrirFactura();
        return;
    }

    let span = boton.parentElement.querySelector('.cantidad');
    span.innerText = parseInt(span.innerText) + 1;
}

function restar(boton, index = null) {
    if (index !== null) {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad -= 1;
        } else {
            carrito.splice(index, 1);
        }
        actualizarBotonCarrito();
        abrirFactura();
        return;
    }

    let span = boton.parentElement.querySelector('.cantidad');
    let cantidad = parseInt(span.innerText);
    if (cantidad > 0) span.innerText = cantidad - 1;
}

function agregarCarrito(boton) {
   /* let usuario = obtenerUsuario();

    if (!usuario) {
        alert("⚠️ Tenés que iniciar sesión para comprar");
        localStorage.setItem("redirect", "ventaspag2.html");
        window.location.href = "Kios_login.html";
        return;
    }
        */

    let caja = boton.closest('.caja');
    let nombre = caja.querySelector('h3').innerText;
    let precio = parseFloat(caja.querySelector('.precio').innerText.replace('$', ''));
    let cantidad = parseInt(caja.querySelector('.cantidad').innerText);

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
            <span class="item-detalle">${item.nombre} precio: $${item.precio} -  subtotal:$${subtotal}</span>
            <div class="controles-carrito">
                <button class="btn-resumen" onclick="restar(this, ${index})">-</button>
                <span class="cant-carrito">${item.cantidad}</span>
                <button class="btn-resumen" onclick="sumar(this, ${index})">+</button>
                <button class="btn-resumen btn-quitar" onclick="eliminarItem(${index})">X</button>
            </div>
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

    const { jsPDF } = window.jspdf;

    // Altura dinámica: base + 8mm por cada producto en el carrito
    const altoTicket = Math.max(150, 95 + carrito.length * 8);

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, altoTicket]
    });

    // Fondo oscuro del ticket
    doc.setFillColor(26, 26, 46);
    doc.rect(0, 0, 80, altoTicket, 'F');

    // Borde sutil interno
    doc.setDrawColor(255, 0, 110);
    doc.setLineWidth(0.4);
    doc.rect(3, 3, 74, altoTicket - 6);

    // Encabezado del kiosco
    doc.setTextColor(255, 0, 110);
    doc.setFont("courier", "bold");
    doc.setFontSize(13);
    doc.text("MINI MUNDO", 40, 13, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("COMPROBANTE DE COMPRA", 40, 19, { align: "center" });

    // Fecha y hora
    const ahora = new Date();
    const fechaHora = ahora.toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 200);
    doc.text(`Fecha: ${fechaHora}`, 40, 25, { align: "center" });

    // Cliente si está logueado
    const user = typeof obtenerUsuario === "function" ? obtenerUsuario() : null;
    let y = 30;
    if (user && user.nombre) {
        doc.text(`Cliente: ${user.nombre}`, 40, y, { align: "center" });
        y += 5;
    }

    // Separador
    doc.setTextColor(120, 120, 145);
    doc.setFontSize(9);
    doc.text("--------------------------------", 40, y + 1, { align: "center" });

    // Cabecera de columnas
    y += 7;
    doc.setFont("courier", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(200, 200, 220);
    doc.text("PRODUCTO", 6, y);
    doc.text("SUBTOTAL", 74, y, { align: "right" });

    y += 6;
    let totalFinal = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalFinal += subtotal;

        let textoIzq = `${item.cantidad}x ${item.nombre}`;
        if (textoIzq.length > 20) {
            textoIzq = textoIzq.substring(0, 19) + "…";
        }

        const textoDer = `$${subtotal}`;

        // Nombre del producto
        doc.setFont("courier", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text(textoIzq, 6, y);

        // Subtotal a la derecha
        doc.setFont("courier", "bold");
        doc.text(textoDer, 74, y, { align: "right" });

        // Línea punteada suave entre ambos textos
        const inicioPuntos = doc.getTextWidth(textoIzq) + 8;
        const finPuntos = 74 - doc.getTextWidth(textoDer) - 2;
        if (finPuntos > inicioPuntos) {
            doc.setDrawColor(100, 100, 130);
            doc.setLineDash([0.8, 1.2], 0);
            doc.line(inicioPuntos, y - 1, finPuntos, y - 1);
            doc.setLineDash([], 0);
        }

        y += 7.5;
    });

    // Separador final
    doc.setTextColor(120, 120, 145);
    doc.setFont("courier", "normal");
    doc.setFontSize(9);
    doc.text("--------------------------------", 40, y, { align: "center" });

    // Total destacado
    y += 8;
    doc.setFont("courier", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(255, 255, 255);
    doc.text("TOTAL", 6, y);

    doc.setTextColor(255, 0, 110);
    doc.text(`$${totalFinal}`, 74, y, { align: "right" });

    // Pie del ticket
    y += 13;
    doc.setFont("courier", "bolditalic");
    doc.setFontSize(8.5);
    doc.setTextColor(220, 220, 235);
    doc.text("¡Gracias por tu compra!", 40, y, { align: "center" });

    y += 5;
    doc.setFontSize(8);
    doc.setTextColor(255, 0, 110);
    
    doc.save("Ticket_Kiosco.pdf");

    // Opcional: descomentar si querés que se limpie el carrito al generar el ticket
    // carrito = [];
    // actualizarBotonCarrito();
    // cerrarFactura();
}
// =========================================================
// FILTRO POR CATEGORÍA
function filtrarPorCategoria(categoria) {
    if (categoria === 'todos') {
        document.getElementById("productos").scrollIntoView({ behavior: "smooth" });
        return;
    }

    let catDestino = categoria.toLowerCase().trim();
    const elemento = document.getElementById(`seccion-${catDestino}`);

    if (elemento) {
        elemento.scrollIntoView({ behavior: "smooth" });
    } else {
        alert("No hay productos cargados en esta categoría todavía.");
    }
}

// =========================================================
// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
    let vieneDeLogin = localStorage.getItem("login_exitoso");

    if (vieneDeLogin === "true") {
        localStorage.removeItem("login_exitoso");
    } else {
        localStorage.removeItem("usuario");
    }

    mostrarUsuario(); 
    cargarProductosTienda(); // Carga directa sin base de datos
});