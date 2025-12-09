import mongoose from "mongoose";

const pedidoSchema = new mongoose.Schema({
    productos: [{
        productoId: { type: String, required: true },
        nombre: { type: String, required: true },
        precio: { type: Number, required: true },
        cantidad: { type: Number, required: true },
        imagen: { type: String },
        total: { type: Number, required: true }
    }],
    
    direccionEnvio: {
        calle: { type: String },
        ciudad: { type: String },
        codigoPostal: { type: String },
        pais: { type: String, default: 'Colombia' }
    },
    
    metodoPago: { type: String, required: true },
    total: { type: Number, required: true },
    estado: { 
        type: String, 
        enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
        default: 'procesando' 
    },
    fechaPedido: { type: Date, default: Date.now }
});

const Pedido = mongoose.model("Pedido", pedidoSchema, "pedidos");

export default Pedido;
