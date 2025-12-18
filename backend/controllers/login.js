import bcrypt from "bcrypt";
import user from "../models/user.js";

export const loginusuario = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: "correo y contraseña obligatorios" });
    }

    const emailBusqueda = correo.toLowerCase().trim();
    const usuario = await user.findOne({ correo: emailBusqueda });

    if (!usuario) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }

    // Comparamos la contraseña enviada con la de la BD
    const passwordValida = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValida) {
      return res.status(401).json({ message: "contraseña incorrecta" });
    }

    res.status(200).json({ 
      message: "inicio de sesión correcto",
      usuario: {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          telefono: usuario.telefono,
          correo: usuario.correo
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "error al iniciar sesión", error: error.message });
  }
};