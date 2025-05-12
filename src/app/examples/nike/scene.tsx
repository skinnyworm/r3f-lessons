"use client";

import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Shoe } from "./shoe";
import { Selector } from "./selector";

export const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 40 }}>
      <ambientLight intensity={0.5} />
      <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, -5]} castShadow />
      <Environment preset="city" background blur={1} />

      <ContactShadows resolution={512} position={[0, -0.8, 0]} opacity={1} scale={10} far={0.8} />
      <Selector>
        <Shoe rotation={[0.3, Math.PI / 1.6, 0]} />
      </Selector>
    </Canvas>
  );
};
