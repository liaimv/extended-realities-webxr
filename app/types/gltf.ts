import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

// Generic GLTF result type that can be used for any GLTF model
export type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Object3D>;
  materials: Record<string, THREE.Material>;
  animations: THREE.AnimationClip[];
};

// Props type for 3D model components
export interface ModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  [key: string]: unknown; // Allow other props to be passed through
}