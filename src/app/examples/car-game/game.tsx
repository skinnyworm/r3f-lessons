"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Car } from "./car";
import {
  Environment,
  KeyboardControls,
  KeyboardControlsEntry,
  OrbitControls,
  useKeyboardControls,
} from "@react-three/drei";
import { euler, Physics, quat, RapierRigidBody, RigidBody, vec3 } from "@react-three/rapier";
import { useControls } from "leva";
import { useRef } from "react";

const keymap: KeyboardControlsEntry<string>[] = [
  { name: "left", keys: ["a", "ArrowLeft"] },
  { name: "right", keys: ["d", "ArrowRight"] },
];

export function Game() {
  return (
    <KeyboardControls map={keymap}>
      <Canvas shadows camera={{ position: [4.2, 1.5, 7.5], fov: 45, near: 0.5 }}>
        <color attach="background" args={["#333"]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[0, 10, 0]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Experience />
      </Canvas>
    </KeyboardControls>
  );
}

function Experience() {
  return (
    <Physics>
      <CarControl />
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

const CarControl = () => {
  const rb = useRef<RapierRigidBody>(null);
  const [, get] = useKeyboardControls();

  const { rotationSpeed, carSpeed } = useControls({
    carSpeed: {
      value: 3,
      min: -20,
      max: 20,
      step: 0.1,
    },
    rotationSpeed: {
      value: 3,
      min: 0,
      max: 10,
      step: 0.01,
    },
  });

  useFrame((state, delta) => {
    if (!rb.current) return;

    const { left, right } = get();
    const dir = Number(left) - Number(right);

    // angleVelocity

    const angleVelocity = rb.current.angvel();
    const angle = Math.PI * (90 / 180);
    angleVelocity.y = -dir * Math.sin(angle) * rotationSpeed;

    const rotation = rb.current.rotation();
    const impulse = vec3({
      x: 0,
      y: 0,
      z: carSpeed * delta * -1,
    });
    const eulerRot = euler().setFromQuaternion(quat(rotation));
    impulse.applyEuler(eulerRot);

    rb.current.applyImpulse(impulse, true);
    rb.current.setAngvel(angleVelocity, true);
  });

  return (
    <RigidBody ref={rb} colliders="trimesh" position={[0, 1, 0]}>
      <Car model="sedan" position={[0, 0, 0]} />
    </RigidBody>
  );
};
