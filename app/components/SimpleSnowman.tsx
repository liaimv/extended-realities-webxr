// Simple Snowman Component using primitive object
// This approach is more reliable for complex GLTF files

import React, { useState } from 'react';
import { useGLTF } from '@react-three/drei';

export function SimpleSnowman(props: React.ComponentProps<'group'>) {
  // Load the GLTF file
  const { scene } = useGLTF('/Snowman (Final).glb');
  
  // STATE MANAGEMENT
  // useState hook manages the snowman's position in 3D space
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  
  // INTERACTION HANDLER
  // Function that generates a random position when the snowman is clicked
  const randomizePosition = () => {
    // Math.random() gives 0-1, subtract 0.5 to get -0.5 to 0.5, multiply by 15 for -7.5 to +7.5 range
    const randomX = (Math.random() - 0.5) * 15; // Random X coordinate between -7.5 and +7.5
    const randomZ = (Math.random() - 0.5) * 15; // Random Z coordinate between -7.5 and +7.5
    // Y is set to 0 to position the snowman on the grid floor
    setPosition([randomX, 0, randomZ]);
  };
  
  return (
    <group {...props} position={position}>
      {/* 
        Use primitive to render the entire GLTF scene
        This is the most reliable way to render complex GLTF files
      */}
      <primitive
        object={scene.clone()}
        
        // XR INTERACTION PROPERTIES
        // These properties enable interaction in AR/VR environments
        pointerEventsType={{ deny: 'grab' }}  // Allow clicking/touching but prevent grabbing
        
        // INTERACTION EVENTS
        // onClick: When user clicks the snowman, trigger position randomization
        onClick={randomizePosition}
        
        // onPointerOver: When mouse hovers over the snowman
        onPointerOver={(e) => {
          // Mark the object as hovered (useful for other effects)
          e.object.parent!.userData.hovered = true;
          // Change cursor to pointer to indicate it's clickable
          document.body.style.cursor = 'pointer';
        }}
        
        // onPointerOut: When mouse leaves the snowman
        onPointerOut={(e) => {
          // Remove hovered state
          e.object.parent!.userData.hovered = false;
          // Reset cursor back to default
          document.body.style.cursor = 'default';
        }}
      />
    </group>
  );
}

// PERFORMANCE OPTIMIZATION
// Preload the GLTF file so it's ready when the component mounts
useGLTF.preload('/Snowman (Final).glb');

