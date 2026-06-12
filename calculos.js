// Memoria del carrito y catálogo
let carrito = [];
let listaProductosBD = [];

// =========================================================
// 1. CARGA DINÁMICA DESDE LA BASE DE DATOS
// =========================================================

// Trae los productos del servidor de forma automática al entrar
function cargarProductosTienda() {
    fetch("/productos")
        .then(response => response.json())
        .then(productos => {
            listaProductosBD = productos; 
            dibujarProductos(productos);
        })
        .catch(err => {
            console.error("Error al cargar los productos en la tienda:", err);
            document.getElementById("productos").innerHTML = "<p>Error al conectar con la tienda. Intentá más tarde.</p>";
        });
}

// Genera las tarjetas idénticas a tu diseño visual (image_55dca3.png)
function dibujarProductos(productos) {
    const contenedor = document.getElementById("productos");
    
    if (productos.length === 0) {
        contenedor.innerHTML = "<p id='sin-productos'>No hay productos disponibles en este momento.</p>";
        return;
    }

    contenedor.innerHTML = productos.map(p => {
        const sinStock = p.stock <= 0;
        
        return `
            <div class="caja" data-id="${p.id}" style="${sinStock ? 'opacity: 0.5; pointer-events: none;' : ''}">
                <img src="${p.imagen}" alt="${p.nombre}">
                <h3>${p.nombre}</h3>
                <p class="precio">$${p.precio}</p>
                <div class="contador">
                    <button onclick="restar(this)" ${sinStock ? 'disabled' : ''}>-</button>
                    <span class="cantidad">0</span>
                    <button onclick="sumar(this)" ${sinStock ? 'disabled' : ''}>+</button>
                </div>
                <button class="btn-agregar" onclick="agregarCarrito(this)" ${sinStock ? 'disabled' : ''}>
                    ${sinStock ? 'Sin Stock' : 'Agregar'}
                </button>
            </div>
        `;
    }).join("");
}

// =========================================================
// 2. INTERACCIÓN DE BOTONES (+ y -)
// =========================================================

function sumar(boton) {
    let span = boton.parentElement.querySelector('.cantidad');
    let cantidad = parseInt(span.innerText);
    span.innerText = cantidad + 1;
}

function restar(boton) {
    let span = boton.parentElement.querySelector('.cantidad');
    let cantidad = parseInt(span.innerText);
    if (cantidad > 0) {
        span.innerText = cantidad - 1;
    }
}

function avanzar() {} // Espacio de respaldo por si lo requiere tu diseño

// =========================================================
// 3. GESTIÓN DEL CARRITO (PANTALLA LATERAL ORIGINAL)
// =========================================================

function agregarCarrito(boton) {
    let caja = boton.closest('.caja');
    let id = caja.getAttribute('data-id'); 
    let nombre = caja.querySelector('h3').innerText;
    
    let precioTexto = caja.querySelector('.precio').innerText;
    let precio = parseFloat(precioTexto.replace('$', ''));
    
    let cantidadSpan = caja.querySelector('.cantidad');
    let cantidad = parseInt(cantidadSpan.innerText);

    if (cantidad === 0) {
        alert("Selecciona al menos 1 unidad para agregar al carrito.");
        return;
    }

    let itemExistente = carrito.find(item => item.id == id);
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({ id: parseInt(id), nombre, precio, cantidad });
    }

    cantidadSpan.innerText = "0";
    actualizarPantallaCarrito();
}

function actualizarPantallaCarrito() {
    let lista = document.getElementById("lista-carrito");
    let spanTotal = document.getElementById("total");
    
    lista.innerHTML = ""; 
    let totalPrecio = 0;

    if (carrito.length === 0) {
        spanTotal.innerText = "0";
        return;
    }

    carrito.forEach((item, index) => {
        let subtotal = item.precio * item.cantidad;
        totalPrecio += subtotal;

        let li = document.createElement("li");
        li.innerHTML = `
            ${item.cantidad}x ${item.nombre} - $${subtotal.toFixed(2)} 
            <button onclick="eliminarItem(${index})" class="btn-eliminar">X</button>
        `;
        lista.appendChild(li);
    });

    spanTotal.innerText = totalPrecio.toFixed(2);
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    actualizarPantallaCarrito();
}

// =========================================================
// 4. DESCONTO DE STOCK Y FACTURA PDF (CON IVA Y NETO INTERNO)
// =========================================================

async function generarPDF() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. No hay nada para facturar.");
        return;
    }

    try {
        // Enviar carrito al backend para descontar stock de la Base de Datos
        const respuesta = await fetch('/descontar-stock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productos: carrito })
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            alert(`Error de Stock: ${errorData.mensaje || 'No se pudo actualizar la base de datos.'}`);
            return; 
        }

    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        alert("No se pudo conectar con el servidor para actualizar el stock. La factura no se generará.");
        return; 
    }

    // Si la base de datos se actualizó correctamente, creamos el PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Encabezado del documento impreso
    doc.setFontSize(22);
    doc.text("Factura de Compra - Kiosco", 20, 20);
    
    doc.setFontSize(12);
    doc.text("Producto", 20, 40);
    doc.text("Cantidad", 120, 40);
    doc.text("Subtotal (Pub.)", 155, 40);
    
    doc.line(20, 42, 190, 42); 

    let y = 50;
    let totalFinalPublico = 0;

    carrito.forEach(item => {
        let subtotal = item.precio * item.cantidad;
        totalFinalPublico += subtotal;

        doc.text(item.nombre, 20, y);
        doc.text(item.cantidad.toString(), 125, y);
        doc.text(`$${subtotal.toFixed(2)}`, 155, y);
        y += 10;
    });

    doc.line(20, y, 190, y); 
    y += 15;
    
    // ─── CÁLCULOS MATEMÁTICOS DEL IVA (21%) INTERNOS ───
    let finalNeto = totalFinalPublico / 1.21;
    let finalIva = totalFinalPublico - finalNeto;

    // Desglose final impreso abajo a la derecha del PDF
    doc.setFontSize(12);
    doc.text(`Subtotal Neto: $${finalNeto.toFixed(2)}`, 120, y);
    y += 8;
    doc.text(`IVA Inscripto (21%): $${finalIva.toFixed(2)}`, 120, y);
    y += 10;
    
    // Gran Total Comercial (Precio Público con IVA incluido)
    doc.setFontSize(16);
    doc.text(`TOTAL PÚBLICO: $${totalFinalPublico.toFixed(2)}`, 110, y);

    // Descarga automática del archivo
    doc.save("Factura_Kiosco.pdf");

    // Limpieza total del sistema para la próxima compra
    carrito = [];                  
    actualizarPantallaCarrito();   
    cargarProductosTienda(); 
}

// Disparador inicial automático cuando se abre la página
document.addEventListener("DOMContentLoaded", cargarProductosTienda);