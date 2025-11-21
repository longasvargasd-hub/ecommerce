import bcrypt from "bcrypt";
import user from "../models/user.js";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, telefono, correo, password } = req.body;

    if (!nombre || !apellido || !telefono || !correo || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const existe = await user.findOne({ correo });
    if (existe) {
      return res.status(400).json({ message: "Este correo ya está registrado" });
    }

    const passwordEncriptada = await bcrypt.hash(password, 10);

    const nuevoUsuario = new user({
      nombre,
      apellido,
      telefono,
      correo,
      password: passwordEncriptada
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });

  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
};