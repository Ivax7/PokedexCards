const pokedex = document.querySelector('.pokemons-list');
const typesContainer = document.querySelector('.types-types');
const numberOfPokemons = document.querySelector('.number-of-pokemons-number');
let pokeData = [];
let tiposData = [];

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
  displayPokemon(pokemonData);
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
      typesContainer.appendChild(img);
    });

    await fetchPokemonBatch(1, 151); // Cargar la primera generación por defecto
  } catch (error) {
    console.error('Error fetching or parsing JSON:', error);
  }
});

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

const filterByGeneration = async (generation) => {
  const { start, end } = generations[generation];
  await fetchPokemonBatch(start, end);
};

document.addEventListener('DOMContentLoaded', () => {
  for (let gen = 1; gen <= 10; gen++) {
    document.querySelector(`.gen${gen}`).addEventListener('click', () => filterByGeneration(gen));
  }
  document.querySelector('.allGenerations').addEventListener('click', () => displayPokemon(pokeData));
});
