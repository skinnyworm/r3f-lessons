import { useRef } from "react";

import { PerspectiveCamera, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { euler, quat, RapierRigidBody, RigidBody, vec3 } from "@react-three/rapier";
import { useControls } from "leva";
import * as THREE from "three";

import { Car } from "./car";

export const CarControl = () => {
  const rb = useRef<RapierRigidBody>(null);
  const [, get] = useKeyboardControls();

  const { rotationSpeed, carSpeed } = useControls({
    carSpeed: {
      value: 16,
      min: -20,
      max: 20,
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
    if (!rb.current) return;

    const { left, right, forward, backward } = get();
    const hdir = Number(left) - Number(right);

    // look at
    const carPos = rb.current.translation();
    lookAt.current.lerp(carPos, 0.2);
    state.camera.lookAt(lookAt.current);

    // angleVelocity
    const angleVelocity = rb.current.angvel();
    angleVelocity.y = hdir * Math.sin(Math.PI / 6) * rotationSpeed;
    rb.current.setAngvel(angleVelocity, true);

    // impulse
    const vdir = Number(forward) - Number(backward);
    const impulse = vec3({
      x: 0,
      y: 0,
      z: vdir * carSpeed * delta,
    });
    const eulerRot = euler().setFromQuaternion(quat(rb.current.rotation()));
    impulse.applyEuler(eulerRot);
    rb.current.applyImpulse(impulse, true);
  });

  return (
    <RigidBody ref={rb} colliders="trimesh" position={[0, 1, 0]}>
      <Car model="sedan" position={[0, 0, 0]} />
      <PerspectiveCamera makeDefault position={[0, 2, -4]} near={1} />
    </RigidBody>
  );
};
