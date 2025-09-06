import { useGLTF, useAnimations, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { LiveTrack } from "./live-track";

const thurstFactor = 20;

export function Plane({ initialPosition = [0, 20, 0] }: { initialPosition?: THREE.Vector3Tuple }) {
  const { scene, animations } = useGLTF("/models/plane.glb");
  const { actions } = useAnimations(animations, scene);
  const bodyRef = useRef<RapierRigidBody>(null!);
  const [, get] = useKeyboardControls();

  const [points, setPoints] = useState<THREE.Vector3[]>(() => []);

  useEffect(() => {
    if (actions) {
      actions["HeliceAction"]?.play();
      // actions["FuselagemAction.001"]?.play();
    }
  }, [actions]);

  const controlPlane = (
    body: RapierRigidBody,
    forward: THREE.Vector3,
    up: THREE.Vector3,
    right: THREE.Vector3,
    delta: number
  ) => {
    const mass = body.mass();
    const liftForce = 9.8 * mass;

    const {
      forward: pitchUp,
      backward: pitchDown,
      left: yawLeft,
      right: yawRight,
      rollLeft,
      rollRight,
      thurstUp,
      thurstDown,
    } = get();

    const torque = new THREE.Vector3();
    torque.add(forward.clone().multiplyScalar(rollLeft ? 1 : rollRight ? -1 : 0));
    torque.add(up.clone().multiplyScalar(yawLeft ? 1 : yawRight ? -1 : 0));
    torque.add(right.clone().multiplyScalar(pitchUp ? 1 : pitchDown ? -1 : 0));
    torque.multiplyScalar(0.02);

    body.applyTorqueImpulse({ x: torque.x, y: torque.y, z: torque.z }, true);

    const impulse = new THREE.Vector3();
    impulse.add(forward.clone().multiplyScalar(thurstUp ? -1 : thurstDown ? 1 : 0));
    impulse.multiplyScalar(thurstFactor * delta);

    body.applyImpulse({ x: impulse.x, y: impulse.y + liftForce * delta, z: impulse.z }, true);
  };

  useFrame((state, delta) => {
    if (!bodyRef.current) return;

    const body = bodyRef.current;
    const pos = body.translation();
    const rot = body.rotation();

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(rot);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(rot);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(rot);
    controlPlane(body, forward, up, right, delta);

    const currentPos = new THREE.Vector3().copy(pos);
    setPoints((points) => {
      const lastPoint = points[points.length - 1];
      if (lastPoint && lastPoint.distanceToSquared(currentPos) < 0.2) {
        return points;
      }

      if (points.length > 500) {
        points.shift();
      }

      return [...points, currentPos];
    });
  });

  return (
    <group>
      <RigidBody
        mass={1}
        ref={bodyRef}
        type="dynamic"
        linearDamping={0.3}
        angularDamping={0.8}
        colliders="hull"
        gravityScale={1}
        position={initialPosition}
      >
        <group scale={0.3}>
          <primitive object={scene} castShadow />
        </group>
      </RigidBody>
      <LiveTrack points={points} />
    </group>
  );
}
