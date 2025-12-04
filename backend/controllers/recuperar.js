import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import user from "../models/user.js";

// Transporter del correo o gmail
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

//  SOLICITAR CÓDIGO DE RECUPERACIÓN
export const solicitarCodigo = async (req, res) => {
    try {
        const { correo } = req.body;

        if (!correo) {
            return res.status(400).json({ message: "Ingresa un correo válido" });
        }

        const usuario = await user.findOne({ correo });

        if (!usuario) {
            return res.status(404).json({ message: "Correo no encontrado" });
        }

        // Generar y guardar código
        const codigo = generarCodigo();
        usuario.codigoRecuperacion = codigo;
        usuario.codigoExpiracion = Date.now() + 900000; // 15 minutos
        await usuario.save();

        // Enviar email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: usuario.correo,
            subject: "Código de Recuperación - TechStore Pro",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
                        <h1 style="color: #4F46E5;">TechStore Pro</h1>
                        <h2>Código de Recuperación</h2>
                        <p>Has solicitado recuperar tu contraseña. Usa el siguiente código:</p>
                        <div style="background: #4F46E5; color: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; border-radius: 5px; margin: 20px 0;">
                            ${codigo}
                        </div>
                        <p style="color: #666;">Este código expira en 15 minutos.</p>
                        <p style="color: #999; font-size: 12px;">Si no solicitaste este código, ignora este mensaje.</p>
                    </div>
                </div>
            `
        });

        res.status(200).json({ message: "Código enviado correctamente a tu correo" });

    } catch (error) {
        console.error("Error al enviar código:", error);
        res.status(500).json({ message: "Error al enviar el código", error: error.message });
    }
};

//  CAMBIAR CONTRASEÑA
export const cambiarPassword = async (req, res) => {
    try {
        const { correo, codigo, nuevaPassword } = req.body;

        if (!correo || !codigo || !nuevaPassword) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const usuario = await user.findOne({ correo });

        if (!usuario) {
            return res.status(404).json({ message: "Correo no encontrado" });
        }

        if (!usuario.codigoRecuperacion) {
            return res.status(400).json({ message: "No hay código de recuperación activo" });
        }

        if (usuario.codigoRecuperacion !== codigo) {
            return res.status(400).json({ message: "Código incorrecto" });
        }

        if (Date.now() > usuario.codigoExpiracion) {
            return res.status(400).json({ message: "Código expirado. Solicita uno nuevo" });
        }

        if (nuevaPassword.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener mínimo 6 caracteres" });
        }

        //  CORREGIDO: usa 'password' no 'passwords'
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(nuevaPassword, salt);

        // Limpiar código
        usuario.codigoRecuperacion = undefined;
        usuario.codigoExpiracion = undefined;
        await usuario.save();

        res.status(200).json({ message: "Contraseña actualizada exitosamente" });

    } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        res.status(500).json({ message: "Error al cambiar contraseña", error: error.message });
    }
};


