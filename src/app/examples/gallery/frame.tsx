"use client";

import { Image, Text, useCursor } from "@react-three/drei";
import { ThreeElements, useFrame, Vector3 } from "@react-three/fiber";
import { easing } from "maath";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Rotation } from "./gallery-data";

export const GOLDENRATIO = 1.61803398875;

export const Frame = ({
  name,
  position,
  rotation,
  url,
}: {
  name: string;
  position: Vector3;
  rotation: Rotation;
  url: string;
}) => {
  const imageRef = useRef<THREE.Mesh>(null!);
  const frameRef = useRef<THREE.Mesh>(null!);
  const rnd = useMemo(() => Math.random(), []);
  const [hover, setHover] = useState(false);

  useCursor(hover);

  useFrame((state, dt) => {
    const image = imageRef.current;
    const imageMaterial = image.material as unknown as ThreeElements["imageMaterial"];
    const frameMaterial = frameRef.current.material as THREE.MeshBasicMaterial;

    imageMaterial.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;

    const scale = hover ? 0.9 : 1;
    easing.damp3(image.scale, [0.8 * scale, 0.9 * scale, 1], 0.1, dt);

    const color = hover ? "silver" : "white";
    easing.dampC(frameMaterial.color, color, 0.1, dt);
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh
        name={name}
        position={[0, GOLDENRATIO / 2, 0]}
        scale={[1, GOLDENRATIO, 0.05]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
        onPointerOut={(e) => {
          setHover(false);
        }}
      >
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={1} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frameRef} scale={[0.9, 0.94, 0.9]} position={[0, 0, 0.2]} raycast={() => null}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image ref={imageRef} position={[0, 0, 0.7]} url={url} raycast={() => null} />
      </mesh>
      <Text
        maxWidth={0.1}
        anchorX="left"
        anchorY="top"
        fontSize={0.025}
        position={[0.55, GOLDENRATIO, 0]}
        // raycast={() => null}
      >
        {name}
      </Text>
    </group>
  );
};
