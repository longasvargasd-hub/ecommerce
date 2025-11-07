import express from "express";
import productos from "../models/productos.js";
const router=express.Router();
router.post("/",async function(req,res){
    try {
        const{productId,Nombre,Descripcion,Precio,Image}=req.body;
        const newproduct=new productos({
            productId,
            Nombre,
            Descripcion,
            Precio,
            Image
        });
        await newproduct.save();
        res.status(201).json({mesagge:"Guardado con exito"});

    } catch (error) {
        console.error("Error al guardar el producto",error);
        res.status(400).json({
            mesagge:"Error al ingresar el producto"

        });

    }
})

//Traer los datos de la base de datos //
router.get("/", async(req,res)=>{
    try{
    const listarproductos =await productos.find();
    res.json(listarproductos)
    } catch (error){
        res.status(500).json({mesagge: "error al obtener los productos"})
    }
})
export default router;