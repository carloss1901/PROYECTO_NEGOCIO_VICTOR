const submitButton = document.getElementById('submitForm')
const roundedItem = document.getElementById('flecha')
const passwordInput = document.getElementById('passwordInput')
const togglePassword = document.getElementById('togglePassword')

submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    if(!validarCampos()) {
        return
    }

    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');

    const username = usernameInput.value;
    const password = passwordInput.value;

    const formData = {
        username: username,
        password: password
    }

    fetch('http://victor-api.sa-east-1.elasticbeanstalk.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if(response.status === 200) {
            return response.json()
        } else if(response.status === 401) {
            notificacionDenegacion()
            usernameInput.classList.add('input-error')
            passwordInput.classList.add('input-error')
        } else {
            throw new Error("Error en la solicitud")
        }
    })
    .then(data => {
        const passEncript = encriptar(password)
        localStorage.setItem('userData', data.id_usuario)
        localStorage.setItem('ps', passEncript)
        localStorage.setItem('nm', data.nombres)
        limpiarCampos()
        notificacionConfirmacion(data.nombres)
        console.log(data.itemsRol[0].id_rol)
        setTimeout(() => {
            if(data.itemsRol[0].id_rol === 1) {
                irAdmin()
            } else {
                irCatalogo()
            }
        }, 1200)
    })
    .catch(error => {
        console.error(error);
    })
})
roundedItem.addEventListener('click', function() {
    window.location.href = "index.html"
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

function validarCampos() {
    const usernameInput = document.getElementById('usernameInput')
    const passwordInput = document.getElementById('passwordInput')
    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()

    if(username === '') {
        notificacionCamposVaciosUser()
        usernameInput.classList.add('input-error')
        return false
    } else {
        usernameInput.classList.remove('input-error')
    }

    if(password === '') {
        notificacionCamposVaciosClave()
        passwordInput.classList.add('input-error')
        return false
    } else {
        passwordInput.classList.remove('input-error')
    }

    return true
}
function notificacionConfirmacion(nombreUsuario) {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Bienvenido, ${nombreUsuario}`,
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
function notificacionDenegacion() {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Credenciales Incorrectas :(',
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
function notificacionCamposVaciosUser() {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Debe ingresar su username',
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
function notificacionCamposVaciosClave() {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Debe ingresar su contraseña',
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
function limpiarCampos() {
    document.getElementById('usernameInput').value = ""
    document.getElementById('passwordInput').value = ""
}
function irCatalogo() {
    window.location.href = "index.html"
}
function irAdmin() {
    window.location.href = "administrador.html"
}
function encriptar(password) {
    let passwordEncript = ''
    for(let i = 0; i < password.length; i++) {
        const caracter = password[i]
        const valorAsci = caracter.charCodeAt(0)
        const nuevoValorAsci = valorAsci + 30
        const nuevoCaracter = String.fromCharCode(nuevoValorAsci)
        passwordEncript += nuevoCaracter
    }
    return passwordEncript
}