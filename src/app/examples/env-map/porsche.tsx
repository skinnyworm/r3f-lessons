"use client";

import { useGLTF } from "@react-three/drei";
import { applyProps, ThreeElements } from "@react-three/fiber";
import { useLayoutEffect } from "react";

export const Porsche = (props: Omit<ThreeElements["primitive"], "object">) => {
  const { scene, nodes, materials } = useGLTF("/911-transformed.glb");

  useLayoutEffect(() => {
    Object.values(nodes).forEach((node: any) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    const { rubber, window, coat, paint } = materials;
    applyProps(rubber, { color: "#222", roughness: 0.6, roughnessMap: null, normalScale: [4, 4] });
    applyProps(window, { color: "black", roughness: 0, clearcoat: 0.1 });
    applyProps(coat, { envMapIntensity: 4, roughness: 0.5, metalness: 1 });
    applyProps(paint, { color: "#555", envMapIntensity: 2, roughness: 0.45, metalness: 0.8 });
  }, [nodes, materials]);

  return <primitive object={scene} {...props} />;
};
