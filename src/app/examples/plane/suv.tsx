import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ObjectMap, useFrame } from "@react-three/fiber";
import { GLTF } from "three-stdlib";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";

type CarGLFT = ObjectMap &
  GLTF & {
    nodes: {
      body: THREE.Mesh;
      "wheel-back": THREE.Mesh;
      "wheel-back-left": THREE.Mesh;
      "wheel-back-right": THREE.Mesh;
      "wheel-front-left": THREE.Mesh;
      "wheel-front-right": THREE.Mesh;
    };
    materials: {
      MasterMaterial: THREE.Material;
    };
  };

export function Suv({
  initialPosition = [-20, 1, -20],
  targetPosition = [20, 0, 20],
}: {
  initialPosition?: THREE.Vector3Tuple;
  targetPosition?: THREE.Vector3Tuple;
}) {
  const {
    nodes: {
      "wheel-back": wheelBack,
      body,
      "wheel-front-left": wheelFrontLeft,
      "wheel-front-right": wheelFrontRight,
      "wheel-back-left": wheelBackLeft,
      "wheel-back-right": wheelBackRight,
    },
    materials,
  } = useGLTF("/car-game/cars/suv.glb") as CarGLFT;
  const carRef = useRef<RapierRigidBody>(null!);
  const arrowRef = useRef<THREE.ArrowHelper>(null!);
  const speed = 5;
  const turnFactor = 5;

  useFrame((state, delta) => {
    if (!carRef.current) return;

    const body = carRef.current;
    const pos = body.translation();
    const rot = body.rotation();
    const mass = body.mass();

    const position = new THREE.Vector3().copy(pos);
    const rotation = new THREE.Quaternion().copy(rot);
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(rotation).normalize();

    const targetPos = new THREE.Vector3().fromArray(targetPosition);
    const toTarget = targetPos.clone().sub(position).normalize();

    const distance = position.distanceTo(targetPos);
    if (distance < 1) return; // stop if close enough

    const cross = new THREE.Vector3().crossVectors(forward, toTarget);
    const alignment = forward.dot(toTarget); // -1 opposite, 1 aligned

    // Steering (yaw only)
    const torqueForce = cross.y * turnFactor; // reduce turning when aligned
    body.applyTorqueImpulse({ x: 0, y: torqueForce * delta, z: 0 }, true);

    // apply forward impulse
    const speedFactor = (alignment + 2) / 2; // 0 to 1
    const dir = alignment > 0 ? 1 : -1;
    const impulse = forward.clone().multiplyScalar(speed * delta * mass * speedFactor * dir);
    body.applyImpulse(impulse, true);

    // state.camera.position.lerp(new THREE.Vector3().copy(position).add(new THREE.Vector3(0, 5, 15)), 0.05);
    // state.camera.lookAt(position);

    // update arrow
    const arrow = arrowRef.current;
    arrow.setDirection(forward);
    arrow.position.copy(position);
  });

  return (
    <group>
      <RigidBody
        ref={carRef}
        type="dynamic"
        colliders="hull"
        mass={1}
        restitution={1}
        friction={0.3}
        linearDamping={0.8}
        angularDamping={0.2}
        position={initialPosition}
      >
        <group>
          <mesh geometry={body.geometry} material={body.material} position={body.position} castShadow>
            <mesh geometry={wheelBack.geometry} material={wheelBack.material} position={wheelBack.position} />
          </mesh>
          <mesh
            geometry={wheelFrontLeft.geometry}
            material={wheelFrontLeft.material}
            position={wheelFrontLeft.position}
          />
          <mesh
            geometry={wheelFrontRight.geometry}
            material={wheelFrontRight.material}
            position={wheelFrontRight.position}
          />
          <mesh geometry={wheelBackLeft.geometry} material={wheelBackLeft.material} position={wheelBackLeft.position} />
          <mesh
            geometry={wheelBackRight.geometry}
            material={wheelBackRight.material}
            position={wheelBackRight.position}
          />
        </group>
      </RigidBody>
      <primitive
        object={new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...initialPosition), 2, 0xff0000)}
        ref={arrowRef}
      />
      <group position={targetPosition}>
        <mesh name="target" position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group>
    </group>
  );
}
