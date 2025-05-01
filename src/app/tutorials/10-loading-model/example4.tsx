"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Box, OrbitControls, useHelper } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { RefObject, Suspense, useRef } from "react";
import * as THREE from "three";
import { Fox } from "./components/fox";
import { Hamburger } from "./components/hamburger";
import { PlaceHolder } from "./components/placeholder";
import { Radar } from "./components/radar";

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
        intensity={6}
        shadow-normalBias={0.04}
        castShadow
      />

      <Suspense fallback={<PlaceHolder />}>
        <Radar />
      </Suspense>

      <axesHelper args={[3]} />
    </>
  );
};
