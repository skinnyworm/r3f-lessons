import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";

export function Drone({
  targetPosition = [20, 1, 20],
  initialPosition = [0, 0, 0],
}: {
  initialPosition?: THREE.Vector3Tuple;
  targetPosition?: THREE.Vector3Tuple;
}) {
  const [, get] = useKeyboardControls();
  const ref = useRef<RapierRigidBody>(null!);

  const targetHeight = 15;
  const hoverStrength = 5;
  const damping = 4;
  const torque = 0.5;
  const turnRate = 1;

  useFrame((state, delta) => {
    if (ref.current === null) return;
    const body = ref.current;
    const { fire: throttle } = get();

    const pos = body.translation();
    const rot = body.rotation();
    const mass = body.mass();

    const forward = new THREE.Vector3(0, 1, 0).applyQuaternion(rot).normalize();
    const accel = new THREE.Vector3().copy(forward).multiplyScalar(throttle ? 4 : 0);
    const impulse = accel.multiplyScalar(mass * delta);
    body.applyImpulse({ x: impulse.x, y: impulse.y, z: impulse.z }, true);

    const targetDir = new THREE.Vector3(...targetPosition).sub(pos).normalize();
    const axis = new THREE.Vector3().crossVectors(forward, targetDir).normalize();
    const angle = forward.angleTo(targetDir);
    if (angle > 0.003) {
      const rotQuat = new THREE.Quaternion().setFromAxisAngle(axis, angle * turnRate * delta);
      const q = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w).multiply(rotQuat);
      body.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }, true);
    }
  });
  return (
    <group>
      <RigidBody
        ref={ref}
        type="dynamic"
        mass={1}
        friction={0.5}
        restitution={0.2}
        linearDamping={0.2}
        angularDamping={0.7}
        colliders="cuboid"
        position={initialPosition}
        gravityScale={0}
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.5, 2]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </RigidBody>
      <RigidBody type="dynamic" mass={1} position={targetPosition}>
        <mesh castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>
    </group>
  );
}
