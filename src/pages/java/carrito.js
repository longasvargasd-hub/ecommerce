document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Página de carrito cargada correctamente');

    const API_URL = "http://localhost:8081/api/pedidos";
    
    // Cargar productos del carrito desde localStorage
    cargarCarrito();
    
    // Event listener para el botón de finalizar compra
    document.getElementById('finalizar-compra-btn').addEventListener('click', finalizarCompra);
});

// ===== FUNCIÓN PARA CARGAR EL CARRITO =====
function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const container = document.getElementById('cart-items-container');
    
    if (carrito.length === 0) {
        mostrarCarritoVacio();
        actualizarTotales(0);
        return;
    }
    
    // Limpiar el contenedor
    container.innerHTML = '';
    
    // Renderizar cada producto
    carrito.forEach((producto, index) => {
        const productoHTML = crearProductoHTML(producto, index);
        container.insertAdjacentHTML('beforeend', productoHTML);
    });
    
    // Calcular totales
    const subtotal = carrito.reduce((total, p) => total + (p.precio * p.cantidad), 0);
    actualizarTotales(subtotal);
    
    // Agregar event listeners a los botones
    agregarEventListeners();
}

// ===== CREAR HTML DE PRODUCTO =====
function crearProductoHTML(producto, index) {
    const subtotal = producto.precio * producto.cantidad;
    
    return `
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
            <!-- Imagen del producto -->
            <img src="${producto.imagen || 'https://via.placeholder.com/100'}" 
                 alt="${producto.nombre}" 
                 class="w-24 h-24 object-cover rounded-lg">
            
            <!-- Información del producto -->
            <div class="flex-1">
                <h3 class="font-bold text-gray-900 text-lg mb-1">${producto.nombre}</h3>
                <p class="text-gray-600 text-sm mb-2">${producto.descripcion || 'Producto de calidad'}</p>
                <p class="text-blue-600 font-bold text-lg">$${producto.precio.toLocaleString()}</p>
            </div>
            
            <!-- Controles de cantidad -->
            <div class="flex items-center gap-3">
                <button onclick="cambiarCantidad(${index}, -1)" 
                        class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                    </svg>
                </button>
                
                <span class="font-bold text-lg w-8 text-center">${producto.cantidad}</span>
                
                <button onclick="cambiarCantidad(${index}, 1)" 
                        class="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            </div>
            
            <!-- Subtotal y eliminar -->
            <div class="text-right">
                <p class="font-bold text-xl text-gray-900 mb-2">$${subtotal.toLocaleString()}</p>
                <button onclick="eliminarProducto(${index})" 
                        class="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
                    Eliminar
                </button>
            </div>
        </div>
    `;
}

// ===== MOSTRAR CARRITO VACÍO =====
function mostrarCarritoVacio() {
    const container = document.getElementById('cart-items-container');
    container.innerHTML = `
        <div class="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <p class="text-gray-500 text-lg mb-2">Tu carrito está vacío</p>
            <p class="text-gray-400 text-sm mb-4">Agrega productos para comenzar tu compra</p>
            <a href="./productos.html" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Ver productos
            </a>
        </div>
    `;
}

// ===== ACTUALIZAR TOTALES =====
function actualizarTotales(subtotal) {
    document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString()}`;
    document.getElementById('total').textContent = `$${subtotal.toLocaleString()}`;
}

// ===== CAMBIAR CANTIDAD =====
window.cambiarCantidad = function(index, cambio) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito[index]) {
        carrito[index].cantidad += cambio;
        
        // Si la cantidad es 0 o menor, eliminar el producto
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito();
    }
};

// ===== ELIMINAR PRODUCTO =====
window.eliminarProducto = function(index) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito();
};

// ===== AGREGAR EVENT LISTENERS =====
function agregarEventListeners() {
    // Ya están agregados inline en el HTML generado
}

// ===== FINALIZAR COMPRA =====
async function finalizarCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Validar que haya productos
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
        return;
    }
    
    // Obtener información del usuario (desde localStorage si está logueado)
    const usuarioGuardado = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuarioGuardado) {
        alert('Debes iniciar sesión para finalizar tu compra');
        window.location.href = './login.html';
        return;
    }
    
    // Obtener información de envío
    const direccion = document.getElementById('direccion-envio').value.trim();
    const ciudad = document.getElementById('ciudad-envio').value.trim();
    const codigoPostal = document.getElementById('codigo-postal').value.trim();
    const metodoPago = document.getElementById('metodo-pago').value;
    
    // Validar campos de envío
    if (!direccion) {
        alert('Por favor ingresa tu dirección de envío');
        document.getElementById('direccion-envio').focus();
        return;
    }
    
    // Calcular total
    const total = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    
    // Preparar productos para el pedido (según el modelo del profesor)
    const productos = carrito.map(p => ({
        productId: p._id || p.id || 'N/A',
        nombre: p.nombre,
        precio: p.precio,
        cantidad: p.cantidad
    }));
    
    // Extraer imágenes de los productos
    const imagenes = carrito.map(p => p.imagen).filter(Boolean);
    
    // Crear objeto del pedido (según el modelo del profesor)
    const pedido = {
        productos: productos,
        imagen: imagenes,
        total: total,
        estado: 'pendiente',
        metodoPago: metodoPago,
        direccionEnvio: {
            calle: direccion,
            ciudad: ciudad,
            codigoPostal: codigoPostal
        }
    };
    
    console.log('📦 Pedido a enviar:', pedido);
    
    // Deshabilitar el botón
    const btn = document.getElementById('finalizar-compra-btn');
    btn.disabled = true;
    btn.innerHTML = `
        <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Procesando...
    `;
    
    try {
        // Enviar pedido al backend
        const response = await fetch(`${API_URL}/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            // Pedido exitoso
            alert('🎉 ¡Pedido realizado exitosamente! \n\nNúmero de pedido: ' + resultado.pedido._id);
            
            // Limpiar carrito
            localStorage.removeItem('carrito');
            
            // Redirigir a página de confirmación o productos
            window.location.href = './productos.html';
            
        } else {
            // Error del servidor
            alert('Error al procesar el pedido: ' + resultado.message);
            btn.disabled = false;
            btn.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Finalizar Compra
            `;
        }
        
    } catch (error) {
        console.error('Error al finalizar compra:', error);
        alert('Error de conexión con el servidor. Intenta nuevamente.');
        btn.disabled = false;
        btn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Finalizar Compra
        `;
    }
}