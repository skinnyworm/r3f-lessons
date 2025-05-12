import { MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Fragment, ReactNode, useRef, useState } from "react";
import { easing } from "maath";
import * as THREE from "three";

export const Selector = ({ children }: { children: ReactNode }) => {
  const ref = useRef<THREE.Mesh>(null);
  const [open, setOpen] = useState(false);

  useFrame((state, dt) => {
    const { viewport, camera, pointer } = state;
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, 3]);
    const mesh = ref.current!;
    const material = mesh.material as THREE.MeshStandardMaterial;
    easing.damp3(mesh.position, [(pointer.x * width) / 2, (pointer.y * height) / 2, 3], open ? 0 : 0.1, dt);
    easing.damp3(mesh.scale, open ? 4 : 0.01, open ? 0.5 : 0.2, dt);
    easing.dampC(material.color, open ? "#f0f0f0" : "#ccc", 0.1, dt);
  });
  return (
    <Fragment>
      <mesh ref={ref} scale={0.01}>
        <circleGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          samples={16}
          resolution={512}
          anisotropicBlur={0.1}
          thickness={0.1}
          roughness={0.4}
          toneMapped={true}
        />
      </mesh>
      <group onPointerOver={() => setOpen(true)} onPointerOut={() => setOpen(false)}>
        {children}
      </group>
    </Fragment>
  );
};
