const pokedex = document.querySelector('.pokemons-list');
const typesContainer = document.querySelector('.types-types');
const numberOfPokemons = document.querySelector('.number-of-pokemons-number');
const pokemonInput = document.querySelector('.search__input');
const suggestionsContainer = document.querySelector('.suggestions-container');
const searchButton = document.querySelector('.search__button');
let pokeData = [];
let tiposData = [];
let selectedTypes = []; // Lista de tipos seleccionados
let selectedGeneration = 1; // Generación seleccionada

const generations = {
  1: { start: 1, end: 151 },
  2: { start: 152, end: 251 },
  3: { start: 252, end: 386 },
  4: { start: 387, end: 493 },
  5: { start: 494, end: 649 },
  6: { start: 650, end: 721 },
  7: { start: 722, end: 809 },
  8: { start: 810, end: 898 },
  9: { start: 899, end: 1010 },
  10: { start: 1011, end: 1110 }
};

const saveToCache = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const loadFromCache = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const fetchPokemonBatch = async (start, end) => {
  const cacheKey = `pokemon_${start}_${end}`;
  let pokemonData = loadFromCache(cacheKey);
  if (!pokemonData) {
    try {
      const pokemonPromises = [];
      for (let id = start; id <= end; id++) {
        pokemonPromises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()));
      }
      pokemonData = await Promise.all(pokemonPromises);
      
      // Simplificar datos antes de guardar en caché
      const simplifiedData = pokemonData.map(pokemon => ({
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types,
        sprites: pokemon.sprites ? pokemon.sprites.front_default : null // Asegurar que siempre se guarda el sprite
      }));
      saveToCache(cacheKey, simplifiedData); // Guardar datos simplificados en el caché
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  pokeData = []; // Limpiar datos antiguos
  pokeData.push(...pokemonData);
  filterAndDisplayPokemon();
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('../../SingleCards/tablaTipos.json');
    const tiposJson = await response.json();
    tiposData = tiposJson.tipos;

    tiposJson.tipos.forEach(type => {
      const img = document.createElement('img');
      img.classList.add('types-img', type.nombre);
      img.src = type.logo;
      img.alt = type.nombre;
      // Manejar el evento de click en los tipos
      img.addEventListener('click', () => {
        img.classList.toggle('active'); // Añadimos una clase
        toggleSelectedType(type.nombre); // Lógica del manejo de types
        filterAndDisplayPokemon();
      });
      typesContainer.appendChild(img);
    });

    await fetchPokemonBatch(generations[selectedGeneration].start, generations[selectedGeneration].end);
  } catch (error) {
    console.error('Error fetching or parsing JSON:', error);
  }
});

const toggleSelectedType = (type) => {
  const index = selectedTypes.indexOf(type);
  if (index === -1) { // Lo añade al array
    selectedTypes.push(type);
  } else { // Lo elimina si lo encuentra
    selectedTypes.splice(index, 1);
  }
};

const displayPokemon = (pokemonArray) => {
  pokedex.innerHTML = ''; // Limpiar la lista de Pokémon
  pokemonArray.forEach(pokemonData => {
    updateInfo(pokemonData);
  });
  
  // Actualizar el número de Pokémones mostrados
  numberOfPokemons.textContent = pokemonArray.length;
};

const updateInfo = (pokemonData) => {
  const typesImages = pokemonData.types.map(type => {
    const typeInfo = tiposData.find(t => t.nombre === type.type.name);
    if (typeInfo) {
      return `<img class="pokemons-types pokemons-types-${type.type.name}" 
                    src="${typeInfo.logo}" 
                    alt="${type.type.name}" 
                    data-type="${type.type.name}">`;
    }
    return '';
  }).join('');

  // Determinar qué URL de sprite utilizar
  let spriteUrl = '';
  if (pokemonData.sprites && pokemonData.sprites.front_default) {
    spriteUrl = pokemonData.sprites.front_default; // Para generaciones 9 y 10
  } else if (pokemonData.sprites) {
    spriteUrl = pokemonData.sprites; // Para generaciones 1-8 (siempre y cuando exista)
  }

  pokedex.innerHTML += `
    <section class="pokemons-container">
      <div class="pokemons-container-header">
        <p class="pokemons-pokedex-number">#${pokemonData.id}</p>
        <h3 class="pokemons-name">${pokemonData.name}</h3>
        ${typesImages}
      </div>
      <div class="image-container">
        <img class="pokemons-image" 
          src="${spriteUrl}" 
          alt="${pokemonData.name}">
      </div>
    </section>
  `;
};

const filterAndDisplayPokemon = () => {
  let filteredPokemon = pokeData;

  if (selectedTypes.length > 0) {
    filteredPokemon = filteredPokemon.filter(pokemon =>
      selectedTypes.every(type => pokemon.types.some(pokeType => pokeType.type.name === type))
    );
  }

  displayPokemon(filteredPokemon);
};

const filterByGeneration = async (generation) => {
  selectedGeneration = generation;
  await fetchPokemonBatch(generations[generation].start, generations[generation].end);
};

document.addEventListener('DOMContentLoaded', () => {
  for (let gen = 1; gen <= 10; gen++) {
    document.querySelector(`.gen${gen}`).addEventListener('click', () => filterByGeneration(gen));
  }
  document.querySelector('.allGenerations').addEventListener('click', () => {
    selectedGeneration = null;
    filterAndDisplayPokemon();
  });
});

// SUGERENCIAS DE POKEMON
pokemonInput.addEventListener('input', async () => {
  const searchTerm = pokemonInput.value.trim().toLowerCase();

  if (searchTerm === '') {
    suggestionsContainer.innerHTML = ''; // Limpiar sugerencias si no hay término de búsqueda
    return;
  }

  try {
    const suggestions = await getPokemonSuggestions(searchTerm); // pasamos a otra funcion el nombre que estamos escribiendo
    if (suggestions.length > 0) {
      renderSuggestions(suggestions);
    } else {
      suggestionsContainer.innerHTML = '';
    }
  } catch (error) {
    console.error('Error al obtener sugerencias de Pokémon:', error);
    suggestionsContainer.innerHTML = '<p>Error al cargar sugerencias</p>';
  }
});

const getPokemonSuggestions = async (searchTerm) => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000'); // Obtener hasta 2000 Pokémon
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

const handlePokemonSearch = async (pokemonName) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    if (!response.ok) {
      throw new Error('No se pudo obtener la información del Pokémon');
    }
    const pokemonData = await response.json();
    displayPokemon([pokemonData]); // Mostrar el Pokémon seleccionado
  } catch (error) {
    console.error('Error al obtener la información del Pokémon:', error);
  }
};

// Función para manejar la búsqueda
const handleSearch = async () => {
  const searchTerm = pokemonInput.value.trim().toLowerCase(); // recoge el valor de lo escito
  if (searchTerm) {
    suggestionsContainer.innerHTML = ''; // Limpiar las sugerencias
    await handlePokemonSearch(searchTerm); // Llama a la función de buscar los pokemon
    pokemonInput.value = ''; // limpiamos el input
  }
};

// Evento para el botón de búsqueda
searchButton.addEventListener('click', handleSearch);

// Evento para la tecla "Enter" en el input
pokemonInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
});
