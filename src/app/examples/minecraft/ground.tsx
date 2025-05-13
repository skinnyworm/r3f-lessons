import { useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useState } from "react";
import * as THREE from "three";

import { useCubeStore } from "./useCubeStore";

export function Ground() {
  const texture = useTexture("/minecraft/grass.jpg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  const { addCube } = useCubeStore();
  const [groundPos, setGroundPos] = useState<[number, number] | null>(null);

  const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setGroundPos([Math.round(e.point.x), Math.round(e.point.z)]);
  };

  const handlePointerLeave = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setGroundPos(null);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!groundPos) return;
    setGroundPos([Math.round(e.point.x), Math.round(e.point.z)]);
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!groundPos) return;
    const [x, z] = groundPos;
    addCube(Math.round(x), 0.5, Math.round(z));
    console.log("added cube on ground");
  };

  return (
    <RigidBody type="fixed" colliders={false}>
      <mesh
        position={[0, 0, 0]}
        rotation-x={-Math.PI / 2}
        receiveShadow
        onPointerDown={handlePointerDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
      >
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial map={texture} map-repeat={[240, 240]} color="green" />
      </mesh>
      {groundPos && (
        <mesh position={[groundPos[0], 0.01, groundPos[1]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color={"green"} />
        </mesh>
      )}
      <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
    </RigidBody>
  );
}
