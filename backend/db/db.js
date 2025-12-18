import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

console.log("URI:", uri);

if (!uri) {
  throw new Error("MONGODB_URI no está definida");
}

mongoose.connect(uri)
  .then(() => console.log("✅ Conectado a la base de datos"))
  .catch(err => console.error("❌ Error MongoDB:", err));