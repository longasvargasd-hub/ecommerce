import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    telefono: { type: String, required: true },
    correo: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true       
    },
    password: { type: String, required: true, minlength: 6 },
    codigoRecuperacion: { type: String },
    codigoExpiracion: { type: Date }
});

const user = mongoose.model("user", userSchema, "user");
export default user;