"use client";

import { KeyboardControls, KeyboardControlsEntry, useKeyboardControls } from "@react-three/drei";
import { Canvas, Color, useFrame, useThree, Vector3 } from "@react-three/fiber";
import { CuboidCollider, Physics, quat, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Fragment, useMemo, useRef } from "react";
import * as THREE from "three";

enum Controls {
  left = "left",
  right = "right",
}

export const Game = () => {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    ],
    []
  );

  return (
    <KeyboardControls map={map}>
      <Canvas camera={{ fov: 50, position: [0, 0, 12] }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 5, 2.5]} intensity={20} />
        <Physics gravity={[0, -30, 0]}>
          <Enemy color="orange" position={[2.75, 1.5, 0]} />
          <Enemy color="hotpink" position={[-2.75, 3.5, 0]} />
          <Ball />
          <Paddle />
        </Physics>
      </Canvas>
    </KeyboardControls>
  );
};

const Enemy = ({ position, color }: { position: Vector3; color: Color }) => {
  return (
    <RigidBody colliders="cuboid" type="fixed" position={position} restitution={1.1}>
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
          <sphereGeometry args={[0.5, 32, 32]} />
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
        <mesh>
          <boxGeometry args={[60, 2, 60]} />
          <meshStandardMaterial color="blue" />
        </mesh>
        <CuboidCollider args={[30, 2, 30]} />
      </RigidBody>
    </Fragment>
  );
};

const Paddle = ({
  quaternion = new THREE.Quaternion(),
  euler = new THREE.Euler(),
}: {
  quaternion?: THREE.Quaternion;
  euler?: THREE.Euler;
}) => {
  const bodyRef = useRef<RapierRigidBody>(null);
  const [, get] = useKeyboardControls<Controls>();

  useFrame((state, dt) => {
    const { viewport } = state;
    const body = bodyRef.current!;

    const dir = get().left ? -1 : get().right ? 1 : 0;
    const x = (body.translation().x += dir * 10 * dt);

    body.setTranslation({ x, y: -viewport.height / 3, z: 0 }, false);

    // Rotate the paddle on z axis based on the x position
    quaternion.setFromEuler(euler.set(0, 0, (x * Math.PI) / 60));
    body.setRotation(quaternion, false);

    // Rotate the camera based on the x position
    const camera = state.camera;
    console.log(state.pointer.x);
    camera.position.set(state.pointer.x * 2, state.pointer.y * 3, camera.position.z);
  });

  return (
    <RigidBody ref={bodyRef} colliders="cuboid" type="fixed" restitution={2.1}>
      <mesh>
        <boxGeometry args={[4, 0.2, 1]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>
    </RigidBody>
  );
};
