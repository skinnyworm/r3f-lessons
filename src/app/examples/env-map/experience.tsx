"use client";

import { AccumulativeShadows, Box, Environment, Lightformer, OrbitControls, RandomizedLight } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Lightformers } from "./light-formers";
import { Porsche } from "./porsche";

export const Experience = () => (
  <Canvas
    onDoubleClick={(e) => {
      e.currentTarget.requestFullscreen().catch((err) => {
        alert("Open in a seperate tab to allow fullscreen access");
      });
    }}
    camera={{ fov: 30, position: [5, 0, 15] }}
    shadows
  >
    <ambientLight intensity={0.5} />
    <spotLight position={[0, 4, 0]} angle={0.3} penumbra={1} intensity={2} shadow-bias={-0.0001} castShadow />
    <AccumulativeShadows position={[0, -1.16, 0]} frames={100} alphaTest={0.9} scale={10}>
      <RandomizedLight amount={8} radius={10} ambient={0.5} position={[1, 5, -1]} />
    </AccumulativeShadows>
    <Porsche scale={1.6} position={[-0.5, -0.18, 0]} rotation={[0, Math.PI / 5, 0]} />

    <Environment frames={Infinity} resolution={256} background blur={1} preset="dawn">
      <Lightformers />
    </Environment>
    <CameraRig />
  </Canvas>
);

const CameraRig = ({ v = new THREE.Vector3() }: { v?: THREE.Vector3 }) => {
  return useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.lerp(v.set(Math.sin(t / 5), 0, 12 + Math.cos(t / 5) / 2), 0.1);
    state.camera.lookAt(0, 0, 0);
  });
};
