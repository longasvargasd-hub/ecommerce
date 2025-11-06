import express from 'express';
import cors from 'cors';
import "./db/db.js"
import productosRoutes from "./models/productos.js";



const app = express();
// habilitar toda la ruta //

app.use(cors());
// primera ruta //

app.get('/',(req,res)=>{
    res.send('bienvenido al curso de node');
});
app.use("/api/productos", productosRoutes);
app.listen(8081, ()=> console.log('servidor corrido en http://localhost:8081'));