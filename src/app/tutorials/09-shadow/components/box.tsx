import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

export const Box = () => {
  const [anim, setAnim] = useState(false);
  const boxRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!boxRef.current) return;
    if (anim) {
      boxRef.current.rotation.y += delta;
    }
  });

  return (
    <mesh ref={boxRef} onClick={() => setAnim(!anim)} position={[1, 0.5, 0]} castShadow>
      <boxGeometry />
      <meshStandardMaterial color="royalblue" />
    </mesh>
  );
};
