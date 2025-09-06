import { CuboidCollider, RigidBody } from "@react-three/rapier";

export const Ground = () => {
  return (
    <group>
      <RigidBody type="fixed" colliders="cuboid" name="ground" friction={0.1}>
        <mesh position={[0, -0.1, 0]} rotation={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[50, 0.2, 50]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" sensor colliders={false} position-y={-5} name="void">
        <CuboidCollider args={[50, 3, 50]} />
      </RigidBody>
    </group>
  );
};
