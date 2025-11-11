import bcrypt from "bcrypt";
import user from "../models/user.js";

export const loginusuario = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Validamos que los campos estén presentes
    if (!correo || !password) {
      return res.status(400).json({ message: "correo y contraseña obligatorios" });
    }

    // Buscamos el usuario
    const usuario = await user.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }

    // Comparamos contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ message: "contraseña incorrecta" });
    }

    // validamos el inicio de sesion
    res.status(200).json({ message: "inicio de sesión correcto" });

  } catch (error) {
    res.status(500).json({ message: "error al iniciar sesión", error });
  }
};
