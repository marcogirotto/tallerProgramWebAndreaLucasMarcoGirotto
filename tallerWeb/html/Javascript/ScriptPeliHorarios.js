const detallesBtn = document.getElementById('detalles');
const horariosBtn = document.getElementById('horarios');
const contenidoDetalles = document.querySelector('.peliculaDatos');
const contenidoHorarios = document.querySelector('.peliculaTicket');


detallesBtn.addEventListener('click', () => {
    contenidoDetalles.style.display = 'block';
    contenidoHorarios.style.display = 'none';
    detallesBtn.style.borderBottom = '2px solid red';
    detallesBtn.style.color = 'red';
    horariosBtn.style.borderBottom = 'none';
    horariosBtn.style.color = 'initial';
});

horariosBtn.addEventListener('click', () => {
    contenidoDetalles.style.display = 'none';
    contenidoHorarios.style.display = 'block';
    detallesBtn.style.borderBottom = 'none';
    detallesBtn.style.color = 'initial';
    horariosBtn.style.borderBottom = '2px solid red';
    horariosBtn.style.color = 'red';
});