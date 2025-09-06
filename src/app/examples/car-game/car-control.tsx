import { useRef } from "react";

import { PerspectiveCamera, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { euler, quat, RapierRigidBody, RigidBody, vec3 } from "@react-three/rapier";
import { useControls } from "leva";
import * as THREE from "three";

import { Car } from "./car";
import { randInt } from "three/src/math/MathUtils.js";

export const CarControl = () => {
  const rb = useRef<RapierRigidBody>(null!);
  const [, get] = useKeyboardControls();

  const { rotationSpeed, carSpeed } = useControls({
    carSpeed: {
      value: 30,
      min: -40,
      max: 40,
      step: 0.1,
    },
    rotationSpeed: {
      value: 3,
      min: 0,
      max: 10,
      step: 0.01,
    },
  });

  const lookAt = useRef(new THREE.Vector3(0, 0, 0));
  useFrame((state, delta) => {
    const body = rb.current;
    const carPos = body.translation();
    lookAt.current.lerp(carPos, 0.1);
    state.camera.lookAt(lookAt.current);

    const { left, right, forward, backward } = get();

    const forwardDir = Number(forward) - Number(backward);
    const rotation = euler().setFromQuaternion(quat(body.rotation()));
    const impulse = vec3({ x: 0, y: 0, z: forwardDir * carSpeed * delta }).applyEuler(rotation);
    body.applyImpulse(impulse, true);

    const leftRightDir = Number(left) - Number(right);
    const torque = vec3({ x: 0, y: leftRightDir * rotationSpeed * delta, z: 0 });
    body.applyTorqueImpulse(torque, true);
  });

  const respawn = () => {
    const body = rb.current;
    body.setTranslation(
      {
        x: randInt(-2, 2) * 4,
        y: 2,
        z: randInt(-2, 2) * 4,
      },
      true
    );
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    body.setRotation(quat(), true);
  };

  return (
    <RigidBody
      ref={rb}
      colliders="trimesh"
      position={[0, 1, 0]}
      friction={0.5}
      restitution={0.5}
      type="dynamic"
      onIntersectionEnter={(e) => {
        if (e.other.rigidBodyObject?.name === "void") {
          respawn();
        }
      }}
    >
      <Car model="sedan" position={[0, 0, 0]} />
      <PerspectiveCamera makeDefault position={[0, 2, -6]} near={1} />
    </RigidBody>
  );
};
