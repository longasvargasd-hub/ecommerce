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