const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const cart = document.getElementById('cart')
const logo = document.getElementById('logo')
const loginC = document.getElementById('login')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const cartCountElement = document.getElementById('cart-count')
const fragment = document.createDocumentFragment()

const userData = localStorage.getItem('userData')
const ps = localStorage.getItem('ps')
const nm = localStorage.getItem('nm')

const userMenu = document.getElementById('user-menu')
const menuIconWrapper = document.getElementById('menu-icon-wrapper')
const usuarioOpciones = document.getElementById('usuario-opciones')
const misPedidosC = document.getElementById('mis-pedidos')
const logoutC = document.getElementById('logout')
const misDatosC = document.getElementById('mis-datos')
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
cards.addEventListener('click', e => {
    addCarrito(e)
})
items.addEventListener('click', e => {
    btnAccion(e)
})
loginC.addEventListener('click', () => {
    window.location.href = "login.html"  
})
misPedidosC.addEventListener('click', () => {
    window.location.href = 'misPedidos.html'
})
logoutC.addEventListener('click', () => {
    localStorage.removeItem('userData')
    localStorage.removeItem('ps')
    localStorage.removeItem('nm')
    window.location.href = 'index.html'
})
misDatosC.addEventListener('click', () => {
    window.location.href = "usuario.html"
})

const fetchData = async () => {
    try {
        const res = await fetch('http://victor-api.sa-east-1.elasticbeanstalk.com/producto/listar/recomendados')
        const data = await res.json()
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}
const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.nombre
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.imagen)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id_producto

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}
const addCarrito = e => {
    if(e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}
const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito()
}
const obtenerRutaImagen = (productoId) => {
    const url = `http://victor-api.sa-east-1.elasticbeanstalk.com/producto/id/${productoId}`
    return fetch(url)
    .then(response => response.json())
    .then(data => {
      const rutaImagen = data.imagen;
      return rutaImagen;
    })
    .catch(error => {
      console.error('Error al obtener la ruta de la imagen del producto:', error)
    })
}
const pintarCarrito = async () => {
    const productos = Object.values(carrito)
    items.innerHTML = '';
    let cartCount = 0;

    try {
      const promesasImagenes = productos.map(producto => obtenerRutaImagen(producto.id));
      const rutasImagenes = await Promise.all(promesasImagenes);
  
      productos.forEach((producto, index) => {
        const clone = templateCarrito.cloneNode(true);
  
        //clone.querySelector('th').textContent = producto.id;
        clone.querySelector('.title-cell').textContent = producto.title;
        clone.querySelector('.quantity-cell').textContent = producto.cantidad;
        clone.querySelector('.btn-info').dataset.id = producto.id;
        clone.querySelector('.btn-danger').dataset.id = producto.id;
        clone.querySelector('.btn-trash').dataset.id = producto.id;
        clone.querySelector('span').textContent = formatCurrency(producto.cantidad * producto.precio);
  
        const rutaImagen = rutasImagenes[index];
        clone.querySelector('.image-cell img').setAttribute('src', rutaImagen);
  
        fragment.appendChild(clone);
  
        cartCount += 1;
      })
      items.appendChild(fragment)
      pintarFooter()
    } catch (error) {
      console.error('Error al obtener las rutas de imagen de los productos:', error)
    }
  
    localStorage.setItem('carrito', JSON.stringify(carrito));
  
    if (Object.keys(carrito).length === 0) {
      cartCount = 0;
    }
  
    cartCountElement.textContent = cartCount;
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
    templateFooter.querySelector('span').textContent = formatCurrency(nPrecio)

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)    

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
        notificacionConfirmacion2()
    })
    const btnPedido = document.getElementById('realizar-pedido')
    btnPedido.addEventListener('click', () => {
        const carritoString = localStorage.getItem('carrito')
        const userDataString = localStorage.getItem('userData')
        if(carritoString) {
            const carrito = JSON.parse(carritoString)
            const userData = JSON.parse(userDataString)
            
            if(userData) {
                Swal.fire({
                    title: 'Confirmar Pedido',
                    html: '<h3>¿Desea continuar con el pedido?</h3><p>Asegúrese de verificar todos los detalles antes de confirmar el pedido. Ya que no hay vuelta atrás una vez realizado el pedido</p>',
                    icon: 'info',   
                    showCancelButton: true,
                    confirmButtonText: 'Continuar',
                    cancelButtonText: 'Cancelar',
                }).then((result) => {
                    if(result.isConfirmed) {
                        buscarUsuario(userData)
                        .then(username => {
                            const c = desencriptar(ps)
                            const auth = new Headers()
                            auth.append('Authorization','Basic ' + btoa(username + ":" + c))
                            
                            const detalles = Object.values(carrito).map(item => ({
                                producto: {
                                    id_producto: item.id,
                                },
                                precio: item.precio,
                                cantidad: item.cantidad,
                            }))
                            const data = {
                                usuario: {
                                    id_usuario: userData
                                },
                                detalles: detalles
                            }
                            fetch('http://victor-api.sa-east-1.elasticbeanstalk.com/pedido/registrar', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': auth.get('Authorization')
                                },
                                body: JSON.stringify(data),
                            })
                            .then(response => response.json())
                            .then(data => {
                                console.log('Pedido registrado:', data);
                                btnVaciar.click();
                                notificacionConfirmacion3()
                            })
                            .catch(error => {
                                console.error('Error al realizar el pedido:', error)
                            })
                        })
                    }
                })
                
            } else {
                notificacionDenegacion()
            }
        } else {
            console.log('El carrito está vacío')
        }
    })
    cartCount = nCantidad;
}
const mostrarCarga = () => {
    const loader = document.querySelector('.loader')
    loader.style.display = 'block'
}
const ocultarCarga = () => {
    const loader = document.querySelector('.loader')
    loader.style.display = 'none'
} 
const btnAccion = e => {
    //Accion de aumentar
    if(e.target.classList.contains('btn-info')) {
        mostrarCarga()
        carrito[e.target.dataset.id]    
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        setTimeout(() => {
            ocultarCarga()
            pintarCarrito() // Ocultar la barra de carga después de 1 segundo
          }, 500)
    }

    if(e.target.classList.contains('btn-danger')) {
        mostrarCarga()
        carrito[e.target.dataset.id]    
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
            notificacionConfirmacion()
        }
        setTimeout(() => {
            ocultarCarga()
            pintarCarrito() // Ocultar la barra de carga después de 1 segundo
          }, 500)
    }

    if(e.target.classList.contains('btn-trash')) {
        mostrarCarga()
        const producto = carrito[e.target.dataset.id];
        delete carrito[producto.id];
        setTimeout(() => {
            ocultarCarga()
            pintarCarrito()
            notificacionConfirmacion() // Ocultar la barra de carga después de 1 segundo
          }, 500)
    }

    e.stopPropagation()
}
logo.addEventListener('click', () => {
    window.location.href = "index.html"
})

function notificacionConfirmacion() {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Producto eliminado al carrito',
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
        title: 'Productos eliminados del carrito',
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
function notificacionConfirmacion3() {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Pedido Realizado',
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
function notificacionDenegacion() {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Debe iniciar sesión para realizar el pedido',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: '#f8d7da',
        iconColor: '#721c24',
        customClass: {
          popup: 'animated slideInRight'
        }
      });
}
function desencriptar(password) {
    let passwordDesencript = ""
    for(let i = 0; i < password.length; i++) {
      const caracter = password[i]
      const valorAsci = caracter.charCodeAt(0)
      const nuevoValorAsci = valorAsci - 30
      const nuevoCaracter = String.fromCharCode(nuevoValorAsci)
      passwordDesencript += nuevoCaracter
    }
    return passwordDesencript
}
function buscarUsuario(userId) {
    return fetch(`http://victor-api.sa-east-1.elasticbeanstalk.com/usuario/id/${userId}`)
    .then(response => response.json())
    .then(user => {
      if(user && user.username) {
        return user.username
      } else {
        throw new Error('No se encontró el nombre de usuario')
      }
    })
    .catch(error => {
      console.error('Error al obtener los datos del usuario: ', error)
      throw error
    })
}
function formatCurrency(amount) {
    const formatter = new Intl.NumberFormat('es-PE', { style:'currency', currency:'PEN' })
    return formatter.format(amount)
}

if (userData) {
    loginC.style.display = 'none'
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
    loginC.style.display = 'block';
    userMenu.style.display = 'none';
  }













