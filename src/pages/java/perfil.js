document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) return;

    document.querySelector(".user-avatar").textContent = usuario.nombre[0].toUpperCase() + usuario.apellido[0].toUpperCase();

    document.querySelector(".user-name").textContent = `${usuario.nombre} ${usuario.apellido}`;
    document.querySelector(".user-email").textContent = usuario.correo;

    document.getElementById("perfil-name").value = usuario.nombre;
    document.getElementById("perfil-lastName").value = usuario.apellido;
    document.getElementById("perfil-email").value = usuario.correo;
    document.getElementById("perfil-tel").value = usuario.telefono || "";
    /*************** EDICIÓN DEL PERFIL ***************/
    const btnEditar = document.getElementById("editar-perfil");
    const btnGuardar = document.getElementById("guardar-cambios");
    const btnCancelar = document.getElementById("cancelar-cambios");
    
    const inpName = document.getElementById("perfil-name");
    const inpLast = document.getElementById("perfil-lastName");
    const inpEmail = document.getElementById("perfil-email");
    const inpTel = document.getElementById("perfil-tel");
    
    btnEditar.addEventListener("click", () => {
        inpName.disabled = false;
        inpLast.disabled = false;
        inpTel.disabled = false;
    
        btnGuardar.classList.remove("hidden");
        btnCancelar.classList.remove("hidden");
        btnEditar.classList.add("hidden");
    });
    
    btnCancelar.addEventListener("click", () => {
        window.location.reload();
    });
    
    btnGuardar.addEventListener("click", async (e) => {
        e.preventDefault();
    
        const nombre = inpName.value.trim();
        const apellido = inpLast.value.trim();
        const telefono = inpTel.value.trim();
        const correo = inpEmail.value.trim();
    
        try {
            const res = await fetch("https://tiendaecommer.onrender.com/api/perfil/actualizar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, apellido, telefono, correo }),
            });
    
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Error al actualizar");
                return;
            }
    
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
            alert("Perfil actualizado correctamente");
            window.location.reload();
        } catch (error) {
            alert("Error al conectar con el servidor");
        }
    });
});

