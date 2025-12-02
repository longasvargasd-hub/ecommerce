document.addEventListener('DOMContentLoaded', () => {
    console.log('✅pagina cargada correcta - sistema listo');

    const API_URL = "http://localhost:8081/api/Recuperar/solicitar-codigo"

    document.getElementById('recuperar-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        //preparamos los elementos de la pagina
        const btn = document.getElementById('recuperar-btn');
        const errorDiv=document.getElementById('recuperar-error');
        const  errorMsg=document.getElementById('recuperar-error-message');

        errorDiv.classList.add('hidden');

        const datos = {
            correo:document.getElementById('email').value.trim()
        };

        if (!datos.correo){
            errorMsg.textContent = 'por favor completa los datos';
            errorDiv.classList.remove('hidden');
            return;
        }

        //cambia el boton mientras procesa
        btn.disabled = true;

        try {
            const response = await fetch(API_URL,{
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify(datos)
            });

            const resultado = await response.json();

            if (response.ok) {

                localStorage.setItem('correo', JSON.stringify({
                    correo: datos.correo
                }))
                

                //mensaje de exito
                errorDiv.className='bg-green-50 border-green-200 text-green-800 px-4 py-3 rounded-lg';
                errorMsg.textContent='Inicio de sesion, Redirigiendo....'
                
                //rederigir a productos
                setTimeout(()=> window.location.href='./codigo.html', 3000);
            } else {
                errorMsg.textContent = resultado.message || 'error de controlador';
                errorDiv.classList.remove('hidden');
                btn.disabled = false;
            }


            
        } catch (error) {

        console.error('Error 404-Error de conexion con el servidor', error);
        errorMsg.textContent='Error conexion de servidor';
        errorDiv.classList.remove('hidden');
        btn.disabled=false;            
        };

    });

});   

