"use client";

import {
  Helper,
  KeyboardControls,
  KeyboardControlsEntry,
  PointerLockControls,
  Sky,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { PointLightHelper } from "three";
import { Cube, Cubes } from "./cube";
import { Ground } from "./ground";
import { Player } from "./player";

const keymap: KeyboardControlsEntry<string>[] = [
  { name: "forward", keys: ["w", "ArrowUp"] },
  { name: "backward", keys: ["s", "ArrowDown"] },
  { name: "left", keys: ["a", "ArrowLeft"] },
  { name: "right", keys: ["d", "ArrowRight"] },
  { name: "jump", keys: ["Space"] },
  { name: "sprint", keys: ["Shift"] },
  { name: "sneak", keys: ["Control"] },
  { name: "use", keys: ["e"] },
  { name: "drop", keys: ["q"] },
  { name: "inventory", keys: ["i"] },
  { name: "chat", keys: ["t"] },
];
export function Minecraft() {
  return (
    <>
      <KeyboardControls map={keymap}>
        <Canvas camera={{ fov: 45 }} shadows>
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={3} />
          <pointLight position={[0, 2, 2]} intensity={50} castShadow />
          <Physics gravity={[0, -30, 0]}>
            <Cube position={[0, 0.5, -3]} />
            <Cubes />
            <Ground />
            <Player />
          </Physics>
          <Helper type={PointLightHelper} args={[10, "red"]} />
          <PointerLockControls />
        </Canvas>
      </KeyboardControls>
      <div className="absolute top-1/2 left-1/2 w-2 h-2 translate-x-1/2 translate-y-1/2 bg-red-500 rounded-full pointer-events-none" />
    </>
  );
}
