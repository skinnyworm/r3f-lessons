import { Box } from "@react-three/drei";

export function PlaceHolder() {
  return (
    <Box args={[1, 1, 1]}>
      <meshStandardMaterial color="white" wireframe />
    </Box>
  );
}
