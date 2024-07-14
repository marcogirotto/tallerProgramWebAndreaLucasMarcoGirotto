const botonChat = document.querySelector('.chatBoton');
const imagen = document.querySelector('.chatBoton img');
const chatBox = document.querySelector('.bottom-right');
const iniciaSesion = document.querySelector('.iniciarSesionSubmit');
const iniciaSesionPagina = document.querySelector('.iniciarSesion');
const iniciaSesionCancelar = document.querySelector('.cancelar');
const fondoOscuro = document.querySelector('.fondoOscuro');
const inputUsuario = document.getElementById('usuario');

let username = "";
const $onlineStatus = document.querySelector('#status-online');
const $offlineStatus = document.querySelector('#status-offline');

const $chatForm = document.getElementsByClassName('input')[0];
const $messageInput = document.getElementsByClassName('mensajeria')[0];

const $chatElement = document.querySelector('#chatMensajes');
const $username = document.querySelector('#username');
const $lastSeen = document.querySelector('#last-seen');
const $usernamePic = document.querySelector('#username-pic');



botonChat.addEventListener('click', () => {
    if (chatBox.style.visibility === 'hidden') {
        mostrarPopUp();
    } else {
        ocultarPopUp();
        botonChat.style.right = '28px';
        chatBox.style.maxHeight = '0';
        chatBox.style.overflow = 'hidden';
        chatBox.style.visibility = 'hidden';
        imagen.style.width = '80px';
        imagen.style.height = '80px';
    }
});


function ocultarPopUp() {
    fondoOscuro.style.display = 'none';
    iniciaSesionPagina.style.display = 'none';
}

function mostrarPopUp() {
    fondoOscuro.style.display = 'block';
    iniciaSesionPagina.style.display = 'block';
}



iniciaSesionCancelar.addEventListener('click', ocultarPopUp);
fondoOscuro.addEventListener('click', ocultarPopUp);

iniciaSesion.addEventListener('click', () => {
    username = inputUsuario.value;
    ocultarPopUp();
    chatBox.style.visibility = 'visible';
    chatBox.style.maxHeight = '1000px';
    chatBox.style.overflow = 'auto';
    botonChat.style.right = '400px';
    imagen.style.width = '40px';
    imagen.style.height = '40px';

    //conectarSocket(username);
});

///----mensajeria--------------------------------------------------


let socket;

function conectarSocket() {
    socket = io('https://cinexunidos-production.up.railway.app', {
        auth: {
            token: 'ABC-456', // Reemplaza con un token válido
            name: 'kkk', 
        },
    });

    socket.on('connect', () => {
        console.log('Conectado');
        // Aquí puedes realizar acciones adicionales cuando se establece la conexión
    });

    socket.on('disconnect', (reason) => {
        console.log('Desconectado:', reason);
        // Aquí puedes manejar la desconexión y programar la reconexión
        setTimeout(conectarSocket, 300); 
    });

    const renderMessage = (payload) => {
        const { id, message, name } = payload;
    
        const $divElement = document.createElement('div');
        $divElement.classList.add('message');
    
        if (id !== socket.id) {
            $divElement.classList.add('incoming');
        }
    
        $divElement.innerHTML = `<small>${name}</small><p>${message}</p>`;
        $chatElement.appendChild($divElement);
    
        // Scroll al final de los mensajes...
        $chatElement.scrollTop = $chatElement.scrollHeight;
    };

    socket.on('new-message', renderMessage);

}

conectarSocket();


//console.log(socket);


$chatForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const message = $messageInput.value;
    $messageInput.value = '';

    socket.emit('send-message', message);
});


// ------------------------------------------------------------------------------------------------
function getLastSeen() {
    // Obtener la fecha actual
    const now = new Date();

    // Convertir a huso horario de Venezuela (GMT-4)
    const venezuelaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Caracas' }));

    // Formatear la fecha
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedTime = venezuelaTime.toLocaleTimeString('es-VE', options);

    return `<small>Hoy a las ${formattedTime}</small>`;
}

