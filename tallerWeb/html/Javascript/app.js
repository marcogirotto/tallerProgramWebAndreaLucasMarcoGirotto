const username = localStorage.getItem('name');
const $onlineStatus = document.querySelector('#status-online');
const $offlineStatus = document.querySelector('#status-offline');
const $usersList = document.querySelector('#users-list');
const $chatForm = document.querySelector('form');
const $messageInput = document.querySelector('input');
const $chatElement = document.querySelector('#chat');
const $username = document.querySelector('#username');
const $lastSeen = document.querySelector('#last-seen');
const $usernamePic = document.querySelector('#username-pic');
const $disconnectBtn = document.querySelector('#disconnect-btn');

const renderUsers = (users) => {
    $usersList.innerHTML = '';
    users.forEach((user) => {
        const $li = document.createElement('li');
        $li.textContent = user.name;
        $usersList.appendChild($li);
    });
};

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

$chatForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const message = $messageInput.value;
    $messageInput.value = '';

    socket.emit('send-message', message);
});

$disconnectBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    localStorage.removeItem('name');
    socket.close();
    window.location.replace('websockets.html');
});

// ------------------------------------------------------------------------------------------------

if (!username) {
    window.location.replace('websockets.html');
    throw new Error('Username is required!');
}

const socket = io({
    auth: {
        token: 'ABC-456', // Se debería sustituir por un token real...
        name: username,
    },
});

socket.on('connect', () => {
    $onlineStatus.classList.remove('hidden');
    $offlineStatus.classList.add('hidden');

    $username.textContent = username;
    $lastSeen.innerHTML = getLastSeen();

    $usernamePic.innerHTML = `<img src="https://api.dicebear.com/9.x/initials/svg?seed=${username}" alt="${username}" />`;
    console.log('Connected');
});

socket.on('disconnect', () => {
    $onlineStatus.classList.add('hidden');
    $offlineStatus.classList.remove('hidden');
    console.log('Disconnected');
});

socket.on('online-users', renderUsers);

socket.on('new-message', renderMessage);

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
