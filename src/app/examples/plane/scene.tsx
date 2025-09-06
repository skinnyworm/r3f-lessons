"use client";

import { Environment, KeyboardControls, KeyboardControlsEntry, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { GuidedMissileWithPropotionalNavigation as Missile } from "./missile";
import { Suv } from "./suv";
import { Plane } from "./plane";
// import { Drone } from "./Drone";

const keymap: KeyboardControlsEntry<string>[] = [
  { name: "rollLeft", keys: ["q"] },
  { name: "rollRight", keys: ["e"] },
  { name: "left", keys: ["a", "ArrowLeft"] },
  { name: "right", keys: ["d", "ArrowRight"] },
  { name: "forward", keys: ["w", "ArrowUp"] },
  { name: "backward", keys: ["s", "ArrowDown"] },
  { name: "fire", keys: ["Space"] },
  { name: "thurstUp", keys: ["+"] },
  { name: "thurstDown", keys: ["-"] },
];

export function Scene() {
  return (
    <KeyboardControls map={keymap}>
      <Canvas shadows camera={{ position: [0, 25, 70], fov: 50, near: 0.5 }}>
        <color attach="background" args={["#333"]} />
        <Experience />
      </Canvas>
    </KeyboardControls>
  );
}

export function Experience() {
  const lightRef = useRef<THREE.DirectionalLight>(null!);
  const shadwoCameraRef = useRef<THREE.OrthographicCamera>(null!);
  // useHelper(lightRef, THREE.DirectionalLightHelper, 5);
  // useHelper(shadwoCameraRef, THREE.CameraHelper);
  const [targetPosition, setTargetPosition] = useState<THREE.Vector3Tuple>([20, 0, 20]);
  return (
    <Suspense fallback={null}>
      <color attach="background" args={["#333"]} />
      <ambientLight intensity={0.1} />
      <directionalLight
        ref={lightRef}
        position={[0, 20, 0]}
        intensity={1.5}
        shadow-mapSize-width={4096} // Higher = sharper shadows
        shadow-mapSize-height={4096}
        castShadow
      >
        <orthographicCamera ref={shadwoCameraRef} attach="shadow-camera" args={[-25, 25, 25, -25, 1, 100]} />
      </directionalLight>
      <Environment preset="city" background={false} environmentIntensity={0.2} />
      <Physics>
        <Missile start={[-20, 5, -20]} target={[20, 2, 20]} />
        {/* <Suv initialPosition={[-20, 3, -20]} targetPosition={targetPosition} /> */}
        {/* <Plane initialPosition={[0, 20, 0]} /> */}
        <Ground onPick={(point) => setTargetPosition(point.toArray())} />
        <OrbitControls />
      </Physics>
    </Suspense>
  );
}

const Ground = ({ onPick }: { onPick?: (point: THREE.Vector3) => void }) => {
  return (
    <>
      <RigidBody name="ground" type="fixed" colliders="cuboid">
        <mesh
          position={[0, 0, 0]}
          onPointerDown={(e) => {
            e.stopPropagation();
            const p = e.point; // world-space intersection
            onPick?.(p.clone());
          }}
          receiveShadow
        >
          <boxGeometry args={[50, 0.1, 50]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>
      <RigidBody name="void" type="fixed" colliders={false} sensor>
        <CuboidCollider args={[100, 0.2, 100]} position={[0, -2, 0]} />
      </RigidBody>
    </>
  );
};
