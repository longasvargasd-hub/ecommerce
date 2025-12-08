document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Página de carrito cargada correctamente');

    const API_URL = "http://localhost:8081/api/carrito";
    
    // Cargar productos del carrito desde el BACKEND
    cargarCarritoDesdeBackend();
    
    // Event listener para el botón de finalizar compra
    document.getElementById('finalizar-compra-btn').addEventListener('click', finalizarCompra);
});

// ===== CARGAR CARRITO DESDE EL BACKEND =====
async function cargarCarritoDesdeBackend() {
    try {
        const response = await fetch('http://localhost:8081/api/carrito');
        const productos = await response.json();
        
        console.log('📦 Productos del backend:', productos);
        
        if (!productos || productos.length === 0) {
            mostrarCarritoVacio();
            actualizarTotales(0);
            return;
        }
        
        mostrarProductos(productos);
        
    } catch (error) {
        console.error('❌ Error al cargar carrito:', error);
        mostrarCarritoVacio();
    }
}

// ===== MOSTRAR PRODUCTOS EN EL DOM =====
function mostrarProductos(productos) {
    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';
    
    let totalGeneral = 0;
    
    productos.forEach((producto) => {
        const productoHTML = crearProductoHTML(producto);
        container.insertAdjacentHTML('beforeend', productoHTML);
        totalGeneral += producto.total;
    });
    
    actualizarTotales(totalGeneral);
    actualizarContadorCarrito(productos.length);
}

// ===== CREAR HTML DE PRODUCTO =====
function crearProductoHTML(producto) {
    return `
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
            <!-- Imagen del producto -->
            <img src="${producto.imagen || 'https://via.placeholder.com/100'}" 
                 alt="${producto.nombre}" 
                 class="w-24 h-24 object-cover rounded-lg">
            
            <!-- Información del producto -->
            <div class="flex-1">
                <h3 class="font-bold text-gray-900 text-lg mb-1">${producto.nombre}</h3>
                <p class="text-gray-600 text-sm mb-2">Producto de calidad premium</p>
                <p class="text-blue-600 font-bold text-lg">$${producto.precio.toLocaleString()}</p>
            </div>
            
            <!-- Controles de cantidad -->
            <div class="flex items-center gap-3">
                <button onclick="cambiarCantidad('${producto._id}', ${producto.cantidad - 1})" 
                        class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                    </svg>
                </button>
                
                <span class="font-bold text-lg w-8 text-center">${producto.cantidad}</span>
                
                <button onclick="cambiarCantidad('${producto._id}', ${producto.cantidad + 1})" 
                        class="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            </div>
            
            <!-- Subtotal y eliminar -->
            <div class="text-right">
                <p class="font-bold text-xl text-gray-900 mb-2">$${producto.total.toLocaleString()}</p>
                <button onclick="eliminarProducto('${producto._id}')" 
                        class="text-red-500 hover:text-red-700 text-sm font-medium transition-colors flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
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
    actualizarContadorCarrito(0);
}

// ===== ACTUALIZAR TOTALES =====
function actualizarTotales(total) {
    document.getElementById('subtotal').textContent = `$${total.toLocaleString()}`;
    document.getElementById('total').textContent = `$${total.toLocaleString()}`;
}

// ===== ACTUALIZAR CONTADOR DEL CARRITO =====
function actualizarContadorCarrito(cantidad) {
    const contador = document.getElementById('cart-counter');
    if (cantidad > 0) {
        contador.textContent = cantidad;
        contador.style.display = 'flex';
    } else {
        contador.style.display = 'none';
    }
}

// ===== CAMBIAR CANTIDAD (ACTUALIZAR EN BACKEND) =====
window.cambiarCantidad = async function(id, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
        eliminarProducto(id);
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:8081/api/carrito/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cantidad: nuevaCantidad })
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            console.log('✅ Cantidad actualizada:', resultado);
            cargarCarritoDesdeBackend(); // Recargar carrito
        } else {
            alert('Error al actualizar cantidad: ' + resultado.mensaje);
        }
        
    } catch (error) {
        console.error('❌ Error al actualizar cantidad:', error);
        alert('Error de conexión. Intenta nuevamente.');
    }
};

// ===== ELIMINAR PRODUCTO DEL BACKEND =====
window.eliminarProducto = async function(id) {
    if (!confirm('¿Estás seguro de eliminar este producto del carrito?')) {
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:8081/api/carrito/${id}`, {
            method: 'DELETE'
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            console.log('✅ Producto eliminado:', resultado);
            cargarCarritoDesdeBackend(); // Recargar carrito
        } else {
            alert('Error al eliminar producto: ' + resultado.mensaje);
        }
        
    } catch (error) {
        console.error('❌ Error al eliminar producto:', error);
        alert('Error de conexión. Intenta nuevamente.');
    }
};

// ===== FINALIZAR COMPRA =====
async function finalizarCompra() {
    try {
        // 1. Verificar que hay productos en el carrito
        const responseCarrito = await fetch('http://localhost:8081/api/carrito');
        const productos = await responseCarrito.json();
        
        if (!productos || productos.length === 0) {
            alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
            return;
        }
        
        // 2. Obtener información de envío
        const direccion = document.getElementById('direccion-envio').value.trim();
        const ciudad = document.getElementById('ciudad-envio').value.trim();
        const codigoPostal = document.getElementById('codigo-postal').value.trim();
        const metodoPagoSelect = document.getElementById('metodo-pago');
        const metodoPagoTexto = metodoPagoSelect.options[metodoPagoSelect.selectedIndex].text;
        
        // 3. Validar campos
        if (!direccion) {
            alert('Por favor ingresa tu dirección de envío');
            document.getElementById('direccion-envio').focus();
            return;
        }
        
        if (!ciudad) {
            alert('Por favor ingresa tu ciudad');
            document.getElementById('ciudad-envio').focus();
            return;
        }
        
        if (!codigoPostal) {
            alert('Por favor ingresa tu código postal');
            document.getElementById('codigo-postal').focus();
            return;
        }
        
        // 4. Actualizar dirección de envío en cada producto
        const btn = document.getElementById('finalizar-compra-btn');
        btn.disabled = true;
        btn.innerHTML = `
            <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Procesando...
        `;
        
        // 5. Actualizar método de pago y dirección en cada producto
        for (const producto of productos) {
            await fetch(`http://localhost:8081/api/carrito/${producto._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cantidad: producto.cantidad,
                    metodoPago: metodoPagoTexto,
                    direccionEnvio: {
                        calle: direccion,
                        ciudad: ciudad,
                        codigoPostal: codigoPostal,
                        pais: 'Colombia'
                    }
                })
            });
        }
        
        // 6. Finalizar compra (cambiar estado a "procesando")
        const response = await fetch('http://localhost:8081/api/carrito/finalizar/compra', {
            method: 'POST'
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            // 7. Mostrar confirmación
            const total = resultado.total;
            alert(`🎉 ¡Compra finalizada exitosamente!\n\nTotal: $${total.toLocaleString()}\nMétodo de pago: ${metodoPagoTexto}\nDirección: ${direccion}, ${ciudad}\n\n¡Gracias por tu compra!`);
            
            // 8. Vaciar carrito
            await fetch('http://localhost:8081/api/carrito/vaciar/todo', {
                method: 'DELETE'
            });
            
            // 9. Recargar página para mostrar carrito vacío
            window.location.reload();
            
        } else {
            alert('Error al finalizar la compra: ' + resultado.mensaje);
            btn.disabled = false;
            btn.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Finalizar Compra
            `;
        }
        
    } catch (error) {
        console.error('❌ Error al finalizar compra:', error);
        alert('Error de conexión con el servidor. Intenta nuevamente.');
        
        const btn = document.getElementById('finalizar-compra-btn');
        btn.disabled = false;
        btn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Finalizar Compra
        `;
    }
}