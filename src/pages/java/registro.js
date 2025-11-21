document.addEventListener("DOMContentLoaded", function () {
    console.log("Registro cargado correctamente");

    const API_URL = "http://localhost:8081/api/registro";

    const msgBox = document.getElementById("mensaje");

    function mostrarMensaje(texto, tipo) {
        msgBox.textContent = texto;
        msgBox.classList.remove("hidden");

        if (tipo === "error") {
            msgBox.classList.remove("bg-green-600");
            msgBox.classList.add("bg-red-600");
        } else {
            msgBox.classList.remove("bg-red-600");
            msgBox.classList.add("bg-green-600");
        }

        setTimeout(() => {
            msgBox.classList.add("hidden");
        }, 4000);
    }

    document.getElementById("register-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const datos = {
            nombre: document.getElementById("nombre").value.trim(),
            apellido: document.getElementById("apellido").value.trim(),
            telefono: document.getElementById("telefono").value.trim(),
            correo: document.getElementById("correo").value.trim(),
            password: document.getElementById("password").value
        };

        if (!datos.nombre || !datos.apellido || !datos.telefono || !datos.correo || !datos.password) {
            mostrarMensaje("Por favor complete todos los campos", "error");
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });

            const resultado = await response.json();

            if (response.ok) {
                mostrarMensaje("Registro exitoso. Redirigiendo al login...", "success");

                setTimeout(() => {
                    window.location.href = "./login.html";
                }, 1500);
            } else {
                mostrarMensaje(resultado.message || "Error en el registro", "error");
            }

        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            mostrarMensaje("Error interno del servidor", "error");
        }
    });
});