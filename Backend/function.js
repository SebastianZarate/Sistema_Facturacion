document.addEventListener('DOMContentLoaded', function () {
    // Manejo de pestañas
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            openTab(this.dataset.tab);
        });
    });

    function openTab(tabName) {
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    // Array para almacenar las facturas
    let facturas = [];

    // Manejo de formularios
    const facturaForm = document.getElementById('facturaForm');
    if (facturaForm) {
        facturaForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Obtener los valores del formulario
            const cliente = document.getElementById('cliente').value;
            const vendedor = document.getElementById('vendedor').value;
            const tipoPago = document.getElementById('tipoPago').value;
            const productoId = document.getElementById('producto').value;
            const cantidad = document.getElementById('cantidad').value;
            const total = calculateTotal(productoId, cantidad);

            // Crear un objeto de factura
            const factura = {
                id: facturas.length + 1,
                fecha: new Date().toISOString().split('T')[0],
                cliente: cliente,
                vendedor: vendedor,
                tipoPago: tipoPago,
                producto: productoId,
                cantidad: cantidad,
                total: total
            };

            // Agregar la factura al array
            facturas.push(factura);

            // Actualizar la lista de facturas
            updateFacturasList();

            // Limpiar el formulario
            facturaForm.reset();

            alert('Factura creada con éxito!');
        });
    }

    function calculateTotal(productoId, cantidad) {
        // Verificar si hay suficiente cantidad en stock
        if (productosEnStock[productoId] >= cantidad) {
            // Actualizar la cantidad en stock
            productosEnStock[productoId] -= cantidad;
            // Obtener el precio del producto
            const producto = productos.find(p => p.id == productoId);
            return cantidad * producto.precio;
        } else {
            alert(`Lo siento, solo hay ${productosEnStock[productoId]} unidades disponibles del producto.`);
            return 0;
        }
    }

    let productosEnStock = {
        "1": 100,
        "2": 50,
        "3": 75
    };

    function updateFacturasList() {
    const listaFacturas = document.querySelector('#listaFacturas tbody');
    listaFacturas.innerHTML = ''; // Limpiar la lista actual

    facturas.forEach(factura => {
        const producto = productos.find(p => p.id == factura.producto);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${factura.id}</td>
            <td>${factura.fecha}</td>
            <td>${factura.cliente}</td>
            <td>${producto.nombre}</td>
            <td>$${factura.total.toFixed(2)}</td>
            <td><button onclick="verDetallesFactura(${factura.id})">Ver Detalles</button></td>
        `;
        listaFacturas.appendChild(row);
    });
}

    // Función para ver detalles de la factura (a implementar)
    function verDetallesFactura(id) {
        const factura = facturas.find(f => f.id === id);
        if (factura) {
            const producto = productos.find(p => p.id == factura.producto);
            const detallesFactura = document.getElementById('facturaDetalles');
            detallesFactura.innerHTML = `
                <p>ID Factura: ${factura.id}</p>
                <p>Fecha: ${factura.fecha}</p>
                <p>Cliente: ${factura.cliente}</p>
                <p>Vendedor: ${factura.vendedor}</p>
                <p>Tipo de Pago: ${factura.tipoPago}</p>
                <p>Producto: ${producto.nombre}</p>
                <p>Cantidad: ${factura.cantidad}</p>
                <p>Precio Unitario: $${producto.precio.toFixed(2)}</p>
                <p>Total: $${factura.total.toFixed(2)}</p>
            `;

            openTab('detallesFactura');
        } else {
            alert('No se encontró la factura.');
        }
    }
    window.verDetallesFactura = verDetallesFactura;

    const productoForm = document.getElementById('productoForm');
    if (productoForm) {
        productoForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Obtener los valores del formulario
            const nombreProducto = document.getElementById('nombreProducto').value;
            const unidadMedida = document.getElementById('unidadMedida').value;
            const precioProducto = parseFloat(document.getElementById('precioProducto').value);
            const cantidadProducto = parseInt(document.getElementById('cantidadProducto').value);

            // Determinar si se está creando un nuevo producto o editando uno existente
            const modo = productoForm.dataset.modo || 'crear';
            const productoId = productoForm.dataset.productoId || null;

            if (modo === 'crear') {
                // Crear un objeto de producto
                const producto = {
                    id: productos.length + 1,
                    nombre: nombreProducto,
                    unidadMedida: unidadMedida,
                    precio: precioProducto,
                    cantidad: cantidadProducto
                };

                // Agregar el producto al array de productos
                productos.push(producto);
                productosEnStock[producto.id] = cantidadProducto;
                updateProductosList();
            } else if (modo === 'editar') {
                // Encontrar el producto a editar
                const producto = productos.find(p => p.id === parseInt(productoId));
                if (producto) {
                    producto.nombre = nombreProducto;
                    producto.unidadMedida = unidadMedida;
                    producto.precio = precioProducto;
                    producto.cantidad = cantidadProducto;
                    productosEnStock[producto.id] = cantidadProducto;
                    updateProductosList();
                }
            }

            // Actualizar la lista de productos
            updateProductosList();

            // Limpiar el formulario y restablecer el modo a "crear"
            productoForm.reset();
            productoForm.dataset.modo = 'crear';
            productoForm.dataset.productoId = null;

            alert('Producto guardado con éxito!');
        });
    }

    let productos = [];

    function updateProductosList() {
        const listaProductos = document.querySelector('#gestionProductos tbody');
        listaProductos.innerHTML = ''; // Limpiar la lista actual
    
        const productoSelect = document.getElementById('producto');
        productoSelect.innerHTML = '<option value="">Seleccione un producto</option>'; // Agregar opción de selección
    
        for (const producto of productos) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.unidadMedida}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>${productosEnStock[producto.id]}</td>
                <td>
                    <button onclick="editarProducto(${producto.id})">Editar</button>
                    <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </td>
            `;
            listaProductos.appendChild(row);
    
            // Agregar la opción del producto al desplegable
            const option = document.createElement('option');
            option.value = producto.id;
            option.text = `Producto ${producto.id} - ${producto.nombre} (${productosEnStock[producto.id]} unidades)`;
            productoSelect.add(option);
        }
    }

    function editarProducto(id) {
        const producto = productos.find(p => p.id === id);
        if (producto) {
            // Mostrar los detalles del producto en la ventana modal
            const modal = document.getElementById("modalProducto");
            const nombreModal = document.getElementById("nombreProductoModal");
            const unidadModal = document.getElementById("unidadMedidaModal");
            const precioModal = document.getElementById("precioProductoModal");
            const cantidadModal = document.getElementById("cantidadProductoModal");
    
            nombreModal.value = producto.nombre;
            unidadModal.value = producto.unidadMedida;
            precioModal.value = producto.precio;
            cantidadModal.value = productosEnStock[producto.id];
    
            // Agregar un atributo de "modo" al formulario de edición para indicar que se está editando
            productoEditarForm.dataset.productoId = producto.id;
    
            modal.style.display = "block";
        }
    }
    window.editarProducto = editarProducto;

    const modal = document.getElementById("modalProducto");
    const closeButton = document.getElementsByClassName("close-button")[0];

    // Cerrar la ventana modal cuando se hace clic en la "X" o fuera del modal
    closeButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    const productoEditarForm = document.getElementById("productoEditarForm");
    productoEditarForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Obtener los valores del formulario de edición
        const nombreProducto = document.getElementById("nombreProductoModal").value;
        const unidadMedida = document.getElementById("unidadMedidaModal").value;
        const precioProducto = parseFloat(document.getElementById("precioProductoModal").value);
        const cantidadProducto = parseInt(document.getElementById("cantidadProductoModal").value);
        const productoId = productoEditarForm.dataset.productoId;

        // Encontrar el producto a editar
        const producto = productos.find(p => p.id === parseInt(productoId));
        if (producto) {
            producto.nombre = nombreProducto;
            producto.unidadMedida = unidadMedida;
            producto.precio = precioProducto;
            producto.cantidad = cantidadProducto;

            // Actualizar la lista de productos
            updateProductosList();

            // Cerrar la ventana modal
            modal.style.display = "none";

            alert("Producto actualizado con éxito!");
        }
    });

    function eliminarProducto(id) {
        const index = productos.findIndex(p => p.id === id);
        if (index !== -1) {
            productos.splice(index, 1);
            updateProductosList();
            alert('Producto eliminado con éxito!');
        }
    }
    window.eliminarProducto = eliminarProducto;
});