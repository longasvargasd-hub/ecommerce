/*************** CARGA DEL MENÚ SUPERIOR ***************/
document.addEventListener("DOMContentLoaded", async () => {
    const sesionActiva = localStorage.getItem("sesionActiva");
    const contenedor = document.getElementById("user-menu-container");

    if (!contenedor || !sesionActiva) return;

    const perfil = JSON.parse(localStorage.getItem("usuario"));
    if (!perfil || !perfil.correo) return;

    let usuario = null;

    try {
        const res = await fetch("http://localhost:8081/api/perfil/obtener", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo: perfil.correo })
        });

        if (!res.ok) throw new Error("No se pudo obtener el perfil");

        const data = await res.json();
        usuario = data.usuario;
    } catch (error) {
        console.error("error al obtener el perfil", error);
        localStorage.clear();
        window.location.href = "../pages/login.html";
        return;
    }

    // Crear menú del usuario
    contenedor.innerHTML = `
    <div class="relative">
        <button id="user-menu-btn" class="w-14 h-14 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold text-xl shadow-md hover:scale-105 transition-transform">
            <span id="user-avatar"></span>
        </button>

        <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 transition-all duration-200 ease-out overflow-hidden transform origin-top scale-95 opacity-0">
            <div class="px-4 py-3 border-b border-gray-200">
                <p class="text-sm font-semibold text-gray-900" id="user-name"></p>
                <p class="text-xs text-gray-500" id="user-email"></p>
            </div>

            <a href="../pages/perfil.html" class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-800 transition-all duration-150 rounded-md cursor-pointer">
                Mi Perfil
            </a>

            <button id="logout-btn"
                class="flex items-center w-full px-4 py-3 text-sm text-gray-600 hover:bg-red-100 hover:text-red-800 transition-all duration-150 rounded-md cursor-pointer">
                Cerrar sesión
            </button>
        </div>
    </div>
    `;

    document.getElementById("user-name").textContent = `${usuario.nombre} ${usuario.apellido}`;
    document.getElementById("user-email").textContent = usuario.correo;

    const avatar = `${usuario.nombre[0]}${usuario.apellido[0]}`.toUpperCase();
    document.getElementById("user-avatar").textContent = avatar;

    // Abrir / cerrar menú
    document.getElementById("user-menu-btn").addEventListener("click", () => {
        const drop = document.getElementById("user-dropdown");

        if (drop.classList.contains("hidden")) {
            drop.classList.remove("hidden");
            setTimeout(() => {
                drop.classList.remove("opacity-0", "scale-95");
                drop.classList.add("opacity-100", "scale-100");
            }, 20);
        } else {
            drop.classList.remove("opacity-100", "scale-100");
            drop.classList.add("opacity-0", "scale-95");
            setTimeout(() => drop.classList.add("hidden"), 150);
        }
    });
});

/*************** CERRAR SESIÓN ***************/
document.addEventListener("click", (e) => {
    if (e.target.id === "logout-btn") {
        localStorage.clear();
        window.location.href = "../pages/login.html";
    }
});

/*************** CARGAR DATOS EN PERFIL.HTML ***************/
document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return;

    // avatar grande
    const avatarPerfil = document.querySelector(".user-avatar");
    if (avatarPerfil) {
        avatarPerfil.textContent =
            usuario.nombre[0].toUpperCase() + usuario.apellido[0].toUpperCase();
    }

    // mostrar nombre + email
    const userName = document.querySelector(".user-name");
    const userEmail = document.querySelector(".user-email");

    if (userName) userName.textContent = `${usuario.nombre} ${usuario.apellido}`;
    if (userEmail) userEmail.textContent = usuario.correo;

    // inputs
    document.getElementById("perfil-name").value = usuario.nombre;
    document.getElementById("perfil-lastName").value = usuario.apellido;
    document.getElementById("perfil-email").value = usuario.correo;
    document.getElementById("perfil-tel").value = usuario.telefono || "";
});

/*************** CONTROLES DEL MODO EDICIÓN ***************/
const btnEditar = document.getElementById("editar-perfil");
const btnGuardar = document.getElementById("guardar-cambios");
const btnCancelar = document.getElementById("cancelar-cambios");

const inpName = document.getElementById("perfil-name");
const inpLast = document.getElementById("perfil-lastName");
const inpEmail = document.getElementById("perfil-email");
const inpTel = document.getElementById("perfil-tel");

// Activar edición
if (btnEditar) {
    btnEditar.addEventListener("click", () => {
        inpName.disabled = false;
        inpLast.disabled = false;
        inpTel.disabled = false;

        btnGuardar.classList.remove("hidden");
        btnCancelar.classList.remove("hidden");
        btnEditar.classList.add("hidden");
    });
}

// Cancelar cambios
if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
        window.location.reload();
    });
}

// Guardar cambios
if (btnGuardar) {
    btnGuardar.addEventListener("click", async (e) => {
        e.preventDefault();

        const nombre = inpName.value.trim();
        const apellido = inpLast.value.trim();
        const telefono = inpTel.value.trim();
        const correo = inpEmail.value.trim();

        try {
            const res = await fetch("http://localhost:8081/api/perfil/actualizar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, apellido, telefono, correo }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Error al actualizar");
                return;
            }

            const usuarioActualizado = data.usuario;

            // Actualizar localStorage
            localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

            alert("Perfil actualizado correctamente");
            window.location.reload();
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("Error al conectar con el servidor");
        }
    });
}
