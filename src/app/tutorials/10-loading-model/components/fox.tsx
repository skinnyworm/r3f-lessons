import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";

export const Fox = () => {
  const fox = useGLTF("/Fox/glTF/Fox.gltf");
  const animations = useAnimations(fox.animations, fox.scene);
  const [seq, setSeq] = useState(0);

  const toggleNextAnimation = () => {
    const len = animations.names.length;
    if (len > 0) {
      setSeq((prev) => {
        const next = prev + 1;
        return next >= len ? 0 : next;
      });
    }
  };

  useEffect(() => {
    const animationName = animations.names[seq];
    const action = animations.actions[animationName]!;
    action.reset().fadeIn(0.5).play();
    return () => {
      action.fadeOut(0.5);
    };
  }, [seq]);

  return (
    <primitive object={fox.scene} scale={0.02} position={[0, 0, 0]} rotation-y={0.3} onClick={toggleNextAnimation} />
  );
};

useGLTF.preload("/Fox/glTF/Fox.gltf");
