"use client";

import { Box, OrbitControls, useHelper } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, quat, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { RefObject, Suspense, useRef, useState } from "react";
import * as THREE from "three";

export function Board() {
  return (
    <Canvas
      shadows
      camera={{ fov: 30, position: [10, 10, 10] }}
      shadow-map={[256, 256]}
    >
      <color attach="background" args={["#87CEEB"]} />
      <Suspense>
        <Physics debug>
          <Scene />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

const Scene = () => {
  const [hover, setHover] = useState<Boolean>(false);
  const dlRef = useRef<THREE.DirectionalLight>(null);
  const cubeRef = useRef<RapierRigidBody>(null);
  const kicker = useRef<RapierRigidBody>(null);

  const jump = () => {
    const body = cubeRef.current!;
    body.applyImpulse({ x: 0, y: 5, z: 0 }, true);
  };

  useHelper(
    dlRef as RefObject<THREE.Object3D>,
    THREE.DirectionalLightHelper,
    1,
    "red"
  );

  useFrame((_, delta) => {
    const currentRotation = quat(kicker.current!.rotation());
    const incrementRotation = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      delta * 1.5
    );
    currentRotation.multiply(incrementRotation);
    kicker.current!.setNextKinematicRotation(currentRotation);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        ref={dlRef}
        position={[-10, 10, 10]}
        intensity={4}
        castShadow
      />
      <OrbitControls />

      <RigidBody position={[-4, 1, 0]} colliders="cuboid" ref={cubeRef}>
        <Box
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          onClick={() => jump()}
          castShadow
        >
          <meshStandardMaterial color={hover ? "hotpink" : "royalblue"} />
        </Box>
      </RigidBody>

      <RigidBody ref={kicker} type="kinematicPosition" position={[0, 0.75, 0]}>
        <group position={[2.5, 0, 0]}>
          <Box args={[5, 0.5, 0.5]}>
            <meshStandardMaterial color="peachpuff" />
          </Box>
        </group>
      </RigidBody>

      <RigidBody type="fixed" friction={2}>
        <Box position={[0, 0, 0]} args={[10, 0.5, 10]} receiveShadow>
          <meshStandardMaterial color="springgreen" />
        </Box>
      </RigidBody>
    </>
  );
};
