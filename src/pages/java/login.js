
document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ página cargada correctamente - sistema listo');

    // creamos la constante de la api
    const API_URL = "https://tiendaecommer.onrender.com/api/login";

    // enviar los datos del formulario
    document.getElementById('login-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        // preparamos los elementos de la pagina
        const btn = document.getElementById("login-btn");
        const errorDiv = document.getElementById("login-error");
        const errorMsg = document.getElementById("login-error-message");

        // Ocultar mensaje de error al comenzar
        errorDiv.classList.add('hidden');

        // recoger los datos del formulario
        const datos = {
            correo:document.getElementById("email").value.trim(),
            password:document.getElementById("password").value
        };

        // validamos que los campos no estan vacios 
        if (!datos.correo || !datos.password) {
            errorMsg.textContent = 'Por favor completa los datos';
            errorDiv.classList.remove('hidden');
            return;
        }

        // cambia el boton mientras procesa
        btn.disabled = true;
        const originalBtnText = btn.textContent;
        btn.textContent = 'Iniciando sesión...';

        // envia los datos al servidor 
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            // recibir respuestas del servidor 
            const resultado = await response.json();

            if (response.ok) {
                console.log('Inicio de sesión exitoso');

                // guardar información (NO guardes contraseñas en localStorage en producción)
                const usuarioParaAlmacenar = {
                    nombre: resultado.usuario.nombre || '',
                    apellido: resultado.usuario.apellido || '',
                    telefono: resultado.usuario.telefono || '',
                    correo: resultado.usuario.correo || ''
                   
                };
                localStorage.setItem("sesionActiva", "true");
                localStorage.setItem("usuario", JSON.stringify(usuarioParaAlmacenar));

                // mensaje de exito
                errorDiv.className = 'bg-green-50 border border-green-200 text-green-800 px-4 py-5 rounded-lg';
                errorMsg.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
                errorDiv.classList.remove('hidden');

                // redirigir a productos
                setTimeout(() => window.location.href= "./productos.html" , 800);

            } else {
                // credenciales incorrectas u otro error desde backend
                errorMsg.textContent = resultado.message || 'Credenciales incorrectas';
                errorDiv.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = originalBtnText;
            }

        } catch (error) {
            console.error('Error de conexión con el servidor', error);
            errorMsg.textContent = 'Error de conexión con el servidor';
            errorDiv.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = originalBtnText;
        }
    });
});


