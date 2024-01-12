import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { createNoise2D } from "simplex-noise";
import { MOUSE, TOUCH } from "three";

const CameraNoisePanner = ({ intensity = 1, speed = 1 }) => {
  const [directionX, setDirectionX] = useState(1); // 1 for forward, -1 for backward
  const [directionY, setDirectionY] = useState(1);
  const controlsRef = useRef<any>();
  const { camera } = useThree();
  const noise = createNoise2D();
  let time = 0;

  useEffect(() => {
    controlsRef.current.mouseButtons = {
      LEFT: MOUSE.PAN,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.ROTATE,
    };
    controlsRef.current.touches = {
      ONE: TOUCH.PAN,
      TWO: TOUCH.DOLLY_ROTATE,
    };
  }, []);

  useFrame((state, delta) => {
    //
    time += delta * speed;

    const freq = 100.5; // Controls the range of movement
    const amp = 0.005;

    // Scale the input to the noise function by the frequency
    const noiseX = noise(time * freq, 0) * amp * directionX;
    const noiseY = noise(0, time * freq) * amp * directionY;

    // Define bounds
    const minX = -10;
    const maxX = 10;
    const minY = -10;
    const maxY = 10;

    // Update direction based on bounds
    if (noiseX >= maxX || noiseX <= minX) {
      setDirectionX(directionX * -1);
    }
    if (noiseY >= maxY || noiseY <= minY) {
      setDirectionY(directionY * -1);
    }

    // Update camera position or target
    camera.position.x += noiseX;
    camera.position.y += noiseY;
    controlsRef.current.target.x += noiseX;
    controlsRef.current.target.y += noiseY;
    controlsRef.current.update();

    // Update the camera's matrices
    camera.updateMatrixWorld();
  });

  return <OrbitControls ref={controlsRef} />;
};

export default CameraNoisePanner;
