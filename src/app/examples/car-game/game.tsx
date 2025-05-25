"use client";

import { Environment, KeyboardControls, KeyboardControlsEntry, OrbitControls } from "@react-three/drei";
import { Canvas, Vector3 } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { CarControl } from "./car-control";

const keymap: KeyboardControlsEntry<string>[] = [
  { name: "left", keys: ["a", "ArrowLeft"] },
  { name: "right", keys: ["d", "ArrowRight"] },
  { name: "forward", keys: ["w", "ArrowUp"] },
  { name: "backward", keys: ["s", "ArrowDown"] },
];

export function Game() {
  return (
    <KeyboardControls map={keymap}>
      <Canvas shadows camera={{ position: [4.2, 1.5, 7.5], fov: 45, near: 0.5 }}>
        <color attach="background" args={["#333"]} />
        <ambientLight intensity={0.1} />
        <directionalLight
          position={[4, 15, -4]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Experience />
        <Environment preset="city" background={false} environmentIntensity={0.2} />
      </Canvas>
    </KeyboardControls>
  );
}

function Experience() {
  return (
    <Physics>
      <CarControl />
      <Building position={[3, 0, 3]} />
      <Building position={[-3, 0, 3]} />
      <Ground />
      <OrbitControls />
    </Physics>
  );
}

const Ground = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh position={[0, -0.1, 0]} rotation={[0, Math.PI / 4, 0]} receiveShadow>
        <boxGeometry args={[50, 0.2, 50]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </RigidBody>
  );
};

const Building = ({ position }: { position: Vector3 }) => {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[2, 6, 2]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </RigidBody>
  );
};
