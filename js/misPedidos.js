const pedidosContainer = document.getElementById('pedidosContainer')
const userDataP = localStorage.getItem('userData')
const ps = localStorage.getItem('ps')
const userMenu = document.getElementById('user-menu')
const menuIconWrapper = document.getElementById('menu-icon-wrapper')
const usuarioOpciones = document.getElementById('usuario-opciones')
const logoP = document.getElementById('logo')
const catalogo = document.getElementById('mis-pedidos')
const logoutP = document.getElementById('logout')
const misDatosP = document.getElementById('mis-datos')
let total = 0

logoP.addEventListener('click', () => {
  window.location.href = "index.html"
})
catalogo.addEventListener('click', () => {
  window.location.href = 'index.html'
})
logoutP.addEventListener('click', () => {
  localStorage.removeItem('userData')
  localStorage.removeItem('userName')
  window.location.href = 'index.html'
})
misDatosP.addEventListener('click', () => {
  window.location.href = "usuario.html"
})

buscarUsuario(userDataP)
  .then(username => {
    const c = desencriptar(ps)
    contadorPedidos()
      .then(totalPedidos => {
        const headers = new Headers()
        headers.append('Authorization', 'Basic ' + btoa(username + ':' + c))
        fetch(`https://negocio-victor.rj.r.appspot.com/pedido/listar/usuario/custom/${userDataP}`, {
          method: 'GET',
          headers: headers
        })
          .then(response => {
            if(response.status === 401) {
              throw new Error('Error de autorizacion: No autorizado')
            }
            return response.json() 
          })
          .then(data => {
            data.forEach((pedido, index) => {
              const pedidoItem = document.createElement('div')
              pedidoItem.classList.add('pedido-item')

              const pedidoNumero = document.createElement('h2')
              pedidoNumero.textContent = `Pedido #${totalPedidos - index}`
              pedidoItem.appendChild(pedidoNumero)

              const fechaPedido = document.createElement('h5')
              fechaPedido.classList.add('fecha-pedido')
              fechaPedido.textContent = `Fecha: ${pedido.fechaPedido}`
              pedidoItem.appendChild(fechaPedido)

              const productoContainer = document.createElement('div')
              productoContainer.classList.add('productos')
              pedidoItem.appendChild(productoContainer)

              const tablaProductos = document.createElement('table')
              const thead = document.createElement('thead') 
              const tbody = document.createElement('tbody')
              tablaProductos.appendChild(thead)
              tablaProductos.appendChild(tbody)
              productoContainer.appendChild(tablaProductos)

              const encabezadosRow = document.createElement('tr')

              const encabezadoProducto = document.createElement('th')
              encabezadoProducto.textContent = 'PRODUCTO'
              encabezadosRow.appendChild(encabezadoProducto)

              const encabezadoCantidad = document.createElement('th')
              encabezadoCantidad.textContent = 'CANTIDAD'
              encabezadosRow.appendChild(encabezadoCantidad)

              const encabezadoPrecio = document.createElement('th')
              encabezadoPrecio.textContent = 'PRECIO UNIT.'
              encabezadosRow.appendChild(encabezadoPrecio)

              const encabezadoSubTotal = document.createElement('th')
              encabezadoSubTotal.textContent = 'TOTAL'
              encabezadosRow.appendChild(encabezadoSubTotal)

              thead.appendChild(encabezadosRow)

              const totalPedido = document.createElement('p')
              totalPedido.classList.add('pedido-total')
              pedidoItem.appendChild(totalPedido)

              const estadoPedido = document.createElement('p')
              let estadoTexto = '';

              if (pedido.estado === 0) {
                estadoTexto = 'Estado: Por entregar'
                estadoPedido.classList.add('text-danger')
                pedidoItem.classList.add('noentregado-container')
              } else if (pedido.estado === 1){
                estadoTexto = 'Estado: Recibido y preparando pedido'
                estadoPedido.classList.add('recibido')
                pedidoItem.classList.add('recibido-container')
              } else if(pedido.estado === 2) {
                estadoTexto = 'Estado: Entregado'
                estadoPedido.classList.add('entregado')
                pedidoItem.classList.add('entregado-container')
              }
              estadoPedido.textContent = estadoTexto
              pedidoItem.appendChild(estadoPedido)

              pedidosContainer.appendChild(pedidoItem)

              const detalles = pedido.detalles
              detalles.forEach(detalle => {
                  const filaProducto = document.createElement('tr')
                  const nombreProducto = document.createElement('td')
                  const cantidadProducto = document.createElement('td')
                  const precioProducto = document.createElement('td')
                  const subtotalProducto = document.createElement('td')

                  cantidadProducto.classList.add('centrado')
                  precioProducto.classList.add('derecha')
                  subtotalProducto.classList.add('derecha')

                  nombreProducto.textContent = detalle.producto.nombre
                  cantidadProducto.textContent = detalle.cantidad
                  precioProducto.textContent = `${detalle.precio.toLocaleString("es-PE", { style: "currency", currency: "PEN" })}`
                  subtotalProducto.textContent = `${((detalle.cantidad * detalle.producto.precio).toLocaleString("es-PE", { style: "currency", currency: "PEN" }))}`

                  filaProducto.appendChild(nombreProducto)
                  filaProducto.appendChild(cantidadProducto)
                  filaProducto.appendChild(precioProducto)
                  filaProducto.appendChild(subtotalProducto)
                  tbody.appendChild(filaProducto)
                })
                  const total = pedido.detalles.reduce((acc, detalle) => acc + (detalle.cantidad * detalle.producto.precio), 0)

                  const filaTotal = document.createElement('tr')
                  const celdaTotal = document.createElement('td')
                  const celdaVacia = document.createElement('td')

                  celdaVacia.setAttribute('colspan','3')
                  celdaVacia.textContent = 'Costo total: '
                  celdaVacia.classList.add('vacia')

                  celdaTotal.textContent = `${total.toLocaleString("es-PE", { style: "currency", currency: "PEN" })}`
                  celdaTotal.classList.add('fila-total')
                  filaTotal.appendChild(celdaVacia)
                  filaTotal.appendChild(celdaTotal)
                  tbody.appendChild(filaTotal)

                  pedidosContainer.appendChild(pedidoItem)
            })
          })
          .catch(error => {
            console.error('Error al obtener los datos de los pedidos:',error)
          })
      })
      .catch(error => {
        console.error('Error al obtener el contador de pedidos:',error)
      })
})
.catch(error => {
  console.error('Error al obtener el nombre de usuario:',error)
})

  if (userDataP) {
    login.style.display = 'none'
    userMenu.style.display = 'block'
  
    const welcomeMessage = userMenu.querySelector('.welcome-message')
    buscarNombreCliente(userDataP)
    .then(nombre => {
        welcomeMessage.textContent = `Bienvenido, ${nombre}`
    })

    menuIconWrapper.addEventListener('click', () => {
        usuarioOpciones.style.display = 'block'
        usuarioOpciones.innerHTML = dropdownMenu.innerHTML
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

function contadorPedidos() {
    return new Promise((resolve, reject) => {
      buscarUsuario(userDataP)
        .then(username => {
          const c = desencriptar(ps)
          const headers = new Headers()
          headers.append('Authorization', 'Basic ' + btoa(username + ':' + c))
          fetch(`https://negocio-victor.rj.r.appspot.com/pedido/listar/usuario/custom/${userDataP}`, {
            method: 'GET',
            headers: headers
          })
            .then(response => response.json())
            .then(data => {
              resolve(data.length)
            })
            .catch(error => {
              reject(error)
            })
        })
        .catch(error => {
          reject(error)
        })
    })
}
function buscarNombreCliente(id) {
  return fetch(`https://negocio-victor.rj.r.appspot.com/usuario/id/${id}`)
  .then(response => response.json())
  .then(data => {
      return data.nombres
  })
  .catch(error => {
      console.error(error)
      return ''
  })
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
  return fetch(`https://negocio-victor.rj.r.appspot.com/usuario/id/${userId}`)
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
