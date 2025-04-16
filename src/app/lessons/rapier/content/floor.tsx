import { Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export const Floor = () => (
  <RigidBody type="fixed" friction={2} name="floor">
    <Box position={[0, 0, 0]} args={[15, 0.5, 15]} receiveShadow>
      <meshStandardMaterial color="springgreen" />
    </Box>
  </RigidBody>
);
