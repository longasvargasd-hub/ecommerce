import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Importación de base de datos
await import("./db/db.js");

// Importación de Rutas
import productosRoutes from "./routes/productos.js";
import userRoutes from "./routes/user.js";
import loginRoutes from "./routes/login.js"; 
import registroRoutes from './routes/registro.js'; 
import obtenerPerfil from './routes/perfil.js';
import RecuperarPassword from './routes/recuperar.js';
import carritoRoutes from './routes/carrito.js';

const app = express();

app.use(cors());
app.use(express.json()); 

app.use("/api/productos", productosRoutes);
app.use("/api/user", userRoutes);    
app.use("/api/login", loginRoutes);
app.use("/api/registro", registroRoutes); 
app.use("/api/perfil", obtenerPerfil);
app.use('/api/Recuperar', RecuperarPassword);
app.use('/api/carrito', carritoRoutes);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});