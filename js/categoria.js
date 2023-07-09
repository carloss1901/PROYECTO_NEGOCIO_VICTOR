const categoriaContainer = document.getElementById('categoriaContainer')
const formularioEditar = document.getElementById('formularioEditar')

const idCategoria = document.getElementById('idCategoria')
const nombreCategoria = document.getElementById('nombreCategoria')
const comboEstado = document.getElementById('estadoCategoria')

const nombreCategoriaR = document.getElementById('nombreCategoriaR')

const btnActualizar = document.getElementById('btnActualizar')
const btnGuardar = document.getElementById('btnGuardarCategoria')
const btnRegistrar = document.getElementById('btnRegistrar')

const userData = localStorage.getItem('userData')
const ps = localStorage.getItem('ps')

fetch("http://victor-api.sa-east-1.elasticbeanstalk.com/categoria/listar")
.then(response => response.json())
.then(data => {
  const tablaCategorias = document.createElement('table')
  const thead = document.createElement('thead')
  const tbody = document.createElement('tbody')
  tablaCategorias.appendChild(thead)
  tablaCategorias.appendChild(tbody)

  const encabezadosRow = document.createElement('tr')
  const encabezados = ['ID','NOMBRE','ESTADO','','']

  encabezados.forEach(encabezado => {
    const th = document.createElement('th')
    th.textContent = encabezado
    encabezadosRow.appendChild(th)
  })

  thead.appendChild(encabezadosRow)

  data.forEach(categoria => {
    const filaCategoria = document.createElement('tr')

    const idCategoria = document.createElement('td')
    idCategoria.textContent = categoria.id_categoria

    const nombreCategoria = document.createElement('td')
    nombreCategoria.textContent = categoria.nombre

    const estadoCategoria = document.createElement('td')
    estadoCategoria.textContent = categoria.vigencia ? "Activo" : "No Activo"

    const editarCategoria = document.createElement('td')
    const editarButton = document.createElement('button')
    editarButton.textContent = 'Editar'
    editarCategoria.appendChild(editarButton)

    const eliminarCategoria = document.createElement('td')
    const eliminarButton = document.createElement('button')

    editarButton.addEventListener('click', (event) => {
      formularioEditar.style.display = 'block'
      event.stopPropagation()
      datosEditar(categoria)
      
      const clickListener = (event) => {
        if(!formularioEditar.contains(event.target)) {
          formularioEditar.style.display = 'none'
          document.removeEventListener('click', clickListener)
        }
      }
      document.addEventListener('click', clickListener)
    })

    if(!categoria.vigencia) {
      const activarButton = document.createElement('button')
      activarButton.textContent = 'Activar'
      activarButton.classList.add('btn','btn-info')
      activarButton.style.fontWeight = 'bold'
      eliminarCategoria.appendChild(activarButton)

      activarButton.addEventListener('click', () => {
        Swal.fire({
          icon: 'warning',
          title: '¿Seguro que quieres activar este producto?',
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          customClass: {
            popup: 'swal.popup'
          },
          allowOutsideClick: false
        }).then((result) => {
          if(result.isConfirmed) {
            activarCategoriaForm(categoria.id_categoria)
          }
        })
      })
      editarButton.disabled = true
    } else {
      eliminarButton.textContent = 'Desactivar'
      eliminarCategoria.appendChild(eliminarButton)

      eliminarButton.addEventListener('click', () => {
        Swal.fire({
          icon: 'warning',
          title: '¿Seguro que quieres desactivar este categoría?',
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          customClass: {
            popup: 'swal-popup'
          },
          allowOutsideClick: false
        }).then((result) => {
          if(result.isConfirmed) {
            eliminarCategoriaForm(categoria.id_categoria)
          }
        })
      })
    }

    idCategoria.classList.add('centrar')
    estadoCategoria.classList.add('centrar')
    editarCategoria.classList.add('centrar')
    editarButton.classList.add('btn','btn-success')
    editarButton.style.fontWeight = 'bold'
    eliminarCategoria.classList.add('centrar')
    eliminarButton.classList.add('btn','btn-danger')
    eliminarButton.style.fontWeight = 'bold'

    if(!categoria.vigencia) {
      filaCategoria.classList.add('fila-inactiva')
    }

    filaCategoria.appendChild(idCategoria)
    filaCategoria.appendChild(nombreCategoria)
    filaCategoria.appendChild(estadoCategoria)
    filaCategoria.appendChild(editarCategoria)
    filaCategoria.appendChild(eliminarCategoria)

    tbody.appendChild(filaCategoria)
  })
  categoriaContainer.appendChild(tablaCategorias)
})

btnActualizar.addEventListener('click', () => {
  actualizarDatos()
})
btnGuardar.addEventListener('click', (event) => {
  formularioRegistrar.style.display = 'block'
  event.stopPropagation()
  const clickListener = (event) => {
    if(!formularioRegistrar.contains(event.target)) {
      formularioRegistrar.style.display = 'none'
      document.removeEventListener('click', clickListener)
    }
  }
  document.addEventListener('click',clickListener)
})
btnRegistrar.addEventListener('click', () => {
  validarCampos()
  if(nombreCategoriaR.style.border === '') {
    Swal.fire({
      icon: 'warning',
      title: '¿Seguro que quiere registrar esta categoría?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'swal-popup'
      },
      allowOutsideClick: false
    }).then((result) => {
      if(result.isConfirmed) {guardarDatos()}
    })
   }
})

function guardarDatos() {
  var categoria = {
    nombre:nombreCategoriaR.value
  }

  buscarUsuario(userData)
    .then(username => {
      const c = desencriptar(ps)
      const auth = new Headers()
      auth.append('Authorization','Basic ' + btoa(username + ":" + c))
      fetch(`http://victor-api.sa-east-1.elasticbeanstalk.com/categoria/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': auth.get('Authorization')
        },
        body: JSON.stringify(categoria)
      })
      .then(response => response.json())
      .then(notificacionConfirmacion('success','Categoría Registrada','La categoría ha sido registrada con éxito.'))
      .catch(error => {console.error('Error: ',error)})
    })
}
function actualizarDatos() {
  var categoria = {
    id_categoria: idCategoria.value,
    nombre: nombreCategoria.value,
    vigencia: comboEstado.value === 'si'
  }

  buscarUsuario(userData)
    .then(username => {
      const c = desencriptar(ps)
      const auth = new Headers()
      auth.append('Authorization','Basic ' + btoa(username + ":" + c))
      fetch(`http://victor-api.sa-east-1.elasticbeanstalk.com/categoria/editar/${idCategoria.value}`, {
        method: 'PUT',
        body: JSON.stringify(categoria),
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': auth.get('Authorization')
        }
      })
      .then(response => response.json())
      .then(data => {
        notificacionConfirmacion('success','Categoria Actualizada','La categoría ha sido actualizada con éxito.')
      })
      .catch(error => {
        console.error('Error al editar la categoría',error)
      })
    })
}
function datosEditar(categoria) {
  idCategoria.value = categoria.id_categoria
  nombreCategoria.value = categoria.nombre
  comboEstado.value = categoria.vigencia ? 'si' : 'no'
}
function eliminarCategoriaForm(id) {
  buscarUsuario(userData)
    .then(username => {
      const c = desencriptar(ps)
      const headers = new Headers()
      headers.append('Authorization','Basic ' + btoa(username + ":" + c))
      fetch(`http://victor-api.sa-east-1.elasticbeanstalk.com/categoria/eliminar/${id}`, {
        method: 'DELETE',
        headers: headers
      })
      .then(response => response.json())
      .then(data => {
        notificacionConfirmacion('success','Categoría Desactivada','La categoría ha sido desactivada con éxito')
      })
      .catch(error => {
        console.error("Error al desactivar la categoría: ",error)
      })
    })
}
function activarCategoriaForm(id) {
  buscarUsuario(userData)
    .then(username => {
      const c = desencriptar(ps)
      const headers = new Headers()
      headers.append('Authorization','Basic ' + btoa(username + ":" + c))
      fetch(`http://victor-api.sa-east-1.elasticbeanstalk.com/categoria/activar/${id}`, {
        method: 'DELETE',
        headers: headers
      })
      .then(response => response.json())
      .then(data => {
        notificacionConfirmacion('success','Categoría Activada','La categoría ha sido activada con éxito')
      })
      .catch(error => {
        console.error("Error al activar la categoría: ",error)
      })
    })
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
function redireccionar() {
  window.location.href = "administrador.html"
}
function aplicarEstiloError(elemento) {
  if(elemento.value === '') {
    elemento.style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.5)'
  } else {
    elemento.style.boxShadow = ''
  }
}
function validarCampos() {
  aplicarEstiloError(nombreCategoriaR)
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