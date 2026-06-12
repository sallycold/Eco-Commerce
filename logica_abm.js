
    let todosLosProductos = [];

    // ── CARGAR PRODUCTOS ───----------------
    function cargarTabla() {
        fetch("/productos")
            .then(r => r.json())
            .then(data => {
                todosLosProductos = data;
                renderTabla(data);
            })
            .catch(() => mostrarMsg("Error al cargar productos", "err"));
    }

    function renderTabla(productos) {
        const tbody = document.getElementById("tabla-body");
        if (productos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" id="sin-productos">No hay productos cargados todavía.</td></tr>`;
            return;
        }
        tbody.innerHTML = productos.map(p => `
            <tr>
                <td>${p.id}</td>
                <td class="col-img"><img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='https://via.placeholder.com/48x38?text=?'"></td>
                <td>${p.nombre}</td>
                <td>$${Number(p.precio).toFixed(2)}</td>
                <td>
                    <span class="badge-stock ${p.stock > 0 ? 'stock-ok' : 'stock-off'}">
                        ${p.stock > 0 ? p.stock + ' uds' : 'Agotado'}
                    </span>
                </td>
                <td class="acciones">
                    <button class="btn-edit" onclick="cargarEdicion(${p.id})">✏️ Editar</button>
                    <button class="btn-del"  onclick="eliminarProducto(${p.id}, '${p.nombre.replace(/'/g,"\\'")}')">🗑️ Eliminar</button>
                </td>
            </tr>
        `).join("");
    }

    function filtrarTabla() {
        const q = document.getElementById("buscador").value.toLowerCase();
        const filtrados = todosLosProductos.filter(p => p.nombre.toLowerCase().includes(q));
        renderTabla(filtrados);
    }

    // ── GUARDAR (ALTA o MODIFICACIÓN) ─────────────────────────────────────────
    function guardarProducto() {
        const id     = document.getElementById("prod-id").value;
        const nombre = document.getElementById("prod-nombre").value.trim();
        const precio = parseFloat(document.getElementById("prod-precio").value);
        const stock  = parseInt(document.getElementById("prod-stock").value);
        const imagen = document.getElementById("prod-imagen").value.trim();
        if (!nombre || isNaN(precio) || isNaN(stock) || !imagen) {
            return mostrarMsg("Por favor completá todos los campos.", "err");
        }
        if (precio < 0 || stock < 0) {
            return mostrarMsg("Precio y stock no pueden ser negativos.", "err");
        }
        const metodo = id ? "PUT" : "POST";
        const url    = id ? `/productos/${id}` : "/productos";
        fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, precio, imagen, stock })
        })
        .then(r => r.json().then(data => ({ ok: r.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) return mostrarMsg(data.error || "Error al guardar", "err");
            mostrarMsg(id ? "✅ Producto actualizado correctamente" : "✅ Producto agregado correctamente", "ok");
            limpiarForm();
            cargarTabla();
        })
        .catch(() => mostrarMsg("Error de conexión con el servidor", "err"));
    }

    // ── CARGAR DATOS PARA EDITAR ──────────────────────────────────────────────
    function cargarEdicion(id) {
        const prod = todosLosProductos.find(p => p.id === id);
        if (!prod) return;

        document.getElementById("prod-id").value     = prod.id;
        document.getElementById("prod-nombre").value = prod.nombre;
        document.getElementById("prod-precio").value = prod.precio;
        document.getElementById("prod-stock").value  = prod.stock;
        document.getElementById("prod-imagen").value = prod.imagen;

        document.getElementById("titulo-form").textContent = "✏️ Modificar Producto";
        document.getElementById("btn-cancelar").style.display = "";
        document.getElementById("msg-form").textContent = "";

        // Scroll al formulario
        document.querySelector(".form-card").scrollIntoView({ behavior: "smooth" });
    }

    function cancelarEdicion() {
        limpiarForm();
        mostrarMsg("", "");
    }

    function limpiarForm() {
        ["prod-id","prod-nombre","prod-precio","prod-stock","prod-imagen"].forEach(id => {
            document.getElementById(id).value = "";
        });
        document.getElementById("titulo-form").textContent = "➕ Agregar Producto";
        document.getElementById("btn-cancelar").style.display = "none";
    }

    // ── ELIMINAR ──────────────────────────────────────────────────────────────
    function eliminarProducto(id, nombre) {
        if (!confirm(`¿Seguro que querés eliminar "${nombre}"?`)) return;

        fetch(`/productos/${id}`, { method: "DELETE" })
        .then(r => r.json().then(data => ({ ok: r.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) return mostrarMsg(data.error || "Error al eliminar", "err");
            mostrarMsg(`✅ "${nombre}" eliminado`, "ok");
            cargarTabla();
        })
        .catch(() => mostrarMsg("Error de conexión", "err"));
    }

    // ── HELPER MENSAJES ───────────────────────────────────────────────────────
    function mostrarMsg(texto, tipo) {
        const el = document.getElementById("msg-form");
        el.textContent = texto;
        el.className = tipo;
    }

    // ── INICIAR ───────────────────────────────────────────────────────────────
    cargarTabla();