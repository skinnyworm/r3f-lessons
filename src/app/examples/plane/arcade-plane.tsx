import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { quat, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Quaternion, Vector3 } from "three";
import { randInt } from "three/src/math/MathUtils.js";

export const ArcadePlane = () => {
  const speed = 10; // constant forward speed
  const turnRate = 1.5; // radians per second
  const climbRate = 0.8; // radians per second
  const rollRate = 2.0;
  const rb = useRef<RapierRigidBody>(null!);
  const [, get] = useKeyboardControls();

  useFrame((state, delta) => {
    const body = rb.current;
    if (!body) return;

    const { left, right, forward, backward, rollLeft, rollRight, throttle } = get();
    const pos = body.translation();
    const rot = body.rotation();
    const quat = new Quaternion(rot.x, rot.y, rot.z, rot.w);

    const localAngVel = { x: 0, y: 0, z: 0 };
    if (left) {
      localAngVel.y = turnRate; // yaw left
    }

    if (right) {
      localAngVel.y = -turnRate; // yaw right
    }

    if (forward) {
      localAngVel.x = -climbRate; // pitch up
    }

    if (backward) {
      localAngVel.x = climbRate; // pitch down
    }

    if (rollLeft) {
      localAngVel.z = rollRate; // roll left
    }

    if (rollRight) {
      localAngVel.z = -rollRate; // roll right
    }

    var { x, y, z } = new Vector3(localAngVel.x, localAngVel.y, localAngVel.z).applyQuaternion(quat);
    body.setAngvel({ x, y, z }, true);

    var { x, y, z } = new Vector3(0, 0, throttle ? -1 : 0).applyQuaternion(quat).multiplyScalar(speed);
    body.setLinvel({ x, y, z }, true);
  });

  const respawn = () => {
    const body = rb.current;
    body.setTranslation(
      {
        x: randInt(-2, 2) * 4,
        y: 12,
        z: randInt(-2, 2) * 4,
      },
      true
    );
  };
  return (
    <RigidBody
      ref={rb}
      colliders="hull"
      position={[0, 12, 0]}
      enabledRotations={[true, true, true]}
      onCollisionEnter={(e) => {
        console.log(`collision enter: ${e.other.rigidBodyObject?.name}`);
        if (e.other.rigidBodyObject?.name === "ground") {
          respawn();
        }
      }}
      onIntersectionEnter={(e) => {
        if (e.other.rigidBodyObject?.name === "void") {
          respawn();
        }
      }}
    >
      <mesh castShadow>
        <boxGeometry args={[1, 0.5, 4]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
};
