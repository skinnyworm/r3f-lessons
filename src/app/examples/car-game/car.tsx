import { Clone, useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { MeshStandardMaterial } from "three";

export const CAR_MODELS = ["sedan", "suv", "taxi", "ambulance", "police", "truck", "firetruck"];

export const Car = ({ model = CAR_MODELS[0], ...props }) => {
  const { scene } = useGLTF(`/car-game/cars/${model}.glb`);
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        if (child.material.name === "window") {
          child.material.transparent = true;
          child.material.opacity = 0.5;
        }
        if (child.material.name.startsWith("paint") || child.material.name === "wheelInside") {
          // child.material.rougness = 0.1;
          // child.material.metalness = 1.0;

          child.material = new MeshStandardMaterial({
            color: child.material.color,
            metalness: 0.5,
            roughness: 0.1,
          });
        }
        // console.log(child.material.name);
        if (child.material.name.startsWith("light")) {
          child.material.emissive = child.material.color;
          child.material.emissiveIntensity = 4;
          child.material.toneMapped = false;
        }
      }
    });
  }, [scene]);
  return (
    <group {...props}>
      <Clone object={scene} rotation-y={Math.PI} castShadow />
    </group>
  );
};

CAR_MODELS.forEach((model) => {
  useGLTF.preload(`/car-game/cars/${model}.glb`);
});
