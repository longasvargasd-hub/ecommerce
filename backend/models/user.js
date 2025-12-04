import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    telefono: { type: String, required: true }, // Cambié a String
    correo: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    
    // ✅ NUEVOS CAMPOS PARA RECUPERACIÓN
    codigoRecuperacion: { type: String },
    codigoExpiracion: { type: Date }
});

const user = mongoose.model("user", userSchema, "user");
export default user;