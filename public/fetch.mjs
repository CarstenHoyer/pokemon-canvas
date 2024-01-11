import fetch from "node-fetch";
import fs from "fs";
import path from "path";

async function getRandomPokemons(n = 10) {
  const totalPokemons = 898; // Total number of Pokémon as of the latest generation
  const pokemons = [];

  for (let i = 0; i < n; i++) {
    const randomId = Math.floor(Math.random() * totalPokemons) + 1;
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomId}`
      );
      const data = await response.json();
      pokemons.push(data);
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    }
  }

  return pokemons;
}

async function downloadImage(url, filepath) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  fs.writeFileSync(filepath, buffer);
}

async function downloadPokemons(n = 10, directory = "./pokemon_images") {
  const pokemons = await getRandomPokemons(n);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  pokemons.forEach((pokemon, index) => {
    const imageUrl = pokemon.sprites.other.home.front_default;
    const filename = path.join(directory, `${index}.png`);
    downloadImage(imageUrl, filename)
      .then(() => console.log(`Downloaded Pokémon ${index} image`))
      .catch((error) =>
        console.error(`Error downloading image for Pokémon ${index}:`, error)
      );
  });
}

// Change the number of Pokémons and directory as needed
downloadPokemons(100, "./pokemon_images");
