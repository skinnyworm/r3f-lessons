"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Box, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, Vector3 } from "@react-three/fiber";
import { Suspense } from "react";

export const Example1 = () => {
  return (
    <AspectRatio ratio={16 / 9} className="bg-muted">
      <Canvas camera={{ position: [-5, 5, 5], fov: 45 }} shadows>
        <color attach="background" args={["#000"]} />
        <OrbitControls makeDefault={true} />

        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={3} />

        <Box args={[10, 0.5, 10]} position={[0, -0.25, 0]} rotation={[0, 0, 0]} receiveShadow>
          <meshStandardMaterial color="white" />
        </Box>

        <Suspense fallback={<PlaceHolder />}>
          <Helmet />
        </Suspense>
        <axesHelper args={[3]} />
      </Canvas>
    </AspectRatio>
  );
};

const Helmet = ({ position, scale = 3 }: { position?: Vector3; scale?: number }) => {
  const model = useGLTF("/FlightHelmet/glTF/FlightHelmet.gltf");
  return <primitive object={model.scene} position={position} scale={scale} />;
};

const PlaceHolder = () => {
  return (
    <Box args={[1, 1, 1]}>
      <meshStandardMaterial color="white" wireframe />
    </Box>
  );
};
