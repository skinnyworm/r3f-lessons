import { CuboidCollider, RigidBody } from "@react-three/rapier";
import grass from "./assets/grass.jpg";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Ground() {
  const texture = useTexture(grass.src);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return (
    <RigidBody type="fixed" colliders={false}>
      <mesh position={[0, 0, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial
          map={texture}
          map-repeat={[240, 240]}
          color="green"
        />
      </mesh>
      <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
    </RigidBody>
  );
}
