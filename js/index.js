const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const cart = document.getElementById('cart')
const logoI = document.getElementById('logo')
const login = document.getElementById('login')

const userDataString = localStorage.getItem('userData');
const userName = localStorage.getItem('userName');
const nm = localStorage.getItem('nm')
const userMenu = document.getElementById('user-menu')
const menuIconWrapper = document.getElementById('menu-icon-wrapper')
const usuarioOpciones = document.getElementById('usuario-opciones')
const logout = document.getElementById('logout')
const misPedidos = document.getElementById('mis-pedidos')
const misDatos = document.getElementById('mis-datos')

const svgCart = document.querySelector('.icon--cart')
const carritoInfo = document.querySelector('#carrito-info')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const cartCountElement = document.getElementById('cart-count')
const fragment = document.createDocumentFragment()

var searchForm = document.getElementById('searchForm')
var searchInput = document.getElementById('searchInput')

let carrito = {}
let rutaProductosRecomendados = 'http://victor-api.sa-east-1.elasticbeanstalk.com/producto/listar/recomendados';

document.addEventListener('DOMContentLoaded', () => {
    fetchData(rutaProductosRecomendados)
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
cards.addEventListener('click', e => {
    addCarrito(e)
})
logoI.addEventListener('click', () => {
    window.location.href = "index.html"
})
login.addEventListener('click', () => {
    window.location.href = "login.html"  
})
cart.addEventListener('click', (event) => {
    event.stopPropagation
    mostrarProductosCarrito()
})
logout.addEventListener('click', () => {
    localStorage.removeItem('userData')
    localStorage.removeItem('ps')
    window.location.href = 'index.html'
})
misPedidos.addEventListener('click', () => {
    window.location.href = 'misPedidos.html'
})
misDatos.addEventListener('click', () => {
    window.location.href = 'usuario.html'
})

fetch('http://victor-api.sa-east-1.elasticbeanstalk.com/categoria/listar/activos')
.then(response => response.json())
.then(data => {
    const categorias = document.querySelector('#categorias');
    data.forEach(categoria => {
        const li = document.createElement('li');
        li.textContent = categoria.nombre;
        li.setAttribute('data-id', categoria.id_categoria);
        categorias.appendChild(li);
        li.addEventListener('click', () => {
            const idCategoria = li.getAttribute('data-id')
            fetchData(`http://victor-api.sa-east-1.elasticbeanstalk.com/producto/listar/categoria/${idCategoria}`)
        })
    });
})
.catch(error => console.error(error));

const fetchData = async (ruta) => {
    try {
        const res = await fetch(ruta)
        const data = await res.json()
        cards.innerHTML = ''
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}
const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.nombre
        templateCard.querySelector('p').textContent = formatCurrency(producto.precio)   
        const imgElement = templateCard.querySelector('img');
        imgElement.onerror = function() {
            this.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png");
        }

        if (producto.imagen && isUrlValid(producto.imagen)) {
            imgElement.setAttribute("src", producto.imagen);
        } else {
            imgElement.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png");
        }
        templateCard.querySelector('.btn-dark').dataset.id = producto.id_producto

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}
const isUrlValid = url => {
    return url.startsWith("http://") || url.startsWith("https://");
}
const addCarrito = e => {
    if(e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
        notificacionConfirmacion()
        if(carritoInfo.style.display == 'block') {
            mostrarProductosCarrito()
        }
    }
    e.stopPropagation()
}
const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: parseFloat(objeto.querySelector('p').textContent.replace(/[^\d.-]+/g, '')),
        cantidad: 1,
    }
    
    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito()
}
const pintarCarrito = () => {
    items.innerHTML = ''
    let cartCount = 0;
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)

        cartCount += 1;
    })
    items.appendChild(fragment)
    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))

    if(Object.keys(carrito).length === 0) {
        cartCount = 0;
    }

    cartCountElement.textContent = cartCount
} 
const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - Comience a comprar!</th>
        `
        return 
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad*precio,0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)    

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

}
const btnAccion = e => {
    //Accion de aumentar
    if(e.target.classList.contains('btn-info')) {
        carrito[e.target.dataset.id]    
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')) {
        carrito[e.target.dataset.id]    
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
            notificacionConfirmacion()
        }
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-trash')) {
        const producto = carrito[e.target.dataset.id];
        delete carrito[producto.id];
        pintarCarrito();
        notificacionConfirmacion2()
    }

    e.stopPropagation()
}

if (userDataString) {
    login.style.display = 'none'
    userMenu.style.display = 'block'
  
    const welcomeMessage = userMenu.querySelector('.welcome-message')
    welcomeMessage.textContent = `Bienvenido, ` + nm

    menuIconWrapper.addEventListener('click', () => {
        usuarioOpciones.style.display = 'block'
    })

    document.addEventListener('click', (event) => {
        if (!usuarioOpciones.contains(event.target) && !menuIconWrapper.contains(event.target)) {
          usuarioOpciones.style.display = 'none';
        }
    })
  } else {
    login.style.display = 'block';
    userMenu.style.display = 'none';
  }

function mostrarProductosCarrito() {
    const carritoItems = JSON.parse(localStorage.getItem('carrito')) || {};
    const productoIds = Object.keys(carritoItems);

    Promise.all(
        productoIds.map(id => fetch(`http://victor-api.sa-east-1.elasticbeanstalk.com/producto/id/${id}`).then(resp => resp.json()))
    ).then(productos => {
        const productosHTML = productos.map((producto, index) => {
            const carritoItem = carritoItems[productoIds[index]];
            const subtotal = producto.precio * carritoItem.cantidad;
            
            return `
            <li class="producto-item">
                <div class="producto-imagen-container">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
                </div>
                <div class="producto-info-container">
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    <p class="producto-precio">S/. ${subtotal.toFixed(2)}</p>
                    <p class="producto-cantidad">Cantidad: ${carritoItem.cantidad}</p>
                    <button class="btn btn-info btn-sm" data-id="${producto.id_producto}">+</button>
                    <button class="btn btn-danger btn-sm" data-id="${producto.id_producto}">-</button>
                    <span class="vertical-line"></span>
                    <button class="btn btn-trash btn-sm btn-secondary" data-id="${producto.id_producto}">Quitar</button>
                </div>
            </li>   
          `;
        }).join('');

        const total = productos.reduce((acumulador, producto, index) => {
            const carritoItem = carritoItems[productoIds[index]];
            return acumulador + (producto.precio * carritoItem.cantidad);
        }, 0);

        carritoInfo.innerHTML = `
        <div class="carrito-productos">
            <ul class="productos-lista" style="max-height: 750px; overflow-y: scroll;">
                ${productosHTML || '<li class="mensaje-vacio">No hay productos en el carrito</li>'}
            </ul>
        </div>
        <div class="carrito-total">
            <p>Total: S/. ${total.toFixed(2)}</p>
            <button class="ver-carrito-btn">Ver carrito</button>
        </div>
        `;

        carritoInfo.style.display = 'block'

        document.addEventListener('click', (event) => {
            const isClickInside = carritoInfo.contains(event.target) || svgCart.contains(event.target);
            if (!isClickInside) {
              carritoInfo.style.display = 'none';
              carritoAbierto = false;
            }
        })   

        const verCarrito = document.querySelector('.ver-carrito-btn')
        verCarrito.addEventListener('click', () => {
            window.location.href = "carrito.html"
        })
        const botonSuma = document.querySelectorAll('.btn-info')
        const botonResta = document.querySelectorAll('.btn-danger')
        const botonQuitar = document.querySelectorAll('.btn-trash')
        botonSuma.forEach(boton => {
            boton.addEventListener('click', e => {
                btnAccion(e)
                mostrarProductosCarrito()
            })
        });
        botonResta.forEach(boton => {
            boton.addEventListener('click', e => {
                btnAccion(e)
                mostrarProductosCarrito()
            })
        })
        botonQuitar.forEach(boton => {
            boton.addEventListener('click', e => {
                btnAccion(e)
                mostrarProductosCarrito()
            })
        })
    })
}
function notificacionConfirmacion() {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Producto agregado al carrito',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: '#f0fff0',
        iconColor: '#50C878',
        customClass: {
          popup: 'animated slideInRight'
        }
      });
}
function notificacionConfirmacion2() {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Producto eliminado del carrito',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: '#f0fff0',
        iconColor: '#50C878',
        customClass: {
          popup: 'animated slideInRight'
        }
      })
}
function notificacionEliminacion() {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Producto eliminado del carrito',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: '#f0fff0',
        iconColor: '#50C878',
        customClass: {
          popup: 'animated slideInRight'
        }
      });
}
function search() {
    var searchTerm = document.querySelector('.search-form input').value.trim()
    if (searchTerm !== '') {
        var url = 'http://victor-api.sa-east-1.elasticbeanstalk.com/producto/buscar/' + encodeURIComponent(searchTerm);
    
        fetch(url)
          .then(response => response.json())
          .then(data => {
            cards.innerHTML = ''
            pintarCards(data)
            })
          .catch(error => console.error(error))
      }
    
      return false
}
function formatCurrency(amount) {
    const formatter = new Intl.NumberFormat('es-PE', { style:'currency', currency:'PEN' })
    return formatter.format(amount)
}

var searchButton = document.querySelector('.search-form #buscar')
searchButton.addEventListener('click', function(event) {
  event.preventDefault(); 
  search(); 
})
var searchInput = document.getElementById('searchInput')
searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      search();
    }
  })
window.addEventListener('storage', () => {
    if(carritoInfo.style.display == 'block') {
        mostrarProductosCarrito()
    }
})


