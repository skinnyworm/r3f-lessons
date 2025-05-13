"use client";
import { Environment, OrbitControls, RoundedBox, RoundedBoxProps, useAspect, useTexture } from "@react-three/drei";
import { Canvas, ThreeElements, useFrame, useThree, Vector3 } from "@react-three/fiber";
import { CuboidCollider, Physics, RapierRigidBody, RigidBody, RigidBodyProps } from "@react-three/rapier";
import { range } from "lodash";
import { forwardRef, Fragment, useRef } from "react";
import * as THREE from "three";

export const Game = () => {
  return (
    <Canvas dpr={1.5} camera={{ fov: 50, position: [0, 2, 22] }}>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 5, 2.5]} intensity={20} />
      <Physics gravity={[0, -30, 0]}>
        {range(6).map((i) => (
          <MovingBlock key={i} position={new THREE.Vector3(0, 1 + i * 2.5, 0)} offset={10000 * i} />
        ))}
        <Block args={[10, 1.5, 4]} position={[-11, -7, 0]} rotation={[0, 0, -0.7]} restitution={4.2} />
        <Block args={[10, 1.5, 4]} position={[11, -7, 0]} rotation={[0, 0, 0.7]} restitution={4.2} />
        <Paddle />
        <Ball />
      </Physics>
      <Environment preset="warehouse" />
      <Background position={[0, 0, -5]} />
      <OrbitControls />
    </Canvas>
  );
};

const Background = (props: ThreeElements["mesh"]) => {
  const scale = useAspect(5000, 3800, 1);
  const texture = useTexture("/pinball/bg.jpg");
  return (
    <mesh scale={scale} {...props}>
      <planeGeometry />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const Block = forwardRef<RapierRigidBody, RigidBodyProps & Pick<RoundedBoxProps, "args">>(({ args, ...props }, ref) => {
  const block = useRef<THREE.Mesh>(null);
  return (
    <RigidBody ref={ref} colliders="cuboid" type="fixed" {...props}>
      <RoundedBox ref={block} args={args} radius={0.4} smoothness={10}>
        <meshPhysicalMaterial transmission={1} roughness={0} thickness={3} envMapIntensity={4} />
      </RoundedBox>
    </RigidBody>
  );
});

const MovingBlock = ({ offset = 0, position }: { offset: number; position: THREE.Vector3 }) => {
  const block = useRef<RapierRigidBody>(null!);
  useFrame((state) => {
    const dx = (Math.sin(offset + state.clock.elapsedTime) * state.viewport.width) / 40;
    position.setX(position.x + dx);
    block.current.setTranslation(position, false);
  });

  return <Block ref={block} args={[3, 1.5, 4]} restitution={1.1} />;
};

const Paddle = ({ args = [5, 1.5, 4] }: { args?: [w: number, h: number, d: number] }) => {
  const block = useRef<RapierRigidBody>(null!);
  useFrame((state) => {
    block.current.setTranslation({ x: state.pointer.x * 10, y: -5, z: 0 }, false);

    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler();
    quaternion.setFromEuler(euler.set(0, 0, (state.pointer.x * Math.PI) / 4));
    block.current.setRotation(quaternion, false);
  });
  return <Block ref={block} args={args} restitution={2.3} />;
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
        colliders="cuboid"
        position={[0, -viewport.height, 0]}
        restitution={2.1}
        onCollisionEnter={onCollisionEnter}
      >
        <mesh>
          <boxGeometry args={[60, 2, 60]} />
          <meshStandardMaterial color="blue" />
        </mesh>
        {/* <CuboidCollider args={[30, 2, 30]} /> */}
      </RigidBody>
    </Fragment>
  );
};
