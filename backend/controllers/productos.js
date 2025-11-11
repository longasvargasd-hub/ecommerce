import productos from "../models/productos.js";

//crear productos
export const createproductos=async(req,res)=>{
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

}

export const obtenerproductos=async (req,res)=>{
    try{
    const listaproductos =await productos.find();
    res.json(listaproductos);
    } catch {
        res.status(500).json({message:"error al obtener el producto"})
    }
}
export default productos;
