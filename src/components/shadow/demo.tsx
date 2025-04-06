"use client";
import { OrbitControls, PerspectiveCamera, useHelper } from "@react-three/drei";
import { Canvas, ThreeElements, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

type SizeArg = ThreeElements["boxGeometry"]["args"];

type THREE3DObjectRef = React.RefObject<THREE.Object3D>;

export function Demo() {
  return (
    <Canvas shadows>
      <Scene />
    </Canvas>
  );
}

const Box = ({ boxArgs, ...props }: ThreeElements["mesh"] & { boxArgs?: SizeArg }) => {
  const [anim, setAnim] = React.useState(false);
  const boxRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!boxRef.current) return;
    if (anim) {
      // boxRef.current.rotation.y += delta;
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

const Scene = () => {
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  useHelper(pointLightRef as THREE3DObjectRef, THREE.PointLightHelper, 0.2, "red");

  return (
    <>
      <PerspectiveCamera position={[0, 2, 6]} makeDefault />
      <ambientLight intensity={0.3} />
      {/* <spotLight position={[2, 2, -1]} angle={0.15} penumbra={1} intensity={1} castShadow /> */}
      <pointLight ref={pointLightRef} position={[2, 2, -1]} color="white" castShadow />
      {/* <directionalLight position={[2, 2, -1]} color="white" castShadow /> */}

      <Box position={[1, 0.5, 0]} castShadow />
      <Plan rotation={[-Math.PI / 2, 0, 0]} planeArgs={[10, 10]} receiveShadow />
      {/* <gridHelper args={[10, 10]} /> */}
      <axesHelper args={[1]} />
      <OrbitControls />
    </>
  );
};
