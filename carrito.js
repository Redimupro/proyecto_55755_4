
let productos = [];
let carrito = [];
///Descomentar para ejecutar esto una vez y que se cargue al localStorage los productos

productos.push(new Producto('casa convencional',300000));
productos.push(new Producto('piscinas',100000));
productos.push(new Producto('construccion en seco',78099));
productos.push(new Producto('domotica',85000));
productos.push(new Producto('casa convencional 2',90000));

localStorage.setItem('productos', JSON.stringify(productos));

///obtengo los elementos necesarios del DOM
const selectProductos = document.querySelector('#productos');
const btnAgregar = document.querySelector('#agregar');

////traer los productos del localStorage
function traerItemsStorage() {
    productos = JSON.parse(localStorage.getItem('productos')) || [];
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    borrar = JSON.parse(localStorage.getItem('borrar')) || [];
}

function popularDropdown() {
    productos.forEach(({nombre,precio}, index) => { 
        ////aca voy a dibujar las opciones dentro del body del select
        const option = document.createElement('option');
        option.textContent = `${nombre} - $${precio}`;
        option.value = index; ///con esto nos guiamos para saber que objeto del array SELECCIONA
        selectProductos.appendChild(option);
    });
}


///DOMContentLoaded es un evento que se triggerea (dispara) cuando se carga el documento completamente
document.addEventListener('DOMContentLoaded', () => {
    traerItemsStorage();
    popularDropdown();
    dibujarTabla();


    ///event listener de agregar un producto al carrito
    btnAgregar.addEventListener('submit', (e) => {
        e.preventDefault();
        const productoSeleccionado = productos.find((item,index) => index === +selectProductos.value);
        //const productoSeleccionado = productos[+selectProductos.value];
        if (productoSeleccionado === undefined) {
            alert('Usted primero debe seleccionar un producto');
            return; ///hago finalizar la funcion
        }
        ///busco el indice del item en el carrito
        const indiceCarrito = carrito.findIndex((item) => item.producto.nombre === productoSeleccionado.nombre);

        if (indiceCarrito !== -1) { ///encontro el item
            carrito[indiceCarrito].cantidad++;
        }else {
            const item = new Item(productoSeleccionado,1);
            ///lo agrego al carrito
            carrito.push(item);
        }

        localStorage.setItem('carrito',JSON.stringify(carrito)); ///guardo el carrito actualizado en el localStorage
        dibujarTabla();
    })

})



function dibujarTabla() {
    const bodyTabla = document.getElementById('items');
    const total = document.querySelector('#total');
    bodyTabla.innerHTML = ``;
    carrito.forEach((item, index) => {
        const { producto: { nombre: nombrecin, precio }, cantidad } = item;
        bodyTabla.innerHTML += `
        <tr class="text-white">
            <td>${nombrecin || ''}</td>
            <td>$${precio || ''}</td>
            <td>${cantidad || ''}</td>
            <td>${cantidad * precio || 0}</td>
            <td><button onclick="eliminarProducto(${index})">Eliminar</button></td>
        </tr>
        `;
    });
    
    total.textContent = carrito.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
}
    
function eliminarProducto(index) {
    carrito.splice(index, 1); //Elimina el producto del carrito en la posición 'index'
    localStorage.setItem('carrito', JSON.stringify(carrito)); //Actualiza el carrito en el localStorage
    dibujarTabla(); // Vuelve a dibujar la tabla sin el producto eliminado
}