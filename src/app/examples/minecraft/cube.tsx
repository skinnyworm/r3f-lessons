import { useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { RapierRigidBody, RigidBody, RigidBodyProps } from "@react-three/rapier";
import range from "lodash/range";
import { useRef, useState } from "react";

import { useCubeStore } from "./useCubeStore";

function isNullOrUndefined<T>(value: T | undefined | null) {
  return value === null || value === undefined;
}

export function Cube({ position }: { position: RigidBodyProps["position"] }) {
  const [hover, setHover] = useState<any>(null);
  const bodyRef = useRef<RapierRigidBody>(null);
  const texture = useTexture("/minecraft/dirt.jpg");
  const addCube = useCubeStore((state) => state.addCube);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (isNullOrUndefined(e.faceIndex)) return;

    e.stopPropagation();
    const body = bodyRef.current!;
    const face = Math.floor(e.faceIndex! / 2);
    const { x, y, z } = body.translation();
    const dir = [
      [x + 1, y, z],
      [x - 1, y, z],
      [x, y + 1, z],
      [x, y - 1, z],
      [x, y, z + 1],
      [x, y, z - 1],
    ] satisfies [number, number, number][];

    addCube(...dir[face]);
    console.log("add on cube beside cube", face);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.faceIndex) {
      setHover(Math.floor(e.faceIndex / 2));
    }
  };

  return (
    <RigidBody type="fixed" colliders="cuboid" ref={bodyRef} position={position}>
      <mesh
        onPointerMove={handlePointerMove}
        onPointerOut={() => setHover(null)}
        onPointerDown={handlePointerDown}
        castShadow
        receiveShadow
      >
        {range(6).map((i) => (
          <meshStandardMaterial
            key={i}
            color={hover === i ? "hotpink" : "white"}
            attach={`material-${i}`}
            map={texture}
          />
        ))}
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
    </RigidBody>
  );
}
