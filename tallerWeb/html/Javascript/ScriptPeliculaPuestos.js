




const urlApi = "https://cinexunidos-production.up.railway.app";
let theatreId = "", auditoriumId = "", showtimeId = "";

//funciones api--------------------------------------------------------------------------

async function obtenerInformacionCines() {
    try {
        const respuesta = await fetch(urlApi + "/theathers/");
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        const datos = await respuesta.json();
        console.log(datos);
        // Aquí puedes procesar los datos como necesites
    } catch (error) {
        console.error('Hubo un problema al recuperar la información de los cines:', error);
    }
}

async function obtenerInformacionCineEspecifico(theatreId) {
    try {
        const respuesta = await fetch(urlApi + `/theatres/${theatreId}`);
        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                throw new Error(`El cine con ID '${theatreId}' no fue encontrado.`);
            } else {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }
        }
        const datos = await respuesta.json();
        console.log(datos);
        // Aquí puedes procesar los datos como necesites
    } catch (error) {
        console.error('Hubo un problema al recuperar la información del cine:', error);
        mostrarNotificacionError(error.message);
        return;
    }
}

async function obtenerInformacionSalasCine(theatreId) {
    try {
        const respuesta = await fetch(`${urlApi}/theatres/${theatreId}/auditoriums`);
        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                throw new Error(`El cine con ID '${theatreId}' no fue encontrado.`);
            } else if (respuesta.status === 400) {
                throw new Error('El identificador del cine proporcionado no es válido.');
            } else {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }
        }
        const salas = await respuesta.json();
        console.log(salas);
        // Aquí puedes procesar la información de las salas como necesites
    } catch (error) {
        console.error('Hubo un problema al recuperar la información de las salas:', error);
        mostrarNotificacionError(error.message);
        return;
    }
}

//para horarios
async function obtenerInformacionSalaCine() {
    try {
        const respuesta = await fetch(`${urlApi}/theatres/${theatreId}/auditoriums/${auditoriumId}`);
        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                throw new Error(`La sala de cine con ID '${auditoriumId}' no fue encontrada.`);
            } else if (respuesta.status === 400) {
                throw new Error('El identificador proporcionado no es válido.');
            } else {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }
        }
        const salaCine = await respuesta.json();
        console.log(salaCine);
        // Aquí puedes procesar la información de la sala de cine como necesites
    } catch (error) {
        console.error('Hubo un problema al recuperar la información de la sala de cine:', error);
        mostrarNotificacionError(error.message);
        return;
    }
}


/**/
async function obtenerInformacionFunciones() {
    try {
        const respuesta = await fetch(`${urlApi}/theatres/${theatreId}/auditoriums/${auditoriumId}/showtimes`);
        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                throw new Error(`No se encontró ninguna función. Asegúrate de que los identificadores del cine y la sala de cine sean correctos.`);
            } else {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }
        }
        const funciones = await respuesta.json();
        console.log(funciones);
        // Aquí puedes procesar la información de las funciones como necesites
    } catch (error) {
        console.error('Hubo un problema al recuperar la información de las funciones:', error);
        mostrarNotificacionError(error.message);
        return;
    }
}

//
async function obtenerInformacionFuncionEspecifica() {
    try {
        const respuesta = await fetch(`${urlApi}/theatres/${theatreId}/auditoriums/${auditoriumId}/showtimes/${showtimeId}`);
        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                throw new Error(`La función con ID '${showtimeId}' no fue encontrada. Verifica los identificadores proporcionados.`);
            } else {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }
        }
        const funcionEspecifica = await respuesta.json();
        console.log(funcionEspecifica);
        return funcionEspecifica;
        // Aquí puedes procesar la información de la función específica como necesites
    } catch (error) {
        console.error('Hubo un problema al recuperar la información de la función específica:', error);
        mostrarNotificacionError(error.message);
        return;
    }
}


async function reservarAsiento(seat) {
    const url = `${urlApi}/theatres/${theatreId}/auditoriums/${auditoriumId}/showtimes/${showtimeId}/reserve`;
    const requestBody = {
        seat: seat
    };

    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (respuesta.status === 200 || respuesta.status === 201) {
            console.log('El asiento ha sido reservado exitosamente.');
        } else if (respuesta.status === 403) {
            throw new Error('No se pudo realizar la reserva. El asiento ya está ocupado o no existe.');
        } else if (respuesta.status === 400) {
            throw new Error('El asiento o butaca a reservar no ha sido proporcionado.');
        } else {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
    } catch (error) {
        console.error('Hubo un problema al realizar la reserva:', error);
        mostrarNotificacionError(error.message);
    }
}


async function cancelarReservaAsiento(seat) {
    const url = `${urlApi}/theatres/${theatreId}/auditoriums/${auditoriumId}/showtimes/${showtimeId}/reserve`;
    try {
        const respuesta = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ seat: seat })
        });

        if (respuesta.status === 200) {
            console.log('La reserva del asiento ha sido cancelada exitosamente.');
            // Aquí puedes agregar lógica adicional para manejar la cancelación exitosa
        } else if (respuesta.status === 400) {
            throw new Error('La información del asiento a cancelar no ha sido proporcionada.');
        } else if (respuesta.status === 409) {
            throw new Error('El asiento a cancelar no se encuentra ocupado o no es posible cancelarlo.');
        } else {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
    } catch (error) {
        console.error('Hubo un problema al cancelar la reserva del asiento:', error);
        alert(error.message);
    }
}

////////////////////////////////////////////////////////////

function recibirActualizacionesReservas() {
    const url = `${urlApi}/theatres/${theatreId}/auditoriums/${auditoriumId}/showtimes/${showtimeId}/reservation-updates`;
    let eventSource = null;

    function connect() {
        eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received reservation update:', data);

            // actualizar asiento.
            const asientoElement = document.getElementById(data.seat);

            if (data.message.includes('released')) {
                // Cambia la clase de "seleccionado" a "disponible"
                asientoElement.classList.remove('reservado');
                asientoElement.classList.add('disponible');
            } else if(data.message.includes('reserved')) {
                // Cambia la clase de "disponible" a "seleccionado"
                asientoElement.classList.remove('disponible');
                asientoElement.classList.add('reservado');
            }
        };

        eventSource.onerror = (error) => {
            console.error('Error with SSE connection:', error);
            //alert("hubo un error de conexion");
            setTimeout(connect, 1000);
        };
    }
    connect();
}


//funciones----------------------------------------------------------------------------

theatreId = "sambil-chacao";
auditoriumId = "sala-1";
showtimeId = "14_00";//"17_45";

//recibirActualizacionesReservas();

obtenerInformacionFuncionEspecifica().then(datosFuncion => {
    const asientos = datosFuncion.seats;
    const datosPelicula = datosFuncion.movie;
    cargarTablaAsientos(asientos);
    actualizarDetallesPelicula(datosPelicula, datosFuncion.startTime);
    recibirActualizacionesReservas();
    otroEvento();
});


function cargarTablaAsientos(asientos) {
    const tablaAsientos = document.querySelector('.regionTablaAsientos table tbody');
    tablaAsientos.innerHTML = '';

    const letrasFilas = Object.keys(asientos).reverse();

    letrasFilas.forEach((letraFila) => {
        const asientosFila = asientos[letraFila];
        const filaElement = document.createElement('tr');
        filaElement.innerHTML = `<th>${letraFila}</th>`;

        asientosFila.forEach((estadoAsiento, indexAsiento) => {
            if (estadoAsiento === -1) {
                filaElement.innerHTML += '<td></td>';
            } else {
                const asientoElement = document.createElement('td');
                let claseAsiento = '';

                switch (estadoAsiento) {
                    case 0:
                        claseAsiento = 'disponible';
                        break;
                    case 1:
                        claseAsiento = 'ocupado';
                        break;
                    case 2:
                        claseAsiento = 'reservado';
                        break;
                }
                const numeroAsiento = letraFila + indexAsiento;

                asientoElement.innerHTML = `
            <button class="puesto ${claseAsiento}" id="${numeroAsiento}">
                <p>${numeroAsiento}</p>
                <svg class="iconoSilla"
                    viewBox="0 0 28 22" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M1.09961 2.5H3.59951C4.1518 2.5 4.59951 2.94772 4.59951 3.5V15.5C4.59951 16.0523 5.04723 16.5 5.59951 16.5H22.0995C22.6518 16.5 23.0995 16.0523 23.0995 15.5V3.5C23.0995 2.94772 23.5472 2.5 24.0995 2.5H26.5996C27.1519 2.5 27.5996 2.94771 27.5996 3.5V16.5C27.5996 19.2614 25.361 21.5 22.5996 21.5H5.09961C2.33819 21.5 0.0996094 19.2614 0.0996094 16.5V3.5C0.0996094 2.94772 0.547325 2.5 1.09961 2.5Z"
                        fill="currentColor">
                    </path>
                    <path
                        d="M5.59951 13V2C5.59951 0.895431 6.49495 0 7.59951 0H20.0996C21.2042 0 22.0996 0.89543 22.0996 2V7.5V13C22.0996 14.1046 21.2042 15 20.0996 15H7.59951C6.49494 15 5.59951 14.1046 5.59951 13Z"
                        fill="currentColor">
                    </path>
                </svg>
            </button>
        `;
                filaElement.appendChild(asientoElement);
            }
        });
        tablaAsientos.appendChild(filaElement);
    });
    asignarEventoAsientosDisponibles();
}


function asignarEventoAsientosDisponibles() {
    const botonesAsiento = document.querySelectorAll('.puesto.disponible, .puesto.seleccionado');
    //const infoItems = document.getElementById('InfoItems');

    botonesAsiento.forEach((boton) => {
        boton.addEventListener('click', async (event) => {
            let asientoSeleccionado = event.currentTarget.id;
            console.log(`Asiento seleccionado: ${asientoSeleccionado}`);

            if (boton.classList.contains('seleccionado')) {
                // Cambia la clase de "seleccionado" a "disponible"
                boton.classList.remove('seleccionado');
                boton.classList.add('disponible');

                try {
                    await cancelarReservaAsiento(asientoSeleccionado);
                    console.log('Asiento reservado exitosamente.');
                } catch (error) {
                    console.error('Error al reservar el asiento:', error.message);
                    alert(error.message);
                }

            } else {
                // Cambia la clase de "disponible" a "seleccionado"
                boton.classList.remove('disponible');
                boton.classList.add('seleccionado');

                try {
                    await reservarAsiento(asientoSeleccionado);
                    console.log('Asiento reservado exitosamente.');
                } catch (error) {
                    console.error('Error al reservar el asiento:', error.message);
                    alert(error.message);
                }
            }
        });
    });
}

function otroEvento(){
    const boton = document.getElementById('botonContinuar');
    boton.addEventListener('click', function () {
        obtenerInformacionFuncionEspecifica().then(datosFuncion => {
            const asientos = datosFuncion.seats;
            cargarTablaAsientos(asientos);
            alert("se ha reservado los asientos");
        });
    });
}


///////////////////////////////////////////////////

function actualizarDetallesPelicula(datosPelicula, hora) {
    document.querySelector('.peliculaImagen').src = urlApi + '/' + datosPelicula.poster;
    document.querySelector('.detallesPelicula h4').textContent = datosPelicula.name;

    agregarParrafo('runningTime', datosPelicula.runningTime);
    agregarParrafo('rating', datosPelicula.rating);
    agregarParrafo('startTime', hora);
}

function agregarParrafo(contenedorId, texto) {
    const contenedor = document.querySelector(`#${contenedorId}`);
    const nuevoParrafo = document.createElement('p');
    nuevoParrafo.textContent = texto;
    contenedor.appendChild(nuevoParrafo);
}















