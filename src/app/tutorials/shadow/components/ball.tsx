import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Ball() {
  const ballRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!ballRef.current) return;

    ballRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1) * 0.5 + 1;
  });

  return (
    <mesh ref={ballRef} position={[-1, 0.5, 0]} castShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="white" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}
