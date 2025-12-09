document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Página de registro cargada correctamente - sistema listo");

    const API_URL = "https://tiendaecommer.onrender.com/api/registro";

    // Manejar envío del formulario
    document.getElementById("register-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        // Preparar elementos de la página
        const btn = document.getElementById("register-submit");
        const errorDiv = document.getElementById("register-error");
        const errorMsg = document.getElementById("register-error-message");
        const passwordError = document.getElementById("password-error");

        // Ocultar mensajes de error previos
        errorDiv.classList.add("hidden");
        passwordError.classList.add("hidden");

        // Recoger datos del formulario
        const datos = {
            nombre: document.getElementById("nombre").value.trim(),
            apellido: document.getElementById("apellido").value.trim(),
            telefono: document.getElementById("telefono").value.trim(),
            correo: document.getElementById("correo").value.trim(),
            password: document.getElementById("password").value
        };

        // Verificar términos y condiciones
        const terms = document.getElementById("terms");
        if (!terms.checked) {
            errorMsg.textContent = "Debes aceptar los términos y condiciones";
            errorDiv.classList.remove("hidden");
            return;
        }

        // Validar que los campos no estén vacíos
        if (!datos.nombre || !datos.apellido || !datos.telefono || !datos.correo || !datos.password) {
            errorMsg.textContent = "Por favor completa todos los campos";
            errorDiv.classList.remove("hidden");
            return;
        }

        // Validar longitud de contraseña
        if (datos.password.length < 6) {
            passwordError.textContent = "La contraseña debe tener al menos 6 caracteres";
            passwordError.classList.remove("hidden");
            return;
        }

        // Validar formato de correo básico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datos.correo)) {
            errorMsg.textContent = "Por favor ingresa un correo válido";
            errorDiv.classList.remove("hidden");
            return;
        }

        // Cambiar botón mientras procesa
        btn.disabled = true;
        const originalBtnText = btn.innerHTML;
        btn.innerHTML = `
            <svg class="w-5 h-5 inline mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Creando cuenta...
        `;

        // Enviar datos al servidor
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });

            const resultado = await response.json();

            if (response.ok) {
                // Éxito - mostrar mensaje verde
                errorDiv.className = "bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg";
                errorMsg.textContent = "¡Cuenta creada exitosamente! Redirigiendo al login...";
                errorDiv.classList.remove("hidden");

                // Redirigir al login después de 2 segundos
                setTimeout(() => {
                    window.location.href = "./login.html";
                }, 2000);

            } else {
                // Error del servidor
                errorMsg.textContent = resultado.message || "Error al crear la cuenta";
                errorDiv.classList.remove("hidden");
                btn.disabled = false;
                btn.innerHTML = originalBtnText;
            }

        } catch (error) {
            console.error("Error de conexión con el servidor:", error);
            errorMsg.textContent = "Error de conexión con el servidor. Intenta nuevamente.";
            errorDiv.classList.remove("hidden");
            btn.disabled = false;
            btn.innerHTML = originalBtnText;
        }
    });

    // Validación en tiempo real de la contraseña
    document.getElementById("password").addEventListener("input", (e) => {
        const passwordError = document.getElementById("password-error");
        if (e.target.value.length > 0 && e.target.value.length < 6) {
            passwordError.textContent = "La contraseña debe tener al menos 6 caracteres";
            passwordError.classList.remove("hidden");
        } else {
            passwordError.classList.add("hidden");
        }
    });
});