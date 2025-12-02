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

        const data = await res.json();
        usuario = data.usuario;
    } catch (error) {
        console.error("error al obtener el perfil", error);
        localStorage.clear();
        window.location.href = "../pages/login.html";
        return;
    }

    contenedor.innerHTML = `
    <div class="relative">
        <button id="user-menu-btn" class="w-14 h-14 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold text-xl shadow-md hover:scale-105 transition-transform">
            <span id="user-avatar"></span>
        </button>

        <div id="user-dropdown" class="hidden absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 py-2">
            <div class="px-4 py-3 border-b border-gray-200">
                <p class="text-sm font-semibold text-gray-900" id="user-name"></p>
                <p class="text-xs text-gray-500" id="user-email"></p>
            </div>

            <a href="../pages/perfil.html" class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-100">
                Mi Perfil
            </a>

            <button id="logout-btn" class="flex items-center w-full px-4 py-3 text-sm text-gray-600 hover:bg-red-100">
                Cerrar sesión
            </button>
        </div>
    </div>`;

    document.getElementById("user-name").textContent = `${usuario.nombre} ${usuario.apellido}`;
    document.getElementById("user-email").textContent = usuario.correo;

    const avatar = `${usuario.nombre[0]}${usuario.apellido[0]}`.toUpperCase();
    document.getElementById("user-avatar").textContent = avatar;

    // Abrir / cerrar menú
    document.getElementById("user-menu-btn").addEventListener("click", () => {
        const drop = document.getElementById("user-dropdown");
        drop.classList.toggle("hidden");
    });
});

document.addEventListener("click", (e) => {
    if (e.target.id === "logout-btn") {
        localStorage.clear();
        window.location.href = "../pages/login.html";
    }
});
