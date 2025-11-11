import user from "../models/user.js";
import bcrypt from "bcrypt";

//creacion de los usuarios

export const registraruser=async(req,res)=>{
    try {
        const {nombre,apellido,telefono,correo,password}=req.body;
        // validar que no falte ningun campo//
        if(!nombre || !apellido || !telefono || !correo || !password){
            return res.status(400).json({message: "todos los campos son obligatorios"});
        };
        // validar que el usuario ya existe //
        const existeusuario=await user.findOne({correo});
        if(existeusuario){
            return res.status(400).json({message: "usuario ya esta registrado"});
        };
        //encriptar la contraseña//
        const saltRounds=10;
        const hashedpassword=await bcrypt.hash(password,saltRounds);
        // crear el usuario en la base de datos //
        const nuevousuario= new user({nombre,apellido,telefono,correo,password:hashedpassword});
        await nuevousuario.save();
        res.status(201).json({message:"usuario registrado con exito"});
    } catch (error) {
        res.status(500).json({message:"error al registrar usuario",error:error.message});

    };

}



