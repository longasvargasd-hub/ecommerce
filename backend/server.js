import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; 
import "./db/db.js"
import productosRoutes from "./routes/productos.js";
import userRoutes from "./routes/user.js";
import loginusuario from "./routes/login.js";
import obtenerPerfil from './routes/perfil.js';
import registroRoutes from "./routes/registro.js";
import RecuperarPassword from './routes/recuperar.js';
import carritoRoutes from './routes/carrito.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send('bienvenido al curso de node');
});

app.use("/api/productos", productosRoutes);
app.use("/api/user", userRoutes);
app.use("/api/login", loginusuario);
app.use("/api/perfil", obtenerPerfil);
app.use("/api/registro", registroRoutes);
app.use('/api/Recuperar', RecuperarPassword);
app.use('/api/carrito', carritoRoutes); 

app.listen(8081, ()=> console.log('servidor corriendo en http://localhost:8081'));