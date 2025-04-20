"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Box, OrbitControls, useHelper } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { RefObject, Suspense, useRef } from "react";
import * as THREE from "three";
import { Fox } from "./components/fox";
import { Hamburger } from "./components/hamburger";
import { PlaceHolder } from "./components/placeholder";

export default function Example3() {
  return (
    <AspectRatio ratio={16 / 9} className="bg-muted">
      <Canvas camera={{ position: [-5, 5, 5], fov: 45 }} shadows>
        <color attach="background" args={["#000"]} />
        <Scene />
      </Canvas>
    </AspectRatio>
  );
}

export const Scene = () => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  useHelper(directionalLightRef as RefObject<THREE.DirectionalLight>, THREE.DirectionalLightHelper, 1, "white");
  return (
    <>
      <OrbitControls makeDefault={true} />
      <ambientLight intensity={0.5} />
      <directionalLight
        ref={directionalLightRef}
        position={[3, 3, 3]}
        intensity={2}
        shadow-normalBias={0.04}
        castShadow
      />

      <Suspense fallback={<PlaceHolder />}>
        <Fox />
        <Hamburger scale={0.05} position={[2.5, 0, 2.5]} />
      </Suspense>

      <Box args={[10, 0.5, 10]} position={[0, -0.25, 0]} rotation={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="white" />
      </Box>
      <axesHelper args={[3]} />
    </>
  );
};
