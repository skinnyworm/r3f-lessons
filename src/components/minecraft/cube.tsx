import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import { useRef, useState } from "react";
import dirt from "./assets/dirt.jpg";
import { useTexture } from "@react-three/drei";
import range from "lodash/range";
import { create } from "zustand";
import { ThreeEvent, Vector3 } from "@react-three/fiber";

type CubeStore = {
  cubes: Array<{
    x: number;
    y: number;
    z: number;
  }>;
  addCube: (x: number, y: number, z: number) => void;
};

export const useCubeStore = create<CubeStore>((set) => {
  return {
    cubes: [],
    addCube(x: number, y: number, z: number) {
      set((state) => ({
        cubes: [...state.cubes, { x, y, z }],
      }));
    },
  };
});

export const Cubes = () => {
  const cubes = useCubeStore((state) => state.cubes);
  return cubes.map((pos, i) => (
    <Cube key={i} position={[pos.x, pos.y, pos.z]} />
  ));
};

export function Cube({ position }: { position: RigidBodyProps["position"] }) {
  const [hover, setHover] = useState<any>(null);
  const bodyRef = useRef<RapierRigidBody>(null);
  const texture = useTexture(dirt.src);
  const addCube = useCubeStore((state) => state.addCube);

  const handleClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.faceIndex) {
      const face = Math.floor(e.faceIndex / 2);
      const body = bodyRef.current!;
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
    }
  };

  return (
    <RigidBody
      type="fixed"
      colliders="cuboid"
      ref={bodyRef}
      position={position}
    >
      <mesh
        onPointerMove={(e) => {
          e.stopPropagation();
          if (e.faceIndex) {
            setHover(Math.floor(e.faceIndex / 2));
          }
        }}
        onPointerOut={() => setHover(null)}
        onClick={handleClick}
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
