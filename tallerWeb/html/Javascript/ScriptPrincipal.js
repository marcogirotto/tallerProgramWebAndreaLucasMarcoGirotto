// Obtén todos los elementos del slider
const sliderContenidos = document.querySelectorAll('.sliderContenido');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0; // Índice del slide actual

// Función para mostrar el slide actual
function mostrarSlide(index) {
    sliderContenidos.forEach((contenido, i) => {
        contenido.style.display = i === index ? 'block' : 'none';
    });
}

// Evento para avanzar al siguiente slide
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % sliderContenidos.length;
    mostrarSlide(currentIndex);
});

// Evento para retroceder al slide anterior
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + sliderContenidos.length) % sliderContenidos.length;
    mostrarSlide(currentIndex);
});

// Mostrar el primer slide al cargar la página
mostrarSlide(currentIndex);

// Configurar la reproducción automática cada 3 segundos
function avanzarSlideAutomaticamente() {
    currentIndex = (currentIndex + 1) % sliderContenidos.length;
    mostrarSlide(currentIndex);
}

setInterval(avanzarSlideAutomaticamente, 3000); // 3000 ms = 3 segundos


