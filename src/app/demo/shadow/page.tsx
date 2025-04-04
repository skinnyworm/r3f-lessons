"use client";
import { useRef } from "react";
import {
  Canvas,
  ThreeElement,
  ThreeElements,
  useFrame,
  Vector3,
} from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import React from "react";
import * as THREE from "three";

type SizeArg = ThreeElements["boxGeometry"]["args"];

const Box = ({
  boxArgs,
  ...props
}: ThreeElements["mesh"] & { boxArgs?: SizeArg }) => {
  const [anim, setAnim] = React.useState(false);
  const boxRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!boxRef.current) return;
    if (anim) {
      boxRef.current.rotation.y += delta;
      // boxRef.current.rotation.y += delta;
    }
  });

  return (
    <mesh {...props} ref={boxRef} onClick={() => setAnim(!anim)}>
      <boxGeometry args={boxArgs} />
      <meshStandardMaterial />
    </mesh>
  );
};

const Plan = ({
  planeArgs,
  ...props
}: ThreeElements["mesh"] & {
  planeArgs: ThreeElements["planeGeometry"]["args"];
}) => {
  return (
    <mesh {...props}>
      <planeGeometry args={planeArgs} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

export default function DemoPage() {
  return (
    <Canvas shadows>
      <PerspectiveCamera position={[0, 2, 6]} makeDefault />
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 2, -1]} color="white" castShadow />
      <Box position={[1, 0.5, 0]} castShadow />
      <Plan
        rotation={[-Math.PI / 2, 0, 0]}
        planeArgs={[10, 10]}
        receiveShadow
      />
      {/* <gridHelper args={[10, 10]} /> */}
      <axesHelper args={[1]} />
      <OrbitControls />
    </Canvas>
  );
}
