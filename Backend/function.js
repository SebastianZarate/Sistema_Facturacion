document.addEventListener('DOMContentLoaded', function() {
    // Manejo de pestañas
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
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

    // Manejo de formularios
    const facturaForm = document.getElementById('facturaForm');
    if (facturaForm) {
        facturaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Factura creada con éxito!');
        });
    }

    const productoForm = document.getElementById('productoForm');
    if (productoForm) {
        productoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Producto agregado con éxito!');
        });
    }
});