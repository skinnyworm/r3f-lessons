import { Vector3 } from "@react-three/fiber";
import * as THREE from "three";

type GalleryData = {
  id: string;
  name: string;
  position: Vector3;
  rotation: Rotation;
  url: string;
};

export type Rotation = THREE.Euler | [x: number, y: number, z: number, order?: THREE.EulerOrder | undefined];

const pexel = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;

export const images: GalleryData[] = [
  // Front
  {
    id: "7182218",
    name: "Alesia Kozik",
    position: [0, 0, 1.5],
    rotation: [0, 0, 0],
    url: pexel(7182218),
  },
  // Back
  {
    id: "1585325",
    name: "Steve Johnson",
    position: [-0.8, 0, -0.6],
    rotation: [0, 0, 0],
    url: pexel(1585325),
  },
  {
    id: "3089254",
    name: "JJ Jordan",
    position: [0.8, 0, -0.6],
    rotation: [0, 0, 0],
    url: pexel(3089254),
  },
  // Left
  {
    id: "327482",
    name: "327482",
    position: [-1.75, 0, 0.25],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(327482),
  },
  {
    id: "325185",
    name: "325185",
    position: [-2.15, 0, 1.5],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(325185),
  },
  {
    id: "358574",
    name: "358574",
    position: [-2, 0, 2.75],
    rotation: [0, Math.PI / 2.5, 0],
    url: pexel(358574),
  },
  // Right
  {
    id: "227675",
    name: "227675",
    position: [1.75, 0, 0.25],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(227675),
  },
  {
    id: "5987621",
    name: "Eva Bronzini",
    position: [2.15, 0, 1.5],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(5987621),
  },
  {
    id: "1738986",
    name: "1738986",
    position: [2, 0, 2.75],
    rotation: [0, -Math.PI / 2.5, 0],
    url: pexel(1738986),
  },
];
