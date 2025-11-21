// Función de visibilidad del ojo
document.getElementById('toggle-password').addEventListener('click', function () {

    const passwordInput = document.getElementById('password');
    const eyeOpen = document.getElementById('eye-icon-open');
    const eyeClosed = document.getElementById('eye-icon-closed');

    // Verificar si la contraseña está oculta
    const isHidden = passwordInput.type === 'password';

    // Cambiar password a texto al dar clic en el ojo
    passwordInput.type = isHidden ? 'text' : 'password';

    // Alternar íconos según el estado
    eyeOpen.classList.toggle('hidden', !isHidden);
    eyeClosed.classList.toggle('hidden', isHidden);
});
