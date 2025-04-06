import { Box, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";

export const Block = () => {
  const bodyRef = useRef<RapierRigidBody>(null);
  const [hover, setHover] = useState<Boolean>(false);
  const [sub, get] = useKeyboardControls();

  const hitRef = useRef<Record<string, boolean>>({
    floor: true,
    kicker: false,
  });

  useFrame(() => {
    const body = bodyRef.current!;
    const { jump } = get();
    const isGrounded = hitRef.current.floor;
    if (isGrounded && jump) {
      body.applyImpulse({ x: 0, y: 7, z: 0 }, true);
    }
  });

  return (
    <RigidBody
      position={[-4, 1, 0]}
      colliders="cuboid"
      ref={bodyRef}
      onCollisionEnter={(e) => {
        const targetName = e.other.rigidBodyObject?.name;
        if (targetName) {
          hitRef.current[targetName] = true;
        }
      }}
      onCollisionExit={(e) => {
        const targetName = e.other.rigidBodyObject?.name;
        if (targetName) {
          hitRef.current[targetName] = false;
        }
      }}
    >
      <Box
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        castShadow
      >
        <meshStandardMaterial color={hover ? "hotpink" : "royalblue"} />
      </Box>
    </RigidBody>
  );
};
