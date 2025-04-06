import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { quat, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";

export const Kicker = () => {
  const bodyRef = useRef<RapierRigidBody>(null);
  useFrame((_, delta) => {
    if (!bodyRef.current) return;

    const incrementRotation = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      delta * 1.5
    );

    const body = bodyRef.current;
    body.setNextKinematicRotation(
      quat(body.rotation()).multiply(incrementRotation)
    );
  });

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      position={[0, 0.75, 0]}
      name="kicker"
    >
      <group position={[2.5, -0.25, 0]}>
        <Box args={[5, 0.5, 0.5]}>
          <meshStandardMaterial color="peachpuff" />
        </Box>
      </group>
    </RigidBody>
  );
};
