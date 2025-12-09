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

dotenv.config();

const app = express();


app.use(cors({
  origin: ['https://ecommertiendia.netlify.app', 'http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

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

const PORT = process.env.PORT || 8081;

app.listen(PORT, ()=> console.log(`servidor corriendo en https://tiendaecommer.onrender.com`));