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
export const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, apellido, telefono, correo } = req.body;

    if (!correo)
      return res.status(400).json({ message: "correo es requerido" });

    const usuario = await user.findOneAndUpdate(
      { correo },
      { nombre, apellido, telefono },
      { new: true, select: "-password" }
    );

    if (!usuario)
      return res.status(404).json({ message: "usuario no encontrado" });

    return res.status(200).json({ usuario });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    res.status(500).json({
      message: "error al actualizar perfil",
      error: error.message,
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