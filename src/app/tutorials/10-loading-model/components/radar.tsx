import { useGLTF } from "@react-three/drei";

export const Radar = () => {
  const radar = useGLTF("/radar.glb");
  return <primitive object={radar.scene} scale={0.5} position={[0, 0, 0]} rotation-y={0.3} />;
};

useGLTF.preload("/radar.glb");
