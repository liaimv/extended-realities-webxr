'use client';

import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFResult, ModelProps } from '../types/gltf';

// Component for the Ginger Bread House model
// This component loads and displays the 3D ginger bread house model
export default function GingerBreadHouse(props: ModelProps) {
  // Load the GLB model using the useGLTF hook from drei
  // This hook automatically handles loading and caching of 3D models
  const { nodes } = useGLTF('/Ginger Bread House.glb') as GLTFResult;

  return (
    <group {...props} dispose={null}>
      {/* 
        The group contains all the meshes from the GLB file
        We iterate through all nodes to render the complete model
        This ensures all parts of the ginger bread house are displayed
      */}
      {Object.values(nodes).map((node, index) => {
        // Only render mesh objects (skip lights, cameras, etc.)
        if (node.type === 'Mesh') {
          const mesh = node as THREE.Mesh;
          return (
            <mesh
              key={index}
              geometry={mesh.geometry}
              material={mesh.material}
              position={mesh.position}
              rotation={mesh.rotation}
              scale={mesh.scale}
              castShadow
              receiveShadow
            />
          );
        }
        return null;
      })}
    </group>
  );
}

// Preload the model for better performance
// This tells React Three Fiber to load the model in advance
useGLTF.preload('/Ginger Bread House.glb');
