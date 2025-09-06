import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody, Vector3Tuple } from "@react-three/rapier";
import { forwardRef, useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const GuidedMissileWithPropotionalNavigation = ({
  start,
  target,
  N = 4,
  thrust = 2,
  maxTurnRate = 5,
  initialVelocity = [0, 0, 0],
}: {
  start: THREE.Vector3Tuple;
  target: THREE.Vector3Tuple;
  N?: number;
  maxTurnRate?: number; // radians/sec
  thrust?: number; // forward acceleration (m/s²)
  initialVelocity?: Vector3Tuple;
}) => {
  const maxPoints = 500;
  const turnRate = 0.2;
  const missileRef = useRef<RapierRigidBody>(null!);
  const targetRef = useRef<RapierRigidBody>(null!);
  const lineRef = useRef<THREE.Line>(null!);

  const [hit, setHit] = useState(false);

  const [, get] = useKeyboardControls();
  const [drawCount, setDrawCount] = useState(0);
  const [positions] = useState(() => new Float32Array(maxPoints * 3));
  useFrame((state, delta) => {
    if (!missileRef.current) return;

    const { fire: throttle } = get();

    const missileBody = missileRef.current;
    const rot = missileBody.rotation();
    const targetBody = targetRef.current;
    if (hit) {
      missileBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    const missilePos = new THREE.Vector3().copy(missileBody.translation());
    const targetPos = new THREE.Vector3().copy(targetBody.translation());
    const missileVel = new THREE.Vector3().copy(missileBody.linvel());
    const targetVel = new THREE.Vector3().copy(targetBody.linvel());
    const currentSpeed = missileVel.length();

    // relative motion
    const r = targetPos.clone().sub(missilePos);
    const v = targetVel.clone().sub(missileVel);

    // calculate acceleration magnitude
    const closingVel = -r.clone().dot(v) / r.length();
    const losRate = r.clone().cross(v).length() / r.lengthSq();
    const aMag = N * closingVel * losRate; // acceleration magnitude

    // Direction of commanded accel (perp to LOS)
    const perp = r.clone().cross(v).normalize().cross(r).normalize();
    const accel = perp.multiplyScalar(aMag);

    if (closingVel < 0) {
      accel.setLength(0);
    }

    // === Enforce max turn rate ===

    if (currentSpeed > 0) {
      const maxLateralAccel = currentSpeed * maxTurnRate;
      if (accel.length() > maxLateralAccel) {
        accel.setLength(maxLateralAccel);
      }
    }

    // === Forward thrust ===
    const velDir = currentSpeed > 0 ? missileVel.clone().normalize() : new THREE.Vector3(4, 1, 1);
    const forwardAccel = velDir.multiplyScalar(thrust);

    // === Apply impulse ===
    const totalAccel = accel.add(forwardAccel);
    const impulse = totalAccel.multiplyScalar(missileBody.mass() * delta);
    missileBody.applyImpulse({ x: impulse.x, y: impulse.y, z: impulse.z }, true);

    // orient its nose along its velocity vector.
    if (currentSpeed > 1e-3) {
      const velDir = missileVel.clone().normalize();
      const forward = new THREE.Vector3(0, 1, 0);

      const quat = new THREE.Quaternion().setFromUnitVectors(forward, velDir);
      missileBody.setRotation(quat, true);
    }

    // draw line

    // const line = lineRef.current;

    // if (drawCount >= maxPoints) {
    //   positions.copyWithin(0, 3);
    //   positions.set([missilePos.x, missilePos.y, missilePos.z], (maxPoints - 1) * 3);
    // } else {
    //   positions.set([missilePos.x, missilePos.y, missilePos.z], drawCount * 3);
    //   setDrawCount(drawCount + 1);
    // }

    // lineRef.current.geometry.setDrawRange(0, Math.min(drawCount, maxPoints));
    // lineRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <RigidBody
        ref={missileRef}
        colliders="hull"
        mass={1}
        angularDamping={0}
        linearDamping={0}
        position={start}
        linearVelocity={initialVelocity}
        gravityScale={0}
        onCollisionEnter={(e) => {
          e.colliderObject;
          if (e.colliderObject?.name === "target") {
            setHit(true);
          }
        }}
      >
        <mesh>
          <cylinderGeometry args={[0.1, 0.3, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>
      <RigidBody
        type="dynamic"
        name="target"
        ref={targetRef}
        position={target}
        colliders="cuboid"
        linearVelocity={[0, 3, 0]}
        gravityScale={0}
      >
        <TargetMesh />
      </RigidBody>
    </group>
  );
};

export const GuidedMissileWithPhysics = ({
  start,
  target,
  speed = 10,
  turnRate = 0.5,
}: {
  start: THREE.Vector3;
  target: THREE.Vector3;
  speed?: number;
  turnRate?: number;
}) => {
  /**
   * Physical based guided missle, using applyForce and applyTorqueImpulse
   * to steer towards the target
   */

  const rbRef = useRef<RapierRigidBody>(null!);
  useFrame((state, delta) => {
    if (!rbRef.current) return;

    const body = rbRef.current;
    const quat = body.rotation();
    const pos = body.translation();
    const mass = body.mass();

    const position = new THREE.Vector3(pos.x, pos.y, pos.z);
    const rotation = new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w);
    const forward = new THREE.Vector3(0, 1, 0).applyQuaternion(rotation);
    const dirToTarget = new THREE.Vector3().subVectors(target, position).normalize();

    // steering as torque
    const axis = new THREE.Vector3().crossVectors(forward, dirToTarget).normalize();
    const angle = forward.angleTo(dirToTarget);

    if (angle > 0.01) {
      const torque = axis.multiplyScalar(angle * turnRate * delta);
      body.applyTorqueImpulse({ x: torque.x, y: torque.y, z: torque.z }, true);
    }

    const velocity = forward.multiplyScalar(speed * delta);
    body.applyImpulse({ x: velocity.x, y: velocity.y, z: velocity.z }, true);
    // body.addForce({ x: 0, y: mass * 9.8, z: 0 }, true);
  });

  useEffect(() => {
    console.log(rbRef.current.mass());
  }, []);

  return (
    <group>
      <RigidBody
        ref={rbRef}
        position={start}
        colliders="hull"
        angularDamping={0.5}
        linearDamping={0.5}
        gravityScale={0}
      >
        <MissileMesh />
      </RigidBody>
      <RigidBody position={target} colliders="cuboid">
        <TargetMesh position={[0, 0, 0]} />
      </RigidBody>
    </group>
  );
};

export const MissileNoRapier = ({
  start,
  target,
  speed = 10,
  turnRate = 2,
}: {
  start: THREE.Vector3;
  target: THREE.Vector3;
  speed?: number;
  turnRate?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    const body = ref.current;
    const pos = body.position;
    /**
     * Point nose to the target without rapier (simple pursuit)
     */

    // Direction vector of the missile position to the target
    const dirToTarget = new THREE.Vector3().subVectors(target, pos).normalize();
    // Current forward direction
    const forward = new THREE.Vector3(0, 1, 0).applyQuaternion(body.quaternion);
    // Slerp rotation toward target direction
    const targetQuat = new THREE.Quaternion().setFromUnitVectors(forward.clone().normalize(), dirToTarget);
    body.quaternion.slerp(targetQuat.multiply(body.quaternion), Math.min(1, turnRate * delta));
    // Move forward
    pos.add(forward.multiplyScalar(speed * delta));
  });

  return (
    <group>
      <MissileMesh ref={ref} position={start} castShadow />
      <TargetMesh position={target} />
    </group>
  );
};

export const TargetMesh = forwardRef((props: any, ref) => {
  return (
    <mesh ref={ref} {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
});

const MissileMesh = forwardRef((props: any, ref) => {
  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[0.2, 0.6, 2]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
});
