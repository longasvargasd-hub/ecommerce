import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import user from "../models/user.js";

// Transporter del correo
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Función para generar código
const generarCodigo = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// --------------------------------------------------
// 📌 SOLICITAR CÓDIGO DE RECUPERACIÓN
// --------------------------------------------------
export const solicitarCodigo = async (req, res) => {
    try {
        const { correo } = req.body;

        if (!correo) {
            return res.status(400).json({ message: "Ingresa un correo válido" });
        }

        const usuario = await user.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({ message: "Correo no encontrado" });
        }

        // Generar y guardar código
        const codigo = generarCodigo();
        usuario.codigoRecuperacion = codigo;
        usuario.codigoExpiracion = Date.now() + 900000; // Expira en 15 min
        await usuario.save();

        // Enviar email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: usuario.correo,
            subject: "Código de Recuperación - TechStore Pro",
            html: `
                <h2>Tu código es:</h2>
                <h1>${codigo}</h1>
                <p>Expira en 15 minutos.</p>
            `
        });

        res.status(200).json({ message: "Código enviado correctamente" });

    } catch (error) {
        console.error("Error al enviar código:", error);
        res.status(500).json({ message: "Error interno", error: error.message });
    }
};

// --------------------------------------------------
// 📌 CAMBIAR CONTRASEÑA
// --------------------------------------------------
export const cambiarPassword = async (req, res) => {
    try {
        const { correo, codigo, nuevaPassword } = req.body;

        if (!correo || !codigo || !nuevaPassword) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const usuario = await user.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({ message: "Correo no encontrado" });
        }

        if (usuario.codigoRecuperacion !== codigo) {
            return res.status(400).json({ message: "Código incorrecto" });
        }

        if (Date.now() > usuario.codigoExpiracion) {
            return res.status(400).json({ message: "Código expirado" });
        }

        if (nuevaPassword.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener mínimo 6 caracteres" });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.passwords = await bcrypt.hash(nuevaPassword, salt);

        // Limpiar código
        usuario.codigoRecuperacion = undefined;
        usuario.codigoExpiracion = undefined;
        await usuario.save();

        res.status(200).json({ message: "Contraseña actualizada exitosamente" });

    } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        res.status(500).json({ message: "Error interno", error: error.message });
    }
};



