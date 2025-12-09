import Carrito from '../models/carrito.js';
import Pedido from '../models/pedido.js';

// Obtener todos los items del carrito
export const obtenerCarrito = async (req, res) => {
  try {
    const items = await Carrito.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el carrito', error: error.message });
  }
};

// Agregar item al carrito
export const agregarAlCarrito = async (req, res) => {
  try {
    const { productoId, nombre, precio, cantidad, imagen, metodoPago, direccionEnvio } = req.body;
    
    // Calcular el total
    const total = precio * cantidad;
    
    // Verificar si el producto ya existe en el carrito
    const itemExistente = await Carrito.findOne({ productoId });
    
    if (itemExistente) {
      // Si existe, actualizar la cantidad y el total
      itemExistente.cantidad += cantidad;
      itemExistente.total = itemExistente.precio * itemExistente.cantidad;
      await itemExistente.save();
      
      return res.status(200).json({ 
        mensaje: 'Cantidad actualizada en el carrito', 
        item: itemExistente 
      });
    }
    
    // Si no existe, crear nuevo item
    const nuevoItem = new Carrito({
      productoId,
      nombre,
      precio,
      cantidad,
      imagen,
      total,
      metodoPago,
      direccionEnvio
    });
    
    await nuevoItem.save();
    res.status(201).json({ mensaje: 'Producto agregado al carrito', item: nuevoItem });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar al carrito', error: error.message });
  }
};

// Actualizar cantidad de un item
export const actualizarCantidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, metodoPago, direccionEnvio } = req.body;
    
    const item = await Carrito.findById(id);
    
    if (!item) {
      return res.status(404).json({ mensaje: 'Item no encontrado' });
    }
    
    item.cantidad = cantidad;
    item.total = item.precio * cantidad;
    
    // Actualizar método de pago y dirección si se proporcionan
    if (metodoPago) item.metodoPago = metodoPago;
    if (direccionEnvio) item.direccionEnvio = direccionEnvio;
    
    await item.save();
    
    res.status(200).json({ mensaje: 'Cantidad actualizada', item });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar cantidad', error: error.message });
  }
};

// Eliminar item del carrito
export const eliminarDelCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Carrito.findByIdAndDelete(id);
    
    if (!item) {
      return res.status(404).json({ mensaje: 'Item no encontrado' });
    }
    
    res.status(200).json({ mensaje: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar del carrito', error: error.message });
  }
};

// Vaciar todo el carrito
export const vaciarCarrito = async (req, res) => {
  try {
    await Carrito.deleteMany({});
    res.status(200).json({ mensaje: 'Carrito vaciado exitosamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al vaciar el carrito', error: error.message });
  }
};

// Obtener total del carrito
export const obtenerTotal = async (req, res) => {
  try {
    const items = await Carrito.find();
    const total = items.reduce((sum, item) => sum + item.total, 0);
    
    res.status(200).json({ 
      total, 
      cantidadItems: items.length,
      items 
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al calcular total', error: error.message });
  }
};

// ⭐⭐⭐ FINALIZAR COMPRA - GUARDA EN MONGODB Y VACÍA CARRITO ⭐⭐⭐
export const finalizarCompra = async (req, res) => {
  try {
    console.log('🚀 Iniciando proceso de finalizar compra...');
    
    // 1. Obtener todos los items del carrito
    const items = await Carrito.find();
    
    console.log(`📦 Items en el carrito: ${items.length}`);
    
    if (items.length === 0) {
      return res.status(400).json({ mensaje: 'El carrito está vacío' });
    }
    
    // 2. Calcular total
    const total = items.reduce((sum, item) => sum + item.total, 0);
    
    // 3. Preparar productos para el pedido
    const productos = items.map(item => ({
      productoId: item.productoId,
      nombre: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad,
      imagen: item.imagen || '',
      total: item.total
    }));
    
    // 4. Obtener método de pago y dirección del primer item
    const primerItem = items[0];
    const metodoPago = primerItem.metodoPago || 'Efectivo contra entrega';
    const direccionEnvio = primerItem.direccionEnvio || {
      calle: '',
      ciudad: '',
      codigoPostal: '',
      pais: 'Colombia'
    };
    
    // 5. ⭐ CREAR EL PEDIDO EN LA COLECCIÓN "pedidos"
    const nuevoPedido = new Pedido({
      productos: productos,
      direccionEnvio: direccionEnvio,
      metodoPago: metodoPago,
      total: total,
      estado: 'procesando',
      fechaPedido: new Date()
    });
    
    // 6. Guardar el pedido en la base de datos
    await nuevoPedido.save();
    
    console.log('✅ Pedido guardado en la base de datos:', nuevoPedido._id);
    
    // 7. Vaciar el carrito después de guardar el pedido
    await Carrito.deleteMany({});
    
    console.log('✅ Carrito vaciado exitosamente');
    
    // 8. Responder con éxito
    res.status(200).json({ 
      mensaje: 'Compra procesada exitosamente', 
      total: total,
      pedidoId: nuevoPedido._id,
      pedido: nuevoPedido
    });
    
  } catch (error) {
    console.error('❌ Error al finalizar compra:', error);
    res.status(500).json({ 
      mensaje: 'Error al finalizar compra', 
      error: error.message 
    });
  }
};