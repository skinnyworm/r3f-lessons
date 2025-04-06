"use client";

import {
  KeyboardControls,
  KeyboardControlsEntry,
  OrbitControls,
  useHelper,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { RefObject, Suspense, useRef } from "react";
import * as THREE from "three";
import { Block } from "./block";
import { Floor } from "./floor";
import { Kicker } from "./kicker";

const controlMap: KeyboardControlsEntry[] = [
  { name: "move", keys: ["W", "A", "S", "D"] },
  { name: "jump", keys: ["Space"] },
  { name: "reset", keys: ["R"] },
];

export function Board() {
  return (
    <KeyboardControls map={controlMap}>
      <Canvas
        shadows
        camera={{ fov: 30, position: [10, 10, 10] }}
        shadow-map={[256, 256]}
      >
        <color attach="background" args={["#87CEEB"]} />
        <Suspense>
          <Scene />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}

const Scene = () => {
  const dlRef = useRef<THREE.DirectionalLight>(null);
  useHelper(
    dlRef as RefObject<THREE.Object3D>,
    THREE.DirectionalLightHelper,
    1,
    "red"
  );
  return (
    <Physics debug>
      <ambientLight intensity={0.5} />
      <directionalLight
        ref={dlRef}
        position={[-10, 10, 10]}
        intensity={4}
        castShadow
      />
      <OrbitControls />
      <Block />
      <Kicker />
      <Floor />
      {/* <Helper type={THREE.DirectionalLightHelper} args={[1, "red"]} /> */}
    </Physics>
  );
};
