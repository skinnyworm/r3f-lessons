import { create } from "zustand";

type CubeStore = {
  cubes: Array<{
    x: number;
    y: number;
    z: number;
  }>;
  addCube: (x: number, y: number, z: number) => void;
};

export const useCubeStore = create<CubeStore>((set) => {
  return {
    cubes: [{ x: 0, y: 0.5, z: -3 }],
    addCube(x: number, y: number, z: number) {
      set((state) => ({
        ...state,
        cubes: [...state.cubes, { x, y, z }],
      }));
    },
  };
});
