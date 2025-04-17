"use client";

import { OrbitControls, PerspectiveCamera, useHelper } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Fragment, useRef } from "react";
import * as THREE from "three";
import { Box } from "./box";
import { Plan } from "./plane";
import { Ball } from "./ball";

export function Demo() {
  return (
    <div className="relative w-full h-[600px] bg-black">
      <Canvas shadows>
        <Scene />
      </Canvas>
    </div>
  );
}

type THREE3DObjectRef = React.RefObject<THREE.Object3D>;

function Scene() {
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  useHelper(pointLightRef as THREE3DObjectRef, THREE.PointLightHelper, 0.2, "red");

  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  useHelper(spotLightRef as THREE3DObjectRef, THREE.SpotLightHelper, "white");

  return (
    <Fragment>
      <PerspectiveCamera position={[0, 2, 6]} makeDefault />
      <ambientLight intensity={0.3} />
      <spotLight ref={spotLightRef} position={[0, 3, 0]} angle={0.7} penumbra={1} intensity={1} castShadow />
      <pointLight ref={pointLightRef} position={[2, 2, -1]} color="white" castShadow />
      <directionalLight position={[2, 2, -1]} color="white" castShadow intensity={5} />
      <Box />
      <Ball />
      <Plan />
      <axesHelper args={[1]} />
      <OrbitControls />
    </Fragment>
  );
}
