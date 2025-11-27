//importamos el modelo de la base de datos
import user from "../models/user.js"

//obtener el perfil del usuario de la bd
export const obtenerPerfil = async(req,res)=>{
    try{
        const {correo} = req.body;
        if (!correo){
            return res.status(400).json({message: "email es requerido"});
        }

        // traer el correo de la base de datos 
        const usuario = await user.findOne({correo:correo}).select('-password')
        if(!usuario){
            return res.status(400).json({message: "usuario no encontrado"})
        }
        res.status(200).json({
            usuario:{
                nombre:usuario.nombre,
                apellido:usuario.apellido,
                telefono:usuario.telefono,
                correo:usuario.correo
            }
        })

    }catch (error){
        res.status(500).json({
            message:"error al obtener el perfil", error:error.message
        });

    }
}
// actualizar perfil del usuario 
export const actualizarPerfil = async (req, res) => {
    try {
        const {correo, nombre, apellido, telefono} = req.body;

        // validar campos obligatorios 
        if (!correo) {
            return res.status(400).json({ message: "email es requerido"});
        }

        if (!nombre || !apellido || !telefono) {
             return res.status(400).json({ message: "Todos los campos son obligatorios"});
        }

        const usuarioActualizado = await user.findOneAndUpdate(
            {correo: correo},
            {
                nombre: nombre,
                apellido: apellido,
                telefono: telefono
            },
            {new: true}
            // no va seleccionar el campo passwords
        ).select('-passwods')

        if (!usuarioActualizado) {
            return req.status(404).json({ message: "Usuario no encontrado"});
        }

        return res.status(200).json({
            message: "Perfil actualizado exitosamente",
            usuario: {
                nombre:usuarioActualizado.nombre,
                apellido:usuarioActualizado.apellido,
                telefono:usuarioActualizado.telefono,
                correo:usuarioActualizado.correo 
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar perfil",
            error: error.message
        });
    }
};

export const eliminarPerfil = async (req,res) =>{
    try {
        const {correo} = req.body;

        //validar que el email este presente
        if (!correo)  {
            return res.status(400).json({message: "Email es requerido"});
        }

        // buscar y eliminar usuario
        const usuarioEliminar  = await user.findOneAndDelete({
            correo: correo
        });

        if(!usuarioEliminar) {
            return res.status(404).json({message: "usuario no encontrado"});
        }

        res.status(200).json({
            message: "usuario eliminado exitosamente",
            usuario: {
                nombre: usuarioEliminar.nombre,
                apellido: usuarioEliminar.apellido,
                telefono:usuarioEliminar.telefono,
                correo: usuarioEliminar.correo
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar perfil",
            error: error.message
        });
    }
};