// Traer los elementos HTML a variables JS
const section = document.querySelector(".bio");
const iconsContainer = document.querySelector(".iconos");
const article = document.querySelector(".article");
const right = document.querySelector(".right");
const left = document.querySelector(".left");
const carta = document.querySelector(".carta");
let currentIndex = 0; // índice actual del array

let pokemons;

// Función para actualizar la información de los tipos
const updateTipoInfo = (tipo, tipos) => {
  const tipoSeleccionado = carta.querySelector('.tipoSeleccionado');
  const cartaTipo = carta.querySelector('.carta-tipo');
  const iconosEfectivo = carta.querySelector('.iconos-efectivo');
  const iconosDebilidad = carta.querySelector('.iconos-debil');

  // Mostrar el nombre del tipo seleccionado
  tipoSeleccionado.textContent = tipo.nombre;

  // Mostrar el logo del tipo seleccionado
  cartaTipo.src = tipo.logo;

  // Limpiar los iconos existentes
  iconosEfectivo.innerHTML = '';
  iconosDebilidad.innerHTML = '';

  // Mostrar los tipos efectivos
  tipo.efectivo_contra.forEach(nombreTipo => {
    const tipoInfo = tipos.find(t => t.nombre === nombreTipo);
    if (tipoInfo) {
      const icono = document.createElement('img');
      icono.className = "tipoTabla efectividad";
      icono.src = tipoInfo.logo;
      iconosEfectivo.appendChild(icono);
    }
  });

  // Mostrar las debilidades
  tipo.debil_contra.forEach(nombreTipo => {
    const tipoInfo = tipos.find(t => t.nombre === nombreTipo);
    if (tipoInfo) {
      const icono = document.createElement('img');
      icono.className = "tipoTabla debilidad";
      icono.src = tipoInfo.logo;
      iconosDebilidad.appendChild(icono);
    }
  });
};

// Función para actualizar la información de los tipos por elemento
const updateTipoInfoByElement = (tipoElemento, tipos) => {
  const tipoNombre = tipoElemento.dataset.tipo;
  const tipoSeleccionado = tipos.find(tipo => tipo.nombre === tipoNombre);

  if (tipoSeleccionado) {
    updateTipoInfo(tipoSeleccionado, tipos);
    carta.style.display = "block";
  } else {
    console.log("No se encontró ningún tipo con ese nombre.");
  }
};

// Llamamos al JSON con la información de la pokedex
fetch('infoPokemon.json')
  .then(response => response.json())
  .then(data => {
    pokemons = data;

    // Llamamos al JSON con la información de los tipos
    fetch('tablaTipos.json')
      .then(response => response.json())
      .then(data => {
        const tipos = data.tipos; // Accedemos al array dentro del objeto data
        if (!Array.isArray(tipos)) {
          console.error("La variable 'tipos' no es un array:", tipos);
          return;
        }

        // Función para crear y actualizar los elementos del Pokémon
        const createPokemonElements = () => {
          // Creamos el primer nombre (charmander)
          const nombre = document.createElement('h2');
          nombre.className = "nombre";
          nombre.innerHTML = pokemons[currentIndex].nombre;
          article.insertBefore(nombre, article.firstChild);

          // Creamos el primer TIPO (fuego)
          const tipo = document.createElement('img');
          tipo.className = "tipo uno";
          tipo.dataset.tipo = pokemons[currentIndex].tipoNombre1; // Agregar data-tipo
          section.appendChild(tipo);
          tipo.src = pokemons[currentIndex].tipo;
          tipo.addEventListener('click', (e) => {
            e.stopPropagation();
            updateTipoInfoByElement(tipo, tipos);
            carta.style.display = "block";
          });

          // Creamos el primer nPokedex (3)
          const nPokedex = document.createElement('p');
          nPokedex.className = "numeroPokedex";
          nPokedex.innerHTML = '#' + pokemons[currentIndex].nPokedex;
          article.insertBefore(nPokedex, article.firstChild);

          // Creamos la primera imagen (charmander)
          const imagen = document.createElement('img');
          imagen.className = "gif";
          section.appendChild(imagen);
          imagen.src = pokemons[currentIndex].img;

          // Creamos la primera descripción (charmander)
          const descripcion = document.createElement('p');
          descripcion.className = "descripcion";
          descripcion.textContent = pokemons[currentIndex].descripcion;
          section.appendChild(descripcion);
        };

        // Función para actualizar la información del Pokémon
        const updatePokemonInfo = (index) => {
          // Actualizamos la imagen
          const imagen = document.querySelector('.gif');
          imagen.src = pokemons[index].img;

          // Actualizamos el nombre, el tipo, el npokedex y la descripcion
          const nombre = document.querySelector('.nombre');
          nombre.innerHTML = pokemons[index].nombre;

          const tipo = document.querySelector('.tipo.uno');
          tipo.src = pokemons[index].tipo;
          tipo.dataset.tipo = pokemons[index].tipoNombre1; // Agregar data-tipo

          const nPokedex = document.querySelector('.numeroPokedex');
          nPokedex.innerHTML = '#' + pokemons[index].nPokedex;

          const descripcion = document.querySelector('.descripcion');
          descripcion.innerHTML = pokemons[index].descripcion;

          // Manejo del segundo tipo
          const existingTipo2 = document.querySelector(".tipo.dos");
          if (existingTipo2) {
            existingTipo2.remove();
          }

          if (pokemons[index].tipo2.length !== 0) {
            // Si no está vacío, creamos el logo del tipo2
            const tipo2 = document.createElement('img');
            tipo2.className = "tipo dos";
            tipo2.dataset.tipo = pokemons[index].tipoNombre2; // Agregar data-tipo
            section.appendChild(tipo2);
            tipo2.src = pokemons[index].tipo2;

            tipo2.addEventListener('click', (e) => {
              e.stopPropagation();
              updateTipoInfoByElement(tipo2, tipos);
              carta.style.display = "block";
            });
          }

          // Actualizamos la clase activa de los iconos
          const iconos = document.querySelectorAll('.icono');
          iconos.forEach((icon, idx) => {
            if (idx === index) {
              icon.classList.add('active');
            } else {
              icon.classList.remove('active');
            }
          });
        };

        // Inicializar los elementos del primer Pokémon
        createPokemonElements();

        // Inicializamos los iconos
        pokemons.forEach((poke, index) => {
          const icono = document.createElement('img');
          icono.className = "icono";
          icono.src = poke.icono;
          // Verificamos si el Pokémon tiene un segundo tipo
          if (poke.tipoNombre2) {
            // Si tiene un segundo tipo, concatenamos ambos tipos separados por un guion (-)
            icono.dataset.tipo = `${poke.tipoNombre1}-${poke.tipoNombre2}`;
          } else {
            // Si solo tiene un tipo, asignamos ese tipo
            icono.dataset.tipo = poke.tipoNombre1;
          }

          if (index === currentIndex) {
            icono.classList.add('active');
          }
          icono.addEventListener('click', () => {
            currentIndex = index;
            updatePokemonInfo(index);
          });
          iconsContainer.appendChild(icono);
        });

        // Evento flecha derecha
        right.addEventListener('click', () => {
          if (currentIndex < pokemons.length - 1) {
            currentIndex += 1;
            updatePokemonInfo(currentIndex);
          }
        });

        // Evento flecha izquierda
        left.addEventListener('click', () => {
          if (currentIndex > 0) {
            currentIndex -= 1;
            updatePokemonInfo(currentIndex);
          }
        });

        // Clicar fuera de la carta para que se cierre
        document.addEventListener('click', (e) => {
          if (!carta.contains(e.target) && !e.target.classList.contains('tipo')) {
            carta.style.display = "none";
          }
        });

      });
  });
