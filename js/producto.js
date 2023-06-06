const productoContainer = document.getElementById('productoContainer')
const formularioEditar = document.getElementById('formularioEditar')
const formularioRegistrar = document.getElementById('formularioRegistrar')

const comboCategoria = document.getElementById('categoriaProducto')
const idProducto = document.getElementById('idProducto')
const nombreProducto = document.getElementById('nombreProducto')
const precioProducto = document.getElementById('precioProducto')
const stockProducto = document.getElementById('stockProducto')
const imagenProducto = document.getElementById('imagenProducto')
const comboEstado = document.getElementById('estadoProducto')
const comboRecomendado = document.getElementById('recomendadoProducto')

const comboCategoriaR = document.getElementById('categoriaProductoR')
const nombreProductoR = document.getElementById('nombreProductoR')
const precioProductoR = document.getElementById('precioProductoR')
const stockProductoR = document.getElementById('stockProductoR')
const imagenProductoR = document.getElementById('imagenProductoR')
const comboEstadoR = document.getElementById('estadoProductoR')
const comboRecomendadoR = document.getElementById('recomendadoProductoR')

const btnActualizar = document.getElementById('btnActualizar')
const btnRegistrar = document.getElementById('btnRegistrar')
const btnGuardar = document.getElementById('btnGuardarProducto')

const userData = localStorage.getItem('userData') 
const ps = localStorage.getItem('ps')

fetch('https://negocio-victor.rj.r.appspot.com/producto/listar')
.then(response => response.json())
.then(data => {
  const tablaProductos = document.createElement('table')

  const thead = document.createElement('thead')
  const tbody = document.createElement('tbody')
  tablaProductos.appendChild(thead)
  tablaProductos.appendChild(tbody)

  const encabezadosRow = document.createElement('tr')
  const encabezados = ['ID','NOMBRE','PRECIO','STOCK','ESTADO','RECOMENDADO','CATEGORÍA','','']

  encabezados.forEach(encabezado => {
    const th = document.createElement('th')
    th.textContent = encabezado
    encabezadosRow.appendChild(th)
  })  

  thead.appendChild(encabezadosRow)

  data.forEach(producto => {
    const filaProducto = document.createElement('tr')

    const idProducto = document.createElement('td')
    idProducto.textContent = producto.id_producto

    const nombreProducto = document.createElement('td')
    nombreProducto.textContent = producto.nombre

    const precioProducto = document.createElement('td')
    precioProducto.textContent = `${producto.precio.toLocaleString("es-PE", { style: "currency", currency: "PEN" })}`

    const stockProducto = document.createElement('td')
    stockProducto.textContent = producto.stock

    const estadoProducto = document.createElement('td')
    estadoProducto.textContent = producto.vigencia ? "Activo" : "No activo"

    const recomendadoProducto = document.createElement('td')
    recomendadoProducto.textContent = producto.recomendado ? "Si" : "No"

    const categoriaProducto = document.createElement('td')
    categoriaProducto.textContent = producto.categoria.nombre

    const editarProducto = document.createElement('td')
    const editarButton = document.createElement('button')
    editarButton.textContent = 'Editar'
    editarProducto.appendChild(editarButton)

    const eliminarProducto = document.createElement('td')
    const eliminarButton = document.createElement('button')

    editarButton.addEventListener('click', (event) => {
      formularioEditar.style.display = 'block'
      event.stopPropagation()
      datosEditar(producto)
      
      const clickListener = (event) => {
        if (!formularioEditar.contains(event.target)) {
          formularioEditar.style.display = 'none'
          document.removeEventListener('click', clickListener)
        }
      }
      document.addEventListener('click', clickListener)
    })

    if(!producto.vigencia) {
      const activarButton = document.createElement('button')
      activarButton.textContent = 'Activar'
      activarButton.classList.add('btn','btn-info')
      activarButton.style.fontWeight = 'bold'
      eliminarProducto.appendChild(activarButton)

      activarButton.addEventListener('click', () => {
        Swal.fire({
          icon: 'warning',
          title: '¿Seguro que quieres activar este producto?',
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          customClass: {
            popup: 'swal-popup'
          },
          allowOutsideClick: false
        }).then((result) => {
          if(result.isConfirmed) {
            activarProductoForm(producto.id_producto)
          }
        })
      })
      editarButton.disabled = true
    } else {
      eliminarButton.textContent = 'Desactivar'
      eliminarProducto.appendChild(eliminarButton)
      
      eliminarButton.addEventListener('click', () => {
        Swal.fire({
          icon: 'warning',
          title: '¿Seguro que quieres eliminar este producto?',
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          customClass: {
            popup: 'swal-popup',
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-secondary'
          },
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            eliminarProductoForm(producto.id_producto);
          }
        })
      })
    }

    idProducto.classList.add('centrar')
    precioProducto.classList.add('centrar')
    stockProducto.classList.add('centrar')
    estadoProducto.classList.add('centrar') 
    recomendadoProducto.classList.add('centrar')
    categoriaProducto.classList.add('centrar')
    editarProducto.classList.add('centrar')
    eliminarProducto.classList.add('centrar')
    editarButton.classList.add('btn','btn-success')
    editarButton.style.fontWeight = 'bold'
    eliminarButton.classList.add('btn','btn-danger')
    eliminarButton.style.fontWeight = 'bold'

    if(!producto.vigencia) {
      filaProducto.classList.add('fila-inactiva')
    } 

    filaProducto.appendChild(idProducto)
    filaProducto.appendChild(nombreProducto)
    filaProducto.appendChild(precioProducto)
    filaProducto.appendChild(stockProducto)
    filaProducto.appendChild(estadoProducto)
    filaProducto.appendChild(recomendadoProducto)
    filaProducto.appendChild(categoriaProducto)
    filaProducto.appendChild(editarProducto)
    filaProducto.appendChild(eliminarProducto)

    tbody.appendChild(filaProducto)
  })
  productoContainer.appendChild(tablaProductos)
})
.catch(error => {
  console.error('Error al obtener los datos de los productos: ',error)
})

btnActualizar.addEventListener('click', () => {
  actualizarDatos();
})
btnGuardar.addEventListener('click', (event) => {
  formularioRegistrar.style.display = 'block'
  comboboxCategoriaR()
      event.stopPropagation()
      const clickListener = (event) => {
        if (!formularioRegistrar.contains(event.target)) {
          formularioRegistrar.style.display = 'none';
          document.removeEventListener('click', clickListener)
        }
      }
      document.addEventListener('click', clickListener)
})
btnRegistrar.addEventListener('click', () => {
  validarCampos()
  if(nombreProductoR.style.boxShadow === '' &&
  precioProductoR.style.boxShadow === '' &&
  stockProductoR.style.boxShadow === '' &&
  imagenProductoR.style.boxShadow === '') {
    Swal.fire({
      icon: 'warning',
      title: '¿Seguro que quiere registrar este producto?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'swal-popup'
      },
      allowOutsideClick: false
    }).then((result) => {
      if(result.isConfirmed) {guardarProducto()}
    })
  }
})

function guardarProducto() {
    var producto = {
      nombre: nombreProductoR.value,
      precio: parseFloat(precioProductoR.value),
      stock: parseInt(stockProductoR.value),
      imagen: imagenProductoR.value,
      vigencia: comboEstadoR.value === 'si',
      recomendado: comboRecomendadoR.value === 'si',
      categoria: { id_categoria: comboCategoriaR.value }
    }
    
    buscarUsuario(userData)
      .then(username => {
        const c = desencriptar(ps)
        const auth = new Headers()
        auth.append('Authorization','Basic ' + btoa(username + ":" + c))
        fetch('https://negocio-victor.rj.r.appspot.com/producto/registrar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': auth.get('Authorization')
          },
          body: JSON.stringify(producto)
        })
        .then(response => response.json())
        .then(data => {
          notificacionConfirmacion('success','Producto Registrado','El producto ha sido registrado con éxito')
        })
        .catch(error => {
          console.error('Error: ',error)
        })
      })  
}
function actualizarDatos() {
  var precioSinFormato = parseFloat(precioProducto.value.replace(/[^0-9.-]+/g,""))
  var producto = {
    id_producto: idProducto.value,
    nombre: nombreProducto.value,
    precio: precioSinFormato,
    stock: parseInt(stockProducto.value),
    imagen: imagenProducto.value,
    vigencia: comboEstado.value === 'si',
    recomendado: comboRecomendado.value === 'si',
    categoria: { id_categoria: comboCategoria.value }
  };

  buscarUsuario(userData)
    .then(username => {
      const c = desencriptar(ps)
      const auth = new Headers()
      auth.append('Authorization','Basic ' + btoa(username + ":" + c))
      fetch(`https://negocio-victor.rj.r.appspot.com/producto/editar/${idProducto.value}`, {
        method: 'PUT',
        body: JSON.stringify(producto),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth.get('Authorization')
        }
      })
      .then(response => response.json())
      .then(data => {
        notificacionConfirmacion('success','Producto Actualizado','El producto ha sido actualizado con éxito.')
      })
      .catch(error => {
        console.error('Error al editar el producto', error)
      })
    })
}
function eliminarProductoForm(id) {
  buscarUsuario(userData)
    .then(username => {
      const c = desencriptar(ps)
      const auth = new Headers()
      auth.append('Authorization','Basic ' + btoa(username + ":" + c))
      fetch(`https://negocio-victor.rj.r.appspot.com/producto/eliminar/${id}`, {
        method: 'DELETE',
        headers: auth
      })
      .then(response => response.json())
      .then(data => {
        notificacionConfirmacion('success','Producto Desactivado','El producto ha sido desactivado con éxito.')
      })
      .catch(error => {
        console.error('Error al eliminar el producto: ',error)
      })
    })
}
function activarProductoForm(id) {
  buscarUsuario(userData)
    .then(username => {
      const c = desencriptar(ps)
      const headers = new Headers()
      headers.append('Authorization','Basic ' + btoa(username + ":" + c))
      fetch(`https://negocio-victor.rj.r.appspot.com/producto/activar/${id}`, {
        method: 'DELETE',
        headers: headers
      })
      .then(response => response.json())
      .then(data => {
        notificacionConfirmacion('success','Producto Activado','El producto ha sido activado con éxito.')
      })
      .catch(error => {
        console.error('Error al activar el producto: ',error)
      })
    })
}
function datosEditar(producto) {
  idProducto.value = producto.id_producto
  nombreProducto.value = producto.nombre
  precioProducto.value = parseFloat(producto.precio).toFixed(2)
  stockProducto.value = parseInt(producto.stock)
  imagenProducto.value = producto.imagen
  comboEstado.value = producto.vigencia ? 'si' : 'no'
  comboRecomendado.value = producto.recomendado ? 'si' : 'no'

  comboboxCategoria()
  .then(() => {
    seleccionarCategoriaPorId(producto.categoria.id_categoria)
  })
  .catch(error => {
    console.error('Error: ',error )
  })
}
function seleccionarCategoriaPorId(categoriaId) {
  const opcionesCategoria = comboCategoria.options
  for (let i = 0; i < opcionesCategoria.length; i++) {
    if (opcionesCategoria[i].value === categoriaId.toString()) {
      opcionesCategoria[i].selected = true;
      break;
    }
  }
}
function redireccionar() {
  window.location.href = "administrador.html"
}
function comboboxCategoria() {
  return new Promise((resolve, reject) => {
    fetch('https://negocio-victor.rj.r.appspot.com/categoria/listar')
      .then(response => response.json())
      .then(data => {
        comboCategoria.innerHTML = ''

        data.forEach(categoria => {
          const option = document.createElement('option')
          option.value = categoria.id_categoria
          option.textContent = categoria.nombre
          comboCategoria.appendChild(option)
        })

        resolve()
      })
      .catch(error => {
        console.error('Error al obtener los datos de las categorias: ', error)
        reject(error)
      })
  });
}
function comboboxCategoriaR() {
  return new Promise((resolve, reject) => {
    fetch('https://negocio-victor.rj.r.appspot.com/categoria/listar')
      .then(response => response.json())
      .then(data => {
        comboCategoriaR.innerHTML = ''

        data.forEach(categoria => {
          const option = document.createElement('option')
          option.value = categoria.id_categoria
          option.textContent = categoria.nombre
          comboCategoriaR.appendChild(option)
        })

        resolve()
      })
      .catch(error => {
        console.error('Error al obtener los datos de las categorias: ', error)
        reject(error)
      })
  });
}
function notificacionConfirmacion(icon, title, text) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
    showCancelButton: false,
    showConfirmButton: true,
    confirmButtonText: 'Aceptar',
    customClass: {
      popup: 'swal-popup',
      confirmButton: 'btn btn-success'
    },
    allowOutsideClick: false
  }).then((result) => {
    if(result.isConfirmed) {
      location.reload()
    }
  })
}
function validarStock(input) {
  input.value = input.value.replace(/[^0-9]/g, '')
}
function validarPrecio(input) {
  input.value = input.value.replace(/[^0-9.]/g, '')
  var partes = input.value.split('.');
  if (partes.length > 1 && partes[1].length > 2) {
    partes[1] = partes[1].substring(0, 2);
    input.value = partes.join('.');
  }
}
function limpiarCampos() {
  nombreProductoR.value = ""
  precioProductoR.value = ""
  stockProductoR.value = ""
  imagenProductoR.value = ""
}
function aplicarEstiloError(elemento) {
  if(elemento.value === '') {
    elemento.style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.5)'
  } else {
    elemento.style.boxShadow = ''
  }
}
function validarCampos() {
  aplicarEstiloError(nombreProductoR)
  aplicarEstiloError(precioProductoR)
  aplicarEstiloError(stockProductoR)
  aplicarEstiloError(imagenProductoR)
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