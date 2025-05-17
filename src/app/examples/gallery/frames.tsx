"use client";

import { ThreeEvent, useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useRef } from "react";
import * as THREE from "three";
import { images } from "./gallery-data";
import { Frame, GOLDENRATIO } from "./frame";

type Location = {
  p: THREE.Vector3;
  q: THREE.Quaternion;
};

export const Frames = () => {
  const groupRef = useRef<THREE.Group>(null);
  const cameraLocation = useRef<Location | null>(null!);

  useFrame((state, dt) => {
    if (cameraLocation.current !== null) {
      const { p, q } = cameraLocation.current;
      const running = easing.damp3(state.camera.position, p, 0.4, dt);
      easing.dampQ(state.camera.quaternion, q, 0.4, dt);
      if (!running) {
        cameraLocation.current = null;
      }
    }
  });

  const handleClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const name = e.object.name;
    const group = groupRef.current!;
    const parent = group.getObjectByName(name)?.parent!;

    parent.updateWorldMatrix(true, true);
    cameraLocation.current = {
      p: parent.localToWorld(new THREE.Vector3(0, GOLDENRATIO / 2, 1.25)),
      q: parent.getWorldQuaternion(new THREE.Quaternion(0, 0, 0, 1)),
    };
  };

  const handlePointerMissed = (e: ThreeEvent<PointerEvent>) => {
    const p = new THREE.Vector3(0, 2, 5.5);
    const q = new THREE.Quaternion();
    q.setFromEuler(new THREE.Euler(-Math.atan(2 / 5.5), 0, 0));
    cameraLocation.current = { p, q };
  };

  return (
    <group ref={groupRef} onClick={handleClick} onPointerMissed={handlePointerMissed}>
      {images.map((image, index) => {
        return <Frame key={index} {...image} />;
      })}
    </group>
  );
};
