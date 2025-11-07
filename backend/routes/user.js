import express from "express";
import user from "../models/USER";

const router = express.Router();
// ruta para registrar//
router.post("/register", async(req,res)=>{
    try {
        const {nombre,apellido,telefono,correo,password}=req.body;
        // validar que no falte ningun campo//
        if(!nombre || !apellido || !telefono || !correo || !password){
            return res.status(400).json({message: "todos los campos son obligatorios"});
        };
        const existeusuario=await user.find({correo})
        if(existeusuario){
            return res.status(400).json({message: "usuario ya esta restringido"});
        };
        // crear el usuario en la base de datos //
        const nuevousuario= new user({nombre,apellido,telefono,correo,password});
        await nuevousuario.save();
        res.status(201).json({message:"usuario registrado con exito"});
    }catch (error) {
        res.status(500).json({message:"error al registrar usuario",error:error.message})

    };
)};

export default router;