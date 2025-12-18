document.addEventListener('DOMContentLoaded', () => {
    
    // Toggle para contraseña principal
    // (funciona en login.html, registro.html, codigo.html)
    const togglePassword = document.getElementById('toggle-password');
    
    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            const passwordInput = document.getElementById('password');
            const eyeOpen = document.getElementById('eye-icon-open');
            const eyeClosed = document.getElementById('eye-icon-closed');

            // Verificar si la contraseña está oculta
            const isHidden = passwordInput.type === 'password';

            // Cambiar password a texto al dar clic en el ojo
            passwordInput.type = isHidden ? 'text' : 'password';

            eyeOpen.classList.toggle('hidden', !isHidden);
            eyeClosed.classList.toggle('hidden', isHidden);
        });
    }

    // Toggle para CONFIRMAR contraseña
    // (solo funciona en codigo.html)

    const toggleConfirmarPassword = document.getElementById('toggle-confirmar-password');
    
    if (toggleConfirmarPassword) {
        toggleConfirmarPassword.addEventListener('click', function () {
            const confirmarPasswordInput = document.getElementById('confirmar-password');
            const confirmarEyeOpen = document.getElementById('confirmar-eye-icon-open');
            const confirmarEyeClosed = document.getElementById('confirmar-eye-icon-closed');

            // Verificar si la contraseña está oculta
            const isHidden = confirmarPasswordInput.type === 'password';

            // Cambiar password a texto al dar clic en el ojo
            confirmarPasswordInput.type = isHidden ? 'text' : 'password';

            // Alternar íconos según el estado
            confirmarEyeOpen.classList.toggle('hidden', !isHidden);
            confirmarEyeClosed.classList.toggle('hidden', isHidden);
        });
    }
});