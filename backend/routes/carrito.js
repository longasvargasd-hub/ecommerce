import express from 'express';
import {
  obtenerCarrito,
  agregarAlCarrito,
  actualizarCantidad,
  eliminarDelCarrito,
  vaciarCarrito,
  obtenerTotal,
  finalizarCompra
} from '../controllers/carrito.js';

const router = express.Router();

// Rutas del carrito
router.get('/', obtenerCarrito);                  
router.post('/', agregarAlCarrito);                 
router.put('/:id', actualizarCantidad);             
router.delete('/:id', eliminarDelCarrito);         
router.delete('/vaciar/todo', vaciarCarrito);       
router.get('/total/suma', obtenerTotal);           
router.post('/finalizar/compra', finalizarCompra);  

export default router;