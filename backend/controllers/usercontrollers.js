import user from "../models/user.js";
import bcrypt from "bcrypt";

export const registraruser = async (req, res) => {
    try {
        const { nombre, apellido, telefono, correo, password } = req.body;

        if (!nombre || !apellido || !telefono || !correo || !password) {
            return res.status(400).json({ message: "todos los campos son obligatorios" });
        }

        // Limpiamos el correo antes de procesar
        const emailLimpio = correo.toLowerCase().trim();

        const existeusuario = await user.findOne({ correo: emailLimpio });
        if (existeusuario) {
            return res.status(400).json({ message: "usuario ya esta registrado" });
        }

        const saltRounds = 10;
        const hashedpassword = await bcrypt.hash(password, saltRounds);

        const nuevousuario = new user({ 
            nombre, 
            apellido, 
            telefono, 
            correo: emailLimpio, 
            password: hashedpassword 
        });

        await nuevousuario.save();
        res.status(201).json({ message: "usuario registrado con exito" });
    } catch (error) {
        res.status(500).json({ message: "error al registrar usuario", error: error.message });
    }
};