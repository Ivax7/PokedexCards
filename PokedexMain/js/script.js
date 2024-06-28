const pokedex = document.querySelector('.pokemons-list'); // Seleccionar el contenedor de la lista de Pokémon
const typesContainer = document.querySelector('.types-types');

// Lista de pokemons
let pokeData = []; // Array para almacenar todos los datos de los Pokémon
let tiposData = []; // Variable para almacenar los datos del JSON externo

const fetchPokemon = async () => {
  try {
    // Obtener los datos del JSON externo
    const tablaTipos = await fetch('../../SingleCards/tablaTipos.json');
    if (!tablaTipos.ok) {
      throw new Error(`Error al cargar el archivo JSON de tipos. Status: ${tablaTipos.status}`);
    }
    tiposData = await tablaTipos.json();

    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151'); // Limitamos a los primeros 151 Pokémon
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const pokemonList = data.results;

    // Iterar sobre la lista de Pokémon y obtener la información de cada uno
    for (let i = 0; i < pokemonList.length; i++) {
      const pokemonUrl = pokemonList[i].url;
      const pokemonResponse = await fetch(pokemonUrl);
      if (!pokemonResponse.ok) {
        throw new Error(`HTTP error! Status: ${pokemonResponse.status}`);
      }
      const pokemonData = await pokemonResponse.json();
      pokeData.push(pokemonData);

      // Llamar a la función updateInfo para agregar cada Pokémon a la pokedex
      updateInfo(pokemonData);
    }

    console.log('Datos de todos los Pokémon:', pokeData);

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Llamar a la función para iniciar la obtención de datos
fetchPokemon();

// FUNCIÓN PARA INSERTAR DATOS HTML
const updateInfo = (pokemonData) => {
// Encontrar los tipos correspondientes en tiposData y obtener el logo
const typesImages = pokemonData.types.map(type => {
    const typeInfo = tiposData.tipos.find(t => t.nombre === type.type.name);
    if (typeInfo) {
      return `<img class="pokemons-types pokemons-types-${type.type.name}" 
                    src="${typeInfo.logo}" 
                    alt="${type.type.name}" 
                    dataset="${type.type.name}">`;
    }
    return ''; // Si no se encuentra el tipo, devolver cadena vacía
  }).join('');

  // Crear el HTML para cada Pokémon y agregarlo al innerHTML de pokedex
  pokedex.innerHTML += `
    <section class="pokemons-container">
      <div class="pokemons-container-header">
        <p class="pokemons-pokedex-number">#${pokemonData.id}</p>
        <h3 class="pokemons-name">${pokemonData.name}</h3>
        ${typesImages}
      </div>
      <div class="image-container">
        <img class="pokemons-image" 
          src="${pokemonData.sprites.front_default}" 
          alt="${pokemonData.name}">
      </div>
    </section>
  `;
};

// INYECCIÓN DE LOS LOGOS TIPOS
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('../../SingleCards/tablaTipos.json');
    const tiposJson = await response.json();

    const typesContainer = document.querySelector('.types-types');

    // Iterar sobre los datos de tipos y añadir las imágenes
    tiposJson.tipos.forEach(type => {
      const img = document.createElement('img');
      img.classList.add('types-img', type.nombre);
      img.src = type.logo;
      img.alt = type.nombre;
      typesContainer.appendChild(img);
    });
  } catch (error) {
    console.error('Error fetching or parsing JSON:', error);
  }
});