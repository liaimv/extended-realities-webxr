'use client';

import { useGLTF } from '@react-three/drei';
import { GLTFResult } from '../types/gltf';

// Component for the Candy Cane model
// This component loads and displays the 3D candy cane model
export default function CandyCane(props: any) {
  // Load the GLB model using the useGLTF hook from drei
  // This hook automatically handles loading and caching of 3D models
  const { nodes, materials } = useGLTF('/Candy Cane.glb') as GLTFResult;

  return (
    <group {...props} dispose={null}>
      {/* 
        The group contains all the meshes from the GLB file
        We iterate through all nodes to render the complete model
        This ensures all parts of the candy cane are displayed
      */}
      {Object.values(nodes).map((node, index) => {
        // Only render mesh objects (skip lights, cameras, etc.)
        if (node.type === 'Mesh') {
          return (
            <mesh
              key={index}
              geometry={node.geometry}
              material={node.material}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
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
useGLTF.preload('/Candy Cane.glb');
