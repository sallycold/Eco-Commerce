let todosLosUsuarios = [];

// ── CARGAR USUARIOS ───----------------
function cargarUsuarios() {
    fetch("/usuarios")
        .then(r => r.json())
        .then(data => {
            todosLosUsuarios = data;
            renderTablaUsuarios(data);
        })
        .catch(() => mostrarMsgUsu("Error al cargar usuarios", "err"));
}

// 🔥 SE MODIFICÓ ESTA FUNCIÓN: Ahora renderiza el botón de Eliminar
function renderTablaUsuarios(usuarios) {
    const tbody = document.getElementById("tabla-body-usuarios");
    if (!tbody) return;

    if (usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" id="sin-usuarios">No hay usuarios cargados todavía.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = usuarios.map(u => `
        <tr>
            <td>${u.id}</td>
            <td style="text-align: center; font-size: 1.2rem;">👤</td>
            <td>${u.usuario}</td>
            <td>${u.email || "-"}</td>
            <td>
                <span class="badge-stock ${u.rol === 'Administrador' ? 'stock-ok' : 'stock-off'}">
                    ${u.rol || "Sin Rol"}
                </span>
            </td>
            <td class="acciones">
                <button class="btn-edit" onclick="cargarEdicionUsuario(${u.id})">✏️ Asignar Rol</button>
                <button class="btn-delete" onclick="eliminarUsuario(${u.id})" style="background-color: #e74c3c; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; margin-left: 5px;">
                    🗑️ Eliminar
                </button>
            </td>
        </tr>
    `).join("");
}

function filtrarTablaUsuarios() {
    const q = document.getElementById("buscador-usu").value.toLowerCase();
    const filtrados = todosLosUsuarios.filter(u => 
        u.usuario.toLowerCase().includes(q) || 
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.rol && u.rol.toLowerCase().includes(q))
    );
    renderTablaUsuarios(filtrados);
}

// ── GUARDAR USUARIO (ALTA o MODIFICACIÓN DE ROL) ───────────────────────────
function guardarUsuario() {
    const id      = document.getElementById("usu-id").value;
    const usuario = document.getElementById("usu-nombre").value.trim();
    const email   = document.getElementById("usu-email").value.trim();
    const rol     = document.getElementById("usu-rol").value;

    if (!usuario || !email || !rol) {
        return mostrarMsgUsu("Por favor completá todos los campos.", "err");
    }

    const metodo = id ? "PUT" : "POST";
    const url    = id ? `/usuarios/${id}` : "/usuarios";

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, email, rol })
    })
    .then(r => r.json().then(data => ({ ok: r.ok, data })))
    .then(({ ok, data }) => {
        if (!ok) return mostrarMsgUsu(data.error || "Error al guardar usuario", "err");
        mostrarMsgUsu(id ? "✅ Rol asignado correctamente" : "✅ Usuario agregado correctamente", "ok");
        limpiarFormUsuario();
        cargarUsuarios();
    })
    .catch(() => mostrarMsgUsu("Error de conexión con el servidor", "err"));
}

// ── 🔥 NUEVA FUNCIÓN: ELIMINAR USUARIO POR ID ────────────────────────────────
function eliminarUsuario(id) {
    // Buscamos el nombre para el cartel de confirmación
    const usuario = todosLosUsuarios.find(u => u.id === id);
    if (!usuario) return;

    // Pedimos confirmación para evitar accidentes
    if (!confirm(`¿Estás seguro de que querés eliminar permanentemente al usuario "${usuario.usuario}"?`)) {
        return;
    }

    fetch(`/usuarios/${id}`, {
        method: "DELETE"
    })
    .then(r => {
        if (!r.ok) throw new Error();
        mostrarMsgUsu("🗑️ Usuario eliminado correctamente", "ok");
        cargarUsuarios(); // Recargamos la tabla al instante
    })
    .catch(() => {
        mostrarMsgUsu("Error al intentar eliminar el usuario del servidor", "err");
    });
}

// ── CARGAR DATOS PARA EDITAR ROL ──────────────────────────────────────────
function cargarEdicionUsuario(id) {
    const usua = todosLosUsuarios.find(u => u.id === id);
    if (!usua) return;

    document.getElementById("usu-id").value      = usua.id;
    document.getElementById("usu-nombre").value  = usua.usuario;
    document.getElementById("usu-email").value   = usua.email || "";
    document.getElementById("usu-rol").value     = usua.rol || "";

    document.getElementById("titulo-form-usu").textContent = "✏️ Modificar Rol";
    document.getElementById("btn-cancelar-usu").style.display = "";
    document.getElementById("msg-form-usu").textContent = "";

    document.querySelector(".form-usuario-card").scrollIntoView({ behavior: "smooth" });
}

function cancelarEdicionUsuario() {
    limpiarFormUsuario();
    mostrarMsgUsu("", "");
}

function limpiarFormUsuario() {
    ["usu-id", "usu-nombre", "usu-email", "usu-rol"].forEach(id => {
        document.getElementById(id).value = "";
    });
    document.getElementById("titulo-form-usu").textContent = "👤 Asignar Rol de Administrador";
    document.getElementById("btn-cancelar-usu").style.display = "none";
}

// ── HELPER MENSAJES USUARIOS ──────────────────────────────────────────────
function mostrarMsgUsu(texto, tipo) {
    const el = document.getElementById("msg-form-usu");
    if (!el) return;
    el.textContent = texto;
    el.className = tipo;
}

// ── INICIAR SECCIÓN USUARIOS ──────────────────────────────────────────────
cargarUsuarios();