async function cargarproducto(){
    try{
        const response = await fetch('https://tiendaecommer.onrender.com/api/productos');
        const productos = await response.json();
        const grid = document.getElementById('products-grid');
        
        grid.innerHTML = productos.map(producto => `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden 
            hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 
            product-card" data-category="laptops" data-price="${producto.Precio}" 
            data-product-id="${producto._id}">

                <div class="relative bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center
                justify-center overflow-hidden">
                    <img src="${producto.Image}" alt="${producto.Nombre}" class="w-full h-full 
                    object-cover hover:scale-105 transition-transform duration-300" loading="lazy">
                    
                    <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full 
                    text-xs font-bold">
                        15%
                    </div>
                </div>

                <div class="p-6">
                    <h3 class="text-lg font-bold mb-2 text-gray-800">
                        ${producto.Nombre}
                    </h3>
                    <p class="text-sm text-gray-600 mb-4">
                        ${producto.Descripcion}
                    </p>
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <span class="text-2xl font-bold text-blue-600">
                                $${(producto.Precio || 0).toLocaleString('es-CO')}
                            </span>
                        </div>

                        <div class="flex text-yellow-400">
                            ⭐⭐⭐⭐⭐
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button class="ver-detalles-btn bg-green-600 text-white px-3 py-2 rounded-lg 
                        hover:bg-green-700 transition duration-300 flex-1 text-sm">
                            Ver Detalles
                        </button>
                        <button 
                            onclick="agregarAlCarrito('${producto._id}', '${producto.Nombre.replace(/'/g, "\\'")}', ${producto.Precio}, '${producto.Image}')"
                            class="add-to-cart-btn bg-blue-600 text-white px-3 py-2 rounded-lg 
                            hover:bg-blue-700 transition duration-300 flex-1 text-sm">
                            Comprar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        console.log("✅ Productos cargados con éxito");

    } catch (error){
        console.error("❌ Error al cargar los productos", error);
    }
}

async function agregarAlCarrito(productoId, nombre, precio, imagen) {
    try {
        
        const btn = event.target;
        const textoOriginal = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `
            <svg class="animate-spin h-5 w-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
        `;
        
        // Preparar datos para el backend
        const data = {
            productoId: productoId,
            nombre: nombre,
            precio: precio,
            cantidad: 1,
            imagen: imagen,
            metodoPago: 'tarjeta',
            direccionEnvio: {
                calle: '',
                ciudad: 'Bogotá',
                codigoPostal: '110111',
                pais: 'Colombia'
            }
        };
        
        console.log('📦 Enviando al carrito:', data);
        
        // Enviar al backend
        const response = await fetch('https://tiendaecommer.onrender.com/api/carrito', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            // Éxito
            console.log('✅ Producto agregado:', resultado);
            
            // Cambiar botón temporalmente
            btn.innerHTML = `
                <svg class="h-5 w-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
            `;
            btn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            btn.classList.add('bg-green-600');
            
            // Mostrar notificación
            mostrarNotificacion('✅ Producto agregado al carrito', 'success');
            
            // Actualizar contador del carrito
            actualizarContadorCarrito();
            
            // Restaurar botón después de 2 segundos
            setTimeout(() => {
                btn.innerHTML = textoOriginal;
                btn.classList.remove('bg-green-600');
                btn.classList.add('bg-blue-600', 'hover:bg-blue-700');
                btn.disabled = false;
            }, 2000);
            
        } else {
            // Error del servidor
            console.error('❌ Error del servidor:', resultado);
            btn.innerHTML = textoOriginal;
            btn.disabled = false;
            mostrarNotificacion('❌ ' + resultado.mensaje, 'error');
        }
        
    } catch (error) {
        console.error('❌ Error al agregar al carrito:', error);
        event.target.innerHTML = 'Comprar';
        event.target.disabled = false;
        mostrarNotificacion('❌ Error de conexión. Intenta nuevamente.', 'error');
    }
}

async function actualizarContadorCarrito() {
    try {
        const response = await fetch('https://tiendaecommer.onrender.com/api/carrito');
        const productos = await response.json();
        
        const contador = document.getElementById('cart-counter');
        if (contador) {
            if (productos.length > 0) {
                contador.textContent = productos.length;
                contador.style.display = 'flex';
                
                // Animación de pulso
                contador.classList.add('cart-counter-pulse');
                setTimeout(() => {
                    contador.classList.remove('cart-counter-pulse');
                }, 500);
            } else {
                contador.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error al actualizar contador:', error);
    }
}

function mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-300 translate-x-full ${
        tipo === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white font-medium flex items-center gap-3`;
    
    notificacion.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${tipo === 'success' 
                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>'
                : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
            }
        </svg>
        <span>${mensaje}</span>
    `;
    
    document.body.appendChild(notificacion);
    
    // Animar entrada
    setTimeout(() => {
        notificacion.classList.remove('translate-x-full');
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.classList.add('translate-x-full');
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 3000);
}

cargarproducto();

actualizarContadorCarrito();

setInterval(() => {
    cargarproducto();
}, 5000); // 5 segundos