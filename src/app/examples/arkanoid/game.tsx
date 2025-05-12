"use client";

import { Canvas, Color, useThree, Vector3 } from "@react-three/fiber";
import { CuboidCollider, Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Fragment, useRef } from "react";

export const Grame = () => {
  return (
    <Canvas camera={{ fov: 50, position: [0, 5, 12] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 5]} />
      <Physics gravity={[0, -30, 0]}>
        <Enemy color="orange" position={[2.75, 1.5, 0]} />
        <Enemy color="hotpink" position={[-2.75, 3.5, 0]} />
        <Ball />
        <Paddle />
      </Physics>
    </Canvas>
  );
};

const Enemy = ({ position, color }: { position: Vector3; color: Color }) => {
  return (
    <RigidBody colliders="cuboid" type="fixed" position={position} restitution={2.1}>
      <mesh>
        <boxGeometry args={[2.5, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
};

const Ball = () => {
  const ref = useRef<RapierRigidBody>(null);
  const { viewport } = useThree();
  const onCollisionEnter = (e: any) => {
    const rigidBody = ref.current!;
    rigidBody.setTranslation({ x: 0, y: 0, z: 0 }, false);
    rigidBody.setLinvel({ x: 0, y: 10, z: 0 }, false);
  };

  return (
    <Fragment>
      <RigidBody ref={ref} colliders="ball" mass={1}>
        <mesh>
          <sphereGeometry args={[0.75, 32, 32]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, -viewport.height, 0]}
        restitution={2.1}
        onCollisionEnter={onCollisionEnter}
      >
        <CuboidCollider args={[30, 2, 30]} />
      </RigidBody>
    </Fragment>
  );
};

const Paddle = () => {
  return null;
};
