import { useGLTF } from "@react-three/drei";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const Shoe = (props: ThreeElements["mesh"]) => {
  const { nodes, materials } = useGLTF(
    "/nike_air_zoom_pegasus_36-transformed.glb"
  ) as any;
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const group = groupRef.current!;
    // group.rotation.set();
    const t = state.clock.getElapsedTime();
    group.rotation.set(
      Math.cos(t / 4) / 8,
      Math.sin(t / 3) / 2,
      0.15 + Math.sin(t / 2) / 8
    );
    // group.position.y = (0.5 + Math.cos(t / 2)) / 7;
  });

  return (
    <group ref={groupRef}>
      <mesh
        geometry={nodes.defaultMaterial.geometry}
        material={materials.NikeShoe}
        {...props}
      />
    </group>
  );
};
