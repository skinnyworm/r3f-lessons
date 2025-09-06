import { extend } from "@react-three/fiber";
import { MeshLineGeometry, MeshLineMaterial, raycast } from "meshline";
import { useRef } from "react";
import * as THREE from "three";

extend({ MeshLineGeometry, MeshLineMaterial });

export const LiveTrack = ({ points }: { points: THREE.Vector3[] }) => {
  const lineRef = useRef<THREE.Line>(null!);

  return (
    <mesh ref={lineRef} raycast={raycast} onPointerOver={console.log}>
      <meshLineGeometry points={points} />
      <meshLineMaterial lineWidth={0.1} color="hotpink" />
    </mesh>
  );
};
