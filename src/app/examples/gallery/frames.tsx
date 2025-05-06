"use client";

import { Image, OrbitControls, Text, useCursor } from "@react-three/drei";
import { useFrame, Vector3 } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { easing } from "maath";
import { createServerSearchParamsForServerPage } from "next/dist/server/request/search-params";

const GOLDENRATIO = 1.61803398875;

type Rotation =
  | THREE.Euler
  | [x: number, y: number, z: number, order?: THREE.EulerOrder | undefined];

const pexel = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;

const images = [
  // Front
  {
    name: "1103970",
    position: [0, 0, 1.5],
    rotation: [0, 0, 0],
    url: pexel(1103970),
  },
  // Back
  {
    name: "416430",
    position: [-0.8, 0, -0.6],
    rotation: [0, 0, 0],
    url: pexel(416430),
  },
  {
    name: "310452",
    position: [0.8, 0, -0.6],
    rotation: [0, 0, 0],
    url: pexel(310452),
  },
  // Left
  {
    name: "327482",
    position: [-1.75, 0, 0.25],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(327482),
  },
  {
    name: "325185",
    position: [-2.15, 0, 1.5],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(325185),
  },
  {
    name: "358574",
    position: [-2, 0, 2.75],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(358574),
  },
  // Right
  {
    name: "227675",
    position: [1.75, 0, 0.25],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(227675),
  },
  {
    name: "911738",
    position: [2.15, 0, 1.5],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(911738),
  },
  {
    name: "1738986",
    position: [2, 0, 2.75],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(1738986),
  },
] satisfies Array<{
  name: string;
  position: Vector3;
  rotation: Rotation;
  url: string;
}>;

type Location = {
  p: THREE.Vector3;
  q: THREE.Quaternion;
};

export const Frames = () => {
  const groupRef = useRef<THREE.Group>(null);
  const locationRef = useRef<Location | null>(null!);

  useFrame((state, dt) => {
    if (locationRef.current !== null) {
      const { p, q } = locationRef.current;
      const running = easing.damp3(state.camera.position, p, 0.4, dt);
      easing.dampQ(state.camera.quaternion, q, 0.4, dt);

      if (!running) {
        console.log("finished");
        locationRef.current = null;
      }
    }
  });

  const gotoObject = (name: string | null) => {
    const group = groupRef.current!;
    if (name == null) {
      const p = new THREE.Vector3(0, 0, 5.5);
      const q = new THREE.Quaternion(0, 0, 0, 1);
      locationRef.current = { p: new THREE.Vector3(0, 0, 5.5), q: q };
    } else {
      const parent = group.getObjectByName(name)?.parent!;
      const p = new THREE.Vector3(0, GOLDENRATIO / 2, 1.25);
      const q = new THREE.Quaternion(0, 0, 0, 1);
      parent.updateWorldMatrix(true, true);
      parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25));
      parent.getWorldQuaternion(q);
      locationRef.current = { p, q };
    }
  };

  return (
    <>
      {/* <OrbitControls enableDamping={false} enabled={enableControl} /> */}
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          gotoObject(e.object.name);
        }}
        onPointerMissed={() => {
          gotoObject(null);
        }}
      >
        {images.map((image, index) => {
          return <Frame key={index} {...image} />;
        })}
      </group>
    </>
  );
};

const Frame = ({
  name,
  position,
  rotation,
  url,
  color = new THREE.Color(),
}: {
  name: string;
  position: Vector3;
  rotation: Rotation;
  url: string;
  color?: THREE.Color;
}) => {
  const imageRef = useRef<THREE.Mesh>(null);
  const frameRef = useRef<THREE.Mesh>(null);
  const rnd = useMemo(() => Math.random(), []);
  const [hover, setHover] = useState(false);

  useCursor(hover);

  useFrame((state, dt) => {
    const image = imageRef.current!;
    const imageMaterial = image.material as any;
    const frameMaterial = frameRef.current!.material as THREE.MeshBasicMaterial;

    imageMaterial.zoom =
      2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;

    const [scaleX, scaleY] = hover ? [0.85, 0.905] : [1, 1];
    easing.damp3(image.scale, [0.85 * scaleX, 0.9 * scaleY, 1], 0.1, dt);

    const color = hover ? "orange" : "white";
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
        <meshStandardMaterial
          color="#151515"
          metalness={0.5}
          roughness={0.5}
          envMapIntensity={2}
        />
        <mesh
          ref={frameRef}
          scale={[0.9, 0.94, 0.9]}
          position={[0, 0, 0.2]}
          raycast={() => null}
        >
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image
          ref={imageRef}
          position={[0, 0, 0.7]}
          url={url}
          raycast={() => null}
        />
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
