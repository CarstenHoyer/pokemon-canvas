import { OrbitControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { MOUSE, TextureLoader } from "three";

// async function getRandomPokemons(n = 10) {
//   const totalPokemons = 898; // Total number of Pokémon as of the latest generation
//   const pokemons = [];

//   for (let i = 0; i < n; i++) {
//     // Generate a random Pokémon ID
//     const randomId = Math.floor(Math.random() * totalPokemons) + 1;

//     try {
//       const response = await fetch(
//         `https://pokeapi.co/api/v2/pokemon/${randomId}`
//       );
//       const data = await response.json();
//       pokemons.push(data);
//     } catch (error) {
//       console.error("Error fetching Pokémon:", error);
//     }
//   }

//   return pokemons;
// }

function Image({
  img,
  position,
}: {
  img: string;
  position: [number, number, number];
}) {
  const texture = useLoader(TextureLoader, img);
  return (
    <mesh position={position}>
      <planeGeometry attach="geometry" args={[3, 3]} />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
}

export const Scene = () => {
  const controlsRef = useRef<any>();
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      //   const data = await getRandomPokemons(100);
      //   const imgs: string[] = data.map(
      //     (pokemon) => pokemon.sprites.other.home.front_default
      //   );
      //   setData(imgs);
      // const promises = [];
      // for (let i = 0; i < 100; i++) {
      //   promises.push(loadImage(i));
      // }

      // const loadedImages = await Promise.all(promises);
      setImages([...Array(100).keys()].map((i) => `/pokemon_images/${i}.png`));
    })();
  }, []);

  useEffect(() => {
    controlsRef.current.mouseButtons = {
      LEFT: MOUSE.PAN,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.ROTATE,
    };
  }, []);

  return (
    <>
      <OrbitControls ref={controlsRef} />
      {images.length
        ? [...Array(10).keys()].map((x, ix) => {
            return [...Array(10).keys()].map((y, iy) => {
              return (
                <Image
                  key={ix * iy}
                  img={images[ix + ix * iy]}
                  position={[4 * ix - 20, 4 * iy - 20, 0]}
                />
              );
            });
          })
        : null}
    </>
  );
};
