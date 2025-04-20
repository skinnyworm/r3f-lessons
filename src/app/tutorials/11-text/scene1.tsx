"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Box, Center, FontData, OrbitControls, Text3D } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function Scene() {
  return (
    <AspectRatio ratio={16 / 9} className="bg-muted">
      <Canvas camera={{ position: [-5, 5, 5], fov: 45 }} shadows>
        <color attach="background" args={["#000"]} />
        <OrbitControls />
        <Box>
          <meshNormalMaterial />
        </Box>

        <Center>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={1}
            height={0.2}
            curveSegments={12}
            bevelEnabled={true}
            bevelThickness={0.03}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
          >
            Hello World
            <meshNormalMaterial />
          </Text3D>
        </Center>
      </Canvas>
    </AspectRatio>
  );
}
