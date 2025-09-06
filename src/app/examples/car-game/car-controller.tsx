import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { euler, quat, RapierRigidBody, RigidBody, vec3 } from "@react-three/rapier";
import { useControls } from "leva";
import { useCallback, useEffect, useRef } from "react";
import { randInt } from "three/src/math/MathUtils.js";
import { Car } from "./car";

export const CarControl = () => {
  const rb = useRef<RapierRigidBody>(null);
  const [, get] = useKeyboardControls();

  const { rotationSpeed, carSpeed } = useControls({
    carSpeed: {
      value: 3,
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

  useFrame((state, delta) => {
    if (!rb.current) return;

    const { left, right } = get();
    const dir = Number(left) - Number(right);

    // angleVelocity

    const angleVelocity = rb.current.angvel();
    const angle = Math.PI * (90 / 180);
    angleVelocity.y = -dir * Math.sin(angle) * rotationSpeed;

    const rotation = rb.current.rotation();
    const impulse = vec3({
      x: 0,
      y: 0,
      z: carSpeed * delta * -1,
    });
    const eulerRot = euler().setFromQuaternion(quat(rotation));
    impulse.applyEuler(eulerRot);

    rb.current.applyImpulse(impulse, true);
    rb.current.setAngvel(angleVelocity, true);
  });

  const respawn = useCallback(() => {
    if (!rb.current) return;

    const pos = {
      x: randInt(-2, 2) * 4,
      y: 2,
      z: randInt(-2, 2) * 4,
    };

    rb.current.setTranslation(pos, true);

    rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    rb.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    rb.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }, []);

  useEffect(() => {
    respawn();
  }, []);

  return (
    <RigidBody ref={rb} colliders="trimesh" position={[0, 1, 0]}>
      <Car model="sedan" position={[0, 0, 0]} />
    </RigidBody>
  );
};
