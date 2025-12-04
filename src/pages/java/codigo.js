document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Página de código cargada correctamente');

    const API_URL = "http://localhost:8081/api/Recuperar/cambiar-password";

    // Obtener y mostrar el correo guardado
    const correoGuardado = localStorage.getItem('correo');
    if (correoGuardado) {
        const { correo } = JSON.parse(correoGuardado);
        document.getElementById('correo-usuario').textContent = correo;
    } else {
        // Si no hay correo guardado, redirigir a recuperar
        alert('Sesión expirada. Por favor, solicita un nuevo código.');
        window.location.href = './recuperar.html';
    }

    // Manejar el envío del formulario
    document.getElementById('codigo-form').addEventListener('submit', async (e) => {
        e.preventDefault();

    
        const btn = document.getElementById('cambiar-password');
        const passwordError = document.getElementById('password-error');
        
        // Ocultar errores previos
        passwordError.classList.add('hidden');

        // Obtener valores del formulario
        const codigo = document.getElementById('codigo').value.trim();
        const nuevaPassword = document.getElementById('password').value;
        const confirmarPassword = document.getElementById('confirmar-password').value;

        // Validaciones en el frontend
        if (!codigo) {
            mostrarError(passwordError, 'Por favor ingresa el código');
            return;
        }

        if (codigo.length !== 6) {
            mostrarError(passwordError, 'El código debe tener 6 dígitos');
            return;
        }

        if (!nuevaPassword) {
            mostrarError(passwordError, 'Por favor ingresa una nueva contraseña');
            return;
        }

        if (nuevaPassword.length < 6) {
            mostrarError(passwordError, 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (nuevaPassword !== confirmarPassword) {
            mostrarError(passwordError, 'Las contraseñas no coinciden');
            return;
        }

        // Preparar datos para enviar
        const correoData = JSON.parse(localStorage.getItem('correo'));
        const datos = {
            correo: correoData.correo,
            codigo: codigo,
            nuevaPassword: nuevaPassword
        };

        // Deshabilitar botón mientras procesa
        btn.disabled = true;
        const textoOriginal = btn.textContent;
        btn.textContent = 'Cambiando contraseña...';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const resultado = await response.json();

            if (response.ok) {
                // Éxito - mostrar mensaje y redirigir
                mostrarExito(passwordError, '¡Contraseña cambiada exitosamente!');
                
                // Limpiar localStorage
                localStorage.removeItem('correo');

                // Redirigir al login después de 2 segundos
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 2000);

            } else {
                // Error del servidor
                mostrarError(passwordError, resultado.message || 'Error al cambiar contraseña');
                btn.disabled = false;
                btn.textContent = textoOriginal;
            }

        } catch (error) {
            console.error('Error de conexión:', error);
            mostrarError(passwordError, 'Error de conexión con el servidor');
            btn.disabled = false;
            btn.textContent = textoOriginal;
        }
    });

    // Validar que solo se ingresen números en el código
    document.getElementById('codigo').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    });
});

// Función para mostrar errores
function mostrarError(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.classList.remove('hidden', 'text-green-500');
    elemento.classList.add('text-red-500');
}

// Función para mostrar mensajes de éxito
function mostrarExito(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.classList.remove('hidden', 'text-red-500');
    elemento.classList.add('text-green-500');
}