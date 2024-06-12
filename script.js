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
    // Crear etiqueta de tipo efectivo
    const iconoEfectivo = document.createElement('div');
    iconoEfectivo.className = "tipoTabla efectividad";

    // Crear imagen del tipo efectivo
    const imgEfectivo = document.createElement('img');
    imgEfectivo.src = tipoInfo.logo;
    iconoEfectivo.appendChild(imgEfectivo);

    // Crear texto del tipo efectivo
    const textoEfectivo = document.createElement('span');
    textoEfectivo.className = "etiqueta"
    textoEfectivo.textContent = tipoInfo.nombre;
    iconoEfectivo.appendChild(textoEfectivo);
    
    // Agregar etiqueta de tipo efectivo a la carta
    iconosEfectivo.appendChild(iconoEfectivo);
    }
  });
    
    // Mostrar las debilidades
  tipo.debil_contra.forEach(nombreTipo => {
    const tipoInfo = tipos.find(t => t.nombre === nombreTipo);
    if (tipoInfo) {
    // Crear etiqueta de tipo débil
    const iconoDebil = document.createElement('div');
    iconoDebil.className = "tipoTabla debilidad";
    
    // Crear imagen del tipo débil
    const imgDebil = document.createElement('img');
    imgDebil.src = tipoInfo.logo;
    iconoDebil.appendChild(imgDebil);
    
    // Crear texto del tipo débil
    const textoDebil = document.createElement('span');
    textoDebil.textContent = tipoInfo.nombre;
    textoDebil.className = "etiqueta"
    iconoDebil.appendChild(textoDebil);
    
    // Agregar etiqueta de tipo débil a la carta
    iconosDebilidad.appendChild(iconoDebil);
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
    const pokemons = data;

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
            setTipoBrilloActivo(tipo);
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

            tipo2
            .addEventListener('click', (e) => {
              e.stopPropagation();
              updateTipoInfoByElement(tipo2, tipos);
              carta.style.display = "block";
              setTipoBrilloActivo(tipo2);
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
            // Devolvemos el brillo al icono del tipo
            const tipos = document.querySelectorAll('.tipo');
            tipos.forEach(tipo => {
              tipo.style.filter = "brightness(0.75)";
            });
          }
        });

        const setTipoBrilloActivo = (tipoActivo) => {
          const tipos = document.querySelectorAll(".tipo");
          tipos.forEach(tipo => {
            if(tipo === tipoActivo){
              tipo.style.filter = "brightness(1)";
            } else {
              tipo.style.filter = "brightness(0.75)";
            }
          });
        }


        // Añadimos el btn y la tabla
        verEfectividadBtn = document.querySelector(".verEfectividad");
        tablaTiposEfectividad = document.querySelector(".tablaTiposEfectividad");
        
        // Creamos el evento para que se muestre la tabla de tipos
        verEfectividadBtn.addEventListener("click", () => {
          tablaTiposEfectividad.style.display = "block";
        
        // Obtenemos el tipo del pokemon actual
        const tipoPokemon1 = pokemons[currentIndex].tipoNombre1;
        const tipoPokemon2 = pokemons[currentIndex].tipoNombre2;
      
        // Resaltamos el tipo del pokemon actual en la tabla de tipos
        const tipoCells = document.querySelectorAll('.grid-container .iconoTabla');
        tipoCells.forEach(cell => {
          const tipo = cell.dataset.tipo;
          if (tipo === tipoPokemon1 || tipo === tipoPokemon2) {
              cell.style.filter = "brightness(1)";
          } else {
              cell.style.filter = "brightness(0.6)";
          }
        });
      
        // Resaltar las celdas correspondientes al tipo del Pokémon actual
        const celdasVacias = document.querySelectorAll('.celdaVacia');
        celdasVacias.forEach(celda => {
          const tipo = celda.dataset.tipo;
          if (tipo === tipoPokemon1 || tipo === tipoPokemon2) {
              celda.classList.add('resaltada');
          } else {
              celda.classList.remove('resaltada');
          }
        });
        
        // Resaltar la fila correspondiente al tipo del Pokémon actual
        const filas = document.querySelectorAll('.grid-container tbody tr');
        filas.forEach(fila => {
          const tipoFila = fila.querySelector('.iconoTabla').dataset.tipo;
          if (tipoFila === tipoPokemon1 || tipoFila === tipoPokemon2) {
              fila.querySelectorAll('.celdaVacia').forEach(celda => {
                  celda.classList.add('resaltada-fila');
              });
          } else {
              fila.querySelectorAll('.celdaVacia').forEach(celda => {
                  celda.classList.remove('resaltada-fila');
              });
          }
        });
        
        
        
        // Resaltar la columna correspondiente al tipo del Pokémon actual
        const columnas = document.querySelectorAll('.grid-container thead th');
        columnas.forEach(columna => {
            const tipoColumna = columna.querySelector('.iconoTabla').dataset.tipo;
            if (tipoColumna === tipoPokemon1 || tipoColumna === tipoPokemon2) {
                columna.classList.add('resaltada-columna');
            } else {
                columna.classList.remove('resaltada-columna');
            }
        });
      });
        
        
        // Creamos el evento para cerrar la tabla si se pulsa fuera de ella
        document.addEventListener("click", (event) => {
        // Comprobamos si el clic se hizo fuera de la tabla y del botón
        const isClickInsideTabla = tablaTiposEfectividad.contains(event.target);
        const isClickInsideBtn = verEfectividadBtn.contains(event.target);

        // Si el clic se hizo fuera de la tabla y del botón, ocultamos la tabla
        if (!isClickInsideTabla && !isClickInsideBtn) {
          tablaTiposEfectividad.style.display = "none";
          }
        });


        // Creamos los elementos padre columna de la tabla de tipos
        let cabecerasColumna = document.querySelector(".headers");
        for(let i = 0; i < 18; i++){
          const headerTipoColumna = document.createElement("th");
          headerTipoColumna.classList.add("padre", "columna");
          const imagenTipoColumna = document.createElement("img");
          imagenTipoColumna.className = "iconoTabla";
          imagenTipoColumna.src = `${tipos[i].logo}`;
          imagenTipoColumna.dataset.tipo = tipos[i].nombre; // Añadimos un dataset para identificar el tipo
          headerTipoColumna.appendChild(imagenTipoColumna);
          cabecerasColumna.appendChild(headerTipoColumna);
        }

        // Crear las filas
        let body = document.querySelector(".body");
        for (let i = 0; i < tipos.length; i++) {
          const tr = document.createElement("tr");
          
          // Crear y añadir el encabezado de la fila
          const headerTipoFila = document.createElement("th");
          const imagenTipoFila = document.createElement("img");
          headerTipoFila.className = "padre";
          imagenTipoFila.className = "iconoTabla";
          imagenTipoFila.src = tipos[i].logo;
          imagenTipoFila.dataset.tipo = tipos[i].nombre;
          headerTipoFila.appendChild(imagenTipoFila);
          tr.appendChild(headerTipoFila);
          
          // Añadir celdas con datos de efectividad
          for (let j = 0; j < tipos.length; j++) {
            const td = document.createElement("td");
            let efectividad = "-";

            if (tipos[i].efectivo_contra.includes(tipos[j].nombre)) {
              td.className = "muy-eficaz";
              efectividad = "x2";
            } else if (tipos[i].poco_eficaz.includes(tipos[j].nombre)) {
              td.className = "poco-eficaz";
              efectividad = "x0.5";
            } else if (tipos[i].inefectivo_contra && tipos[i].inefectivo_contra.includes(tipos[j].nombre)) {
              td.className = "inefectivo";
              efectividad = "x0";
            }
            
            td.classList.add("celdaVacia");
            td.textContent = efectividad;
            td.dataset.tipo = tipos[j].nombre; // Aquí asignamos el atributo data-tipo
            tr.appendChild(td);
          }
          
          body.appendChild(tr);
        }


      });
  });


