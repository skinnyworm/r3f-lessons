import { MaterialNode, Object3DNode, ThreeElement } from "@react-three/fiber";
import * as THREE from "three";

// r3f-types.d.ts
declare module "@react-three/fiber" {
  interface ThreeElements {
    tline: ThreeElement<typeof THREE.Line>;
    meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
    meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}
