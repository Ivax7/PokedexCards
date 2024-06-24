// Variables para los elementos HTML
const section = document.querySelector(".bio");
const bio2 = document.querySelector(".bio2");
const article = document.querySelector(".article");
const right = document.querySelector(".right");
const left = document.querySelector(".left");
const fondo = document.querySelector('.overlay');
const pokemonInput = document.getElementById('pokemonInput');
const searchButton = document.querySelector('.searchButton');
const suggestionsContainer = document.getElementById('suggestions');


let currentIndex = 0; // índice actual del array
let pokemonList = [];

// URL base de la PokeAPI
const apiUrl = 'https://pokeapi.co/api/v2';

// Función para obtener la lista de nombres de Pokémon desde la PokeAPI
const getPokemonList = async () => {
  try {
    const response = await fetch(`${apiUrl}/pokemon?limit=2000`); // Obtener hasta 2000 Pokémon
    if (!response.ok) {
      throw new Error('No se pudo obtener la lista de Pokémon');
    }
    const data = await response.json();
    return data.results.map(pokemon => pokemon.name); // Obtener solo los nombres de los Pokémon
  } catch (error) {
    console.error('Error al obtener la lista de Pokémon:', error);
    throw error;
  }
};

// Cargar la lista de Pokémon al iniciar la aplicación
const initializeApp = async () => {
  try {
    pokemonList = await getPokemonList();
    console.log('Lista de Pokémon obtenida:', pokemonList);
    loadPokemonData(pokemonList[currentIndex]);
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
  }
};

// Llamar a initializeApp para iniciar la aplicación
initializeApp();

// Función para obtener datos de un Pokémon por nombre
const getPokemonData = async (pokemonName) => {
  try {
    const response = await fetch(`${apiUrl}/pokemon/${pokemonName}`);
    if (!response.ok) {
      throw new Error('No se pudo obtener la información del Pokémon');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener datos del Pokémon:', error);
  }
};

// Función para cargar la información de un Pokémon específico
const loadPokemonData = async (pokemonName) => {
  try {
    const pokemonData = await getPokemonData(pokemonName);
    displayPokemonData(pokemonData);
  } catch (error) {
    console.error('Error al cargar los datos del Pokémon:', error);
  }
};

const createTypeEffectivenessTable = (tipos, tiposPokemon) => {
  // Verificar que tipos esté definido y no sea nulo
  if (!tipos || !Array.isArray(tipos)) {
    console.error('El parámetro tipos no es válido:', tipos);
    return;
  }
  
  // Seleccionar el tbody y eliminar sus hijos si existen
  const tbody = document.querySelector('.grid-container tbody');
  if (!tbody) {
    console.error('No se encontró el elemento tbody en el DOM.');
    return;
  }
  tbody.innerHTML = ''; // Limpiar las filas existentes

  // Crear fila de cabeceras de columnas
  const headerRow = document.createElement('tr');
  headerRow.className = 'headers';
  // Primera celda vacía (esquina superior izquierda)
  const emptyHeaderCell = document.createElement('th');
  emptyHeaderCell.className = 'padre esquina';
  emptyHeaderCell.textContent = 'X';
  headerRow.appendChild(emptyHeaderCell);

// Crear las cabeceras de las columnas con imágenes de tipos
tipos.forEach(tipo => {
  const columnHeaderCell = document.createElement('th');
  columnHeaderCell.className = 'padre columna';
  
  const typeImage = document.createElement('img');
  typeImage.className = 'iconoTabla';
  typeImage.src = tipo.logo;
  typeImage.alt = tipo.nombre;
  typeImage.dataset.tipo = tipo.nombre; // Añadir atributo data-tipo al elemento typeImage
  
  columnHeaderCell.appendChild(typeImage);
  headerRow.appendChild(columnHeaderCell);
});

  
  tbody.appendChild(headerRow);

  // Crear y añadir las filas con datos de efectividad
  for (let i = 0; i < tipos.length; i++) {
    const row = document.createElement('tr');

    // Añadir encabezado de fila con imagen de tipo
    const headerCell = document.createElement('th');
    headerCell.className = 'padre';
    const typeImage = document.createElement('img');
    typeImage.className = 'iconoTabla';
    typeImage.src = tipos[i].logo;
    typeImage.alt = tipos[i].nombre;
    typeImage.dataset.tipo = tipos[i].nombre; // Añadir atributo data-tipo al elemento typeImage

    headerCell.appendChild(typeImage);
    row.appendChild(headerCell);

    // Añadir celdas con datos de efectividad
    for (let j = 0; j < tipos.length; j++) {
      const cell = document.createElement('td');
      cell.classList.add('celdaVacia');
      let efectividad = '-'; // Valor predeterminado si no se especifica efectividad
      if (tipos[i].efectivo_contra.includes(tipos[j].nombre)) {
        cell.classList.add('muy-eficaz');
        efectividad = 'x2';
      } else if (tipos[i].poco_eficaz.includes(tipos[j].nombre)) {
        cell.classList.add('poco-eficaz');
        efectividad = 'x0.5';
      } else if (tipos[i].inefectivo_contra && tipos[i].inefectivo_contra.includes(tipos[j].nombre)) {
        cell.classList.add('inefectivo');
        efectividad = 'x0';
      }

      cell.textContent = efectividad;
      cell.dataset.tipo = tipos[j].nombre; // Añadir atributo data-tipo para identificar el tipo
      row.appendChild(cell);
    }

    tbody.appendChild(row);
  }

  // Mostrar la tabla si estaba oculta
  const tablaTiposEfectividad = document.querySelector('.tablaTiposEfectividad');
  if (tablaTiposEfectividad) {
    tablaTiposEfectividad.style.display = 'block';
  } else {
    console.error('No se encontró el elemento .tablaTiposEfectividad en el DOM.');
    return;
  }
  // Llamar a la función para resaltar las celdas y filas correspondientes al tipo del Pokémon actual
  highlightCellsAndRows(tiposPokemon);

};

const highlightCellsAndRows = (tiposPokemon) => {
  // Resaltar las celdas correspondientes al tipo del Pokémon actual
  const celdasVacias = document.querySelectorAll('.celdaVacia');
  celdasVacias.forEach(celda => {
    const tipo = celda.dataset.tipo;
    if (tiposPokemon.includes(tipo)) {
      celda.classList.add('resaltada');
    } else {
      celda.classList.remove('resaltada');
    }
  });

  // Obtener todas las filas de la tabla
  const filas = document.querySelectorAll('.grid-container tbody tr');

  filas.forEach(fila => {
    // Obtener el tipo de la fila desde el encabezado correspondiente
    const tipoFila = fila.querySelector('th.padre img.iconoTabla')?.dataset.tipo;

    // Verificar si tiposPokemon incluye el tipoFila actual
    if (tiposPokemon.includes(tipoFila)) {
      // Obtener todas las celdas vacías (td.celdaVacia) dentro de la fila actual
      const celdasVacias = fila.querySelectorAll('.celdaVacia');

      // Iterar sobre las celdas vacías y añadir la clase resaltada-fila
      celdasVacias.forEach(celda => {
        celda.classList.add('resaltada-fila');
      });
    } else {
      // Si el tipo de la fila no está en tiposPokemon, remover la clase resaltada-fila de todas las celdas vacías
      const celdasVacias = fila.querySelectorAll('.celdaVacia');

      // Iterar sobre las celdas vacías y remover la clase resaltada-fila
      celdasVacias.forEach(celda => {
        celda.classList.remove('resaltada-fila');
      });
    }
  });

    // Resaltar los iconos de tipo correspondientes al tipo del Pokémon actual
    const iconosTabla = document.querySelectorAll('.iconoTabla');
    iconosTabla.forEach(icono => {
      const tipoIcono = icono.dataset.tipo;
      if (tiposPokemon.includes(tipoIcono)) {
        icono.style.filter = 'brightness(1)'; // Ajustar el brillo a normal
      } else {
        icono.style.filter = 'brightness(0.7)'; // Ajustar el brillo a reducido
      }
    });

};




const displayPokemonData = async (pokemon) => {
  try {
    // Limpiar el contenido previo de bio2
    bio2.innerHTML = '';

    // Crear elementos necesarios en bio2
    const tablaTipos = document.createElement('button');
    tablaTipos.className = "tablaTipos";
    tablaTipos.textContent = "Type Chart";
    bio2.appendChild(tablaTipos);

    const flechaNvl = document.createElement('div');
    flechaNvl.className = "flechaNvl";
    bio2.appendChild(flechaNvl);

    // Resto del código para mostrar los datos del Pokémon
    if (!pokemon || !pokemon.name || !pokemon.id) {
      console.error('Datos del Pokémon incompletos o incorrectos:', pokemon);
      return;
    }

    article.innerHTML = '';
    section.innerHTML = '';

    const nombre = document.createElement('h2');
    nombre.className = "nombre";
    nombre.textContent = pokemon.name;
    article.appendChild(nombre);

    article.appendChild(section);
    article.appendChild(bio2);

    const imagen = document.createElement('img');
    imagen.className = "gif";
    imagen.src = pokemon.sprites.other['official-artwork'].front_default;
    section.appendChild(imagen);

    const nPokedex = document.createElement('p');
    nPokedex.className = "numeroPokedex";
    nPokedex.textContent = `#${pokemon.id}`;
    section.appendChild(nPokedex);

    const speciesData = await getSpeciesData(pokemon.species.url);
    const evolutionChainUrl = speciesData.evolution_chain.url;
    const evoluciones = await getEvoluciones(evolutionChainUrl);
    
    if (evoluciones.length > 0) {
      const evolucionesContainer = document.createElement('div');
      evolucionesContainer.className = "evoluciones";

      for (const evolucion of evoluciones) {
        const evolucionElement = document.createElement('div');
        evolucionElement.className = "evolucion";

        const evolucionImagen = document.createElement('img');
        evolucionImagen.className = "imagenEvo";
        evolucionImagen.src = evolucion.pokemon.sprites.other['official-artwork'].front_default;
        evolucionImagen.alt = evolucion.pokemon.name;

        if (evolucion.pokemon.name === pokemon.name) {
          evolucionImagen.classList.add('active');
        }

        evolucionImagen.addEventListener('click', () => {
          clearPokemonInfo();
          const evolucionElements = document.querySelectorAll('.imagenEvo');
          evolucionElements.forEach(element => element.classList.remove('active'));
          evolucionImagen.classList.add('active');
          const newIndex = pokemonList.findIndex(name => name === evolucion.pokemon.name);
          if (newIndex !== -1) {
            currentIndex = newIndex;
          }
          loadPokemonData(evolucion.pokemon.name);
        });

        evolucionElement.appendChild(evolucionImagen);

        if (evolucion.nivel !== "Desconocido") {
          const nivelText = document.createElement('p');
          nivelText.className = 'textNvl';
          if (evolucion.nivel === null) {
            nivelText.textContent = `Otro`;
            nivelText.style.left = '-10px';
          } else {
            nivelText.textContent = `${evolucion.nivel}`;
          }
          evolucionElement.appendChild(nivelText);
        }

        evolucionesContainer.appendChild(evolucionElement);
      }

      bio2.appendChild(evolucionesContainer);
    } else {
      console.warn('El Pokémon no tiene evoluciones registradas.');
    }

    const flavorText = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
    if (flavorText) {
      const descripcion = document.createElement('p');
      descripcion.className = "descripcion";
      descripcion.textContent = flavorText.flavor_text;
      section.appendChild(descripcion);
    } else {
      console.warn('No se encontró una descripción para este Pokémon.');
    }

    // Obtener y mostrar tipos del pokemon
    let tipos;
    try {
      const response = await fetch('tablaTipos.json');
      if (!response.ok) {
        throw new Error('No se pudo obtener la tabla de tipos');
      }
      const data = await response.json();
      tipos = data.tipos;
      const containerTipos = document.createElement("div");
      containerTipos.className = "boxTipos";

      pokemon.types.forEach((typeInfo) => {
        const tipo = tipos.find(t => t.nombre.toLowerCase() === typeInfo.type.name.toLowerCase());
        if (tipo) {
          const tipoImg = document.createElement('img');
          tipoImg.className = "tipo";
          tipoImg.src = tipo.logo;
          tipoImg.dataset.tipo = tipo.nombre.toLowerCase();
          containerTipos.appendChild(tipoImg);
          console.log(tipoImg)
        } else {
          console.warn(`No se encontró el logo para el tipo: ${typeInfo.type.name}`);
        }
      });

      article.appendChild(containerTipos);

      // Añadir evento para mostrar la tabla de tipos al hacer clic en el botón
      
      // Obtener los tipos del Pokémon actual
      const tiposPokemon = pokemon.types.map(typeInfo => typeInfo.type.name);

      // Llamar a createTypeEffectivenessTable con tiposPokemon
      
      tablaTipos.addEventListener('click', () => {
        createTypeEffectivenessTable(tipos, tiposPokemon);
        fondo.style.display = 'block'
        });

    } catch (error) {
      console.error('Error al cargar los datos de los tipos:', error);
    }

    // Actualizar el índice al finalizar la carga del Pokémon
    currentIndex = pokemonList.findIndex(name => name === pokemon.name);

  } catch (error) {
    console.error('Error al cargar los datos del Pokémon:', error);
  }



  // Obtener todos los elementos con la clase 'tipo'
  const tipoIconos = document.querySelectorAll('.tipo');
  console.log('Elementos tipo:', tipoIconos);

  const fetchTiposFromJSON = async () => {
    const response = await fetch('tablaTipos.json'); // Ajusta la ruta a tu archivo JSON
    const data = await response.json();
    return data.tipos;
  };
  
  
  // Agregar un event listener de clic a cada icono
  tipoIconos.forEach(icono => {
    icono.addEventListener('click', () => {
      console.log('Icono clicado:', icono);
      updateTipoInfoByElement(icono);
    });
  });

  const updateTipoInfoByElement = async (tipoElemento) => {
    const tipoNombre = tipoElemento.dataset.tipo;
    console.log('Tipo seleccionado:', tipoNombre);

    const tipos = await fetchTiposFromJSON();
    const tipoSeleccionado = tipos.find(tipo => tipo.nombre === tipoNombre);
  
    if (tipoSeleccionado) {
      updateTipoInfo(tipoSeleccionado, tipos);
      document.querySelector('.carta').style.display = "block";
      fondo.style.display = 'block';
      console.log()
    } else {
      console.log("No se encontró ningún tipo con ese nombre.");
    }
  };
  
  const updateTipoInfo = (tipo, tipos) => {
    const tipoSeleccionado = document.querySelector('.tipoSeleccionado');
    const cartaTipo = document.querySelector('.carta-tipo');
    const iconosEfectivo = document.querySelector('.iconos-efectivo');
    const iconosDebilidad = document.querySelector('.iconos-debil');
  
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
        iconoEfectivo.className = "tipoTabla tipo-efectivo";
  
        // Crear imagen del tipo efectivo
        const imgEfectivo = document.createElement('img');
        imgEfectivo.src = tipoInfo.logo;
        iconoEfectivo.appendChild(imgEfectivo);
  
        // Crear texto del tipo efectivo
        const textoEfectivo = document.createElement('span');
        textoEfectivo.className = "etiqueta";
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
        iconoDebil.className = "tipoTabla tipo-debilidad";
  
        // Crear imagen del tipo débil
        const imgDebil = document.createElement('img');
        imgDebil.src = tipoInfo.logo;
        iconoDebil.appendChild(imgDebil);
  
        // Crear texto del tipo débil
        const textoDebil = document.createElement('span');
        textoDebil.className = "etiqueta";
        textoDebil.textContent = tipoInfo.nombre;
        iconoDebil.appendChild(textoDebil);
  
        // Agregar etiqueta de tipo débil a la carta
        iconosDebilidad.appendChild(iconoDebil);
      }
    });
  };

};


// Función para obtener datos de la especie del Pokémon
const getSpeciesData = async (speciesUrl) => {
  try {
    const response = await fetch(speciesUrl);
    if (!response.ok) {
      throw new Error('No se pudo obtener la información de la especie del Pokémon');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener datos de la especie del Pokémon:', error);
    throw error; // Re-lanzar el error para que pueda ser capturado externamente
  }
};

// Función para obtener la cadena evolutiva de un Pokémon
const getEvoluciones = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('No se pudo obtener la cadena evolutiva del Pokémon');
    }
    const data = await response.json();
    const evoluciones = [];

    // Función recursiva para recorrer la cadena evolutiva
    const getEvolucionesRecursivo = async (chain) => {
      const evolucionResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${chain.species.name}`);
      const evolucionData = await evolucionResponse.json();

      // Obtener los detalles de evolución, que incluyen el nivel mínimo (min_level)
      const evolutionDetails = chain.evolution_details;
      const nivelEvolucion = evolutionDetails.length > 0 ? evolutionDetails[0].min_level : 'Desconocido';

      // Guardar la información del Pokémon y el nivel de evolución
      const evolucionConNivel = {
        pokemon: evolucionData,
        nivel: nivelEvolucion
      };
      evoluciones.push(evolucionConNivel);

      for (const evo of chain.evolves_to) {
        await getEvolucionesRecursivo(evo);
      }
    };

    await getEvolucionesRecursivo(data.chain);

    return evoluciones;
  } catch (error) {
    console.error('Error al obtener la cadena evolutiva del Pokémon:', error);
    throw error;
  }
  
};

// Función para limpiar la información del Pokémon de la interfaz
const clearPokemonInfo = () => {
  section.innerHTML = '';
  bio2.innerHTML = '';
};


// Controladores de eventos para la navegación entre Pokémon
right.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % pokemonList.length;
  loadPokemonData(pokemonList[currentIndex]);
});

left.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + pokemonList.length) % pokemonList.length;
  loadPokemonData(pokemonList[currentIndex]);
});

function cerrarTablaAlClicFuera(event) {
  const tablaTipos = document.querySelector('.tablaTipos');
  const carta = document.querySelector('.carta');
  const tablaTiposEfectividad = document.querySelector('.tablaTiposEfectividad');
  const target = event.target;
  // Verificar si se hizo clic fuera de tablaTiposEfectividad y no dentro de ella ni en tablaTipos
  if (!tablaTiposEfectividad.contains(target) && !tablaTipos.contains(target) && !carta.contains(target)) {
    tablaTiposEfectividad.style.display = 'none';
    fondo.style.display = 'none';
    carta.style.display = 'none';
  }
}

// Añadir evento para cerrar la tabla al hacer clic fuera de ella
document.addEventListener('click', cerrarTablaAlClicFuera);


// AGREGAR EVENTO AL BOTÓN DE BÚSQUEDA //
searchButton.addEventListener('click', async () => {
  const searchTerm = pokemonInput.value.trim().toLowerCase();
  await handlePokemonSearch(searchTerm);
});

const handlePokemonSearch = async (searchTerm) => {
  if (searchTerm === '') {
    console.log('Por favor, ingresa un nombre o ID de Pokémon válido.');
    return;
  }

  try {
    const pokemonData = await getPokemonData(searchTerm);
    if (pokemonData) {
      clearPokemonInfo(); // Limpiar la información previa del Pokémon
      loadPokemonData(pokemonData.name); // crear la carta con el nombre del pokemon
    } else {
      console.log(`No se encontró ningún Pokémon con el nombre o ID: ${searchTerm}`);
    }
  } catch (error) {
    console.error('Error al buscar Pokémon:', error);
  }
};

// SUGERENCIAS DE POKEMON // 
pokemonInput.addEventListener('input', async () => {
  const searchTerm = pokemonInput.value.trim().toLowerCase();

  if (searchTerm === '') {
    suggestionsContainer.innerHTML = ''; // Limpiar sugerencias si no hay término de búsqueda
    return;
  }

  try {
    const suggestions = await getPokemonSuggestions(searchTerm);
    if (suggestions.length > 0) {
      renderSuggestions(suggestions);
    } else {
      suggestionsContainer.innerHTML = ''
    }
  } catch (error) {
    console.error('Error al obtener sugerencias de Pokémon:', error);
    suggestionsContainer.innerHTML = '<p>Error al cargar sugerencias</p>';
  }
});

const getPokemonSuggestions = async (searchTerm) => {
  try {
    const response = await fetch(`${apiUrl}/pokemon?limit=2000`); // Obtener hasta 1000 Pokémon
    if (!response.ok) {
      throw new Error('No se pudo obtener la lista de Pokémon');
    }
    const data = await response.json();
    const pokemonNames = data.results.map(pokemon => pokemon.name);

    const filteredSuggestions = pokemonNames.filter(name => name.startsWith(searchTerm));
    return filteredSuggestions;
  } catch (error) {
    console.error('Error al obtener sugerencias de Pokémon:', error);
    return [];
  }
};

const renderSuggestions = (suggestions) => {
  const htmlSuggestions = suggestions.map(suggestion => `<div class="suggestion">${suggestion}</div>`).join('');
  suggestionsContainer.innerHTML = htmlSuggestions;

  // Agregar evento click a cada sugerencia
  const suggestionElements = document.querySelectorAll('.suggestion');
  suggestionElements.forEach(suggestion => {
    suggestion.addEventListener('click', async () => {
      pokemonInput.value = ''; // limpiamos el input
      suggestionsContainer.innerHTML = ''; // Limpiar sugerencias después de seleccionar una
      await handlePokemonSearch(suggestion.textContent);
    });
  });
};
// Agrega un evento de clic al botón de búsqueda
searchButton.addEventListener('click', () => {
  // Limpia el contenido del input
  pokemonInput.value = '';
  suggestionsContainer.innerHTML = ''; // Limpiar sugerencias después de seleccionar una
});