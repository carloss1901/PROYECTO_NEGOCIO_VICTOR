const roundedItemR = document.getElementById('flecha')
const togglePassword = document.getElementById('togglePassword')
const submitForm = document.getElementById('submitForm')
const usernameInput = document.getElementById('usernameInput')
const passwordInput = document.getElementById('passwordInput')
const nombresInput = document.getElementById('nombresInput')
const apellidosInput = document.getElementById('apellidosInput')
const dniInput = document.getElementById('dniInput')
const celularInput = document.getElementById('celularInput')
const direccionInput = document.getElementById('direccionInput')

roundedItemR.addEventListener('click', function() {
    window.location.href = "login.html"
})
togglePassword.addEventListener('click', function() {
    if(passwordInput.type === 'password') {
        passwordInput.type = 'text'
        togglePassword.innerHTML = '<i class="fas fa-eye-slash"></i>'
    } else {
        passwordInput.type = 'password'
        togglePassword.innerHTML = '<i class="fas fa-eye"></i>'
    }
})
submitForm.addEventListener('click', function(event) {
    event.preventDefault()
    validarCampos()
    if(usernameInput.style.boxShadow === '' &&
    passwordInput.style.boxShadow === '' &&
    nombresInput.style.boxShadow === '' &&
    apellidosInput.style.boxShadow === '' &&
    dniInput.style.boxShadow === '' &&
    celularInput.style.boxShadow === '' &&
    direccionInput.style.boxShadow === '') {
        const {value: username } = usernameInput
        const {value: password } = passwordInput
        const {value: nombres } = nombresInput
        const {value: apellidos } = apellidosInput
        const {value: dni } = dniInput
        const {value: celular } = celularInput
        const {value: direccion } = direccionInput
        const estado = 1
        const rol = 2

        const formData = {
            username: username,
            clave: password,
            nombres: nombres,
            apellidos: apellidos,
            dni: dni,
            celular: celular,
            direccion: direccion,
            estado: estado,
            itemsRol: [{
                id_rol: rol
            }]
        }

        fetch('https://negocio-victor.rj.r.appspot.com/usuario/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if(response.status === 409) {
                usernameEnUso()
            } else if(response.status === 400) {
                dniEnUso()
            } else if(response.status === 404) {
                celularEnUso()
            } else if(response.status === 200) {
                notificacionConfirmacion()
                limpiarCampos()
                setTimeout(() => {
                    irLogin()
                }, 1200)
            }
        })
        .catch(error => {
            console.error(error)
        })
    } else {
        notificacionError()
    }
})

function filtrarNumeros(event) {
    const input = event.target
    const regex = /[^0-9]/g
    let value = input.value.replace(regex, '')

    if (!value.startsWith('9')) {
        value = '9' + value.slice(0, 8) // Agregar el dígito "9" al principio y limitar a 8 dígitos adicionales
      } else {
        value = value.slice(0, 9) // Limitar a un máximo de 9 dígitos
      }
      
      input.value = value
}
function filtrarNumerosDNI(event) {
    const input = event.target
    const regex = /[^0-9]/g
    let value = input.value.replace(regex, '')
    value = value.slice(0, 8)
    input.value = value
}
function notificacionConfirmacion() {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Se registró exitosamente :)',
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
function notificacionError() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Debe completar todos los campos :(',
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      background: '#fff0f0',
      iconColor: '#FF0000',
      customClass: {
        popup: 'animated slideInRight'
      }
    });
}
function usernameEnUso() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'El username ya está registrado. Intente con otro',
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      background: '#fff0f0',
      iconColor: '#FF0000',
      customClass: {
        popup: 'animated slideInRight'
      }
    })
    usernameInput.style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.5)'
}
function dniEnUso() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'El DNI ya está registrado. Intente con otro',
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      background: '#fff0f0',
      iconColor: '#FF0000',
      customClass: {
        popup: 'animated slideInRight'
      }
    })
    dniInput.style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.5)'
}
function celularEnUso() {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'El celular ya está registrado. Intente con otro',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: '#fff0f0',
        iconColor: '#FF0000',
        customClass: {
          popup: 'animated slideInRight'
        }
      })
      celularInput.style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.5)'
}
function limpiarCampos() {
    document.getElementById('usernameInput').value = ""
    document.getElementById('passwordInput').value = ""
    document.getElementById('nombresInput').value = ""
    document.getElementById('apellidosInput').value = ""
    document.getElementById('dniInput').value = ""
    document.getElementById('celularInput').value = ""
    document.getElementById('direccionInput').value = ""
}
function irLogin() {
    window.location.href = "login.html"
}
function aplicarEstilosError(elemento) {
    if(elemento.value === '') {
        elemento.style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.5)'
    } else {
        elemento.style.boxShadow = ''
    }
}
function validarCampos() {
    aplicarEstilosError(usernameInput)
    aplicarEstilosError(passwordInput)
    aplicarEstilosError(nombresInput)
    aplicarEstilosError(apellidosInput)
    aplicarEstilosError(dniInput)
    aplicarEstilosError(celularInput)
    aplicarEstilosError(direccionInput)
}