// Interactive XR Cube Component
// Demonstrates XR-specific interactions that work in both AR and VR modes
// This cube changes color when interacted with in immersive environments

'use client';

import React, { useState } from 'react';
import { useXR } from '@react-three/xr';  // Hook to access XR session state

// Component that creates an interactive cube specifically designed for XR
export function XRInteractiveCube() {
  // State to track whether the cube should be red or blue
  const [isRed, setIsRed] = useState(false);
  
  // XR hook to access the current XR session
  // This tells us if we're currently in AR or VR mode
  const session = useXR((state) => state.session);
  const isPresenting = session !== null;
  
  // Function to toggle the cube's color
  const toggleColor = () => {
    setIsRed(!isRed);
  };
  
  return (
    <mesh
      // Position the cube in front of the user in XR space
      position={[0, 1, -1]}
      
      // XR INTERACTION PROPERTIES
      // These properties are essential for XR interactions
      pointerEventsType={{ deny: 'grab' }}  // Allow clicking but prevent grabbing
      
      // INTERACTION EVENTS
      // onClick works in both desktop and XR environments
      onClick={toggleColor}
    >
      {/* 
        Cube geometry - creates a 3D cube shape
        args={[1, 1, 1]} creates a 1x1x1 unit cube
      */}
      <boxGeometry args={[1, 1, 1]} />
      
      {/* 
        Material that changes color based on state
        In XR, this visual feedback helps users understand their interactions
      */}
      <meshBasicMaterial 
        color={isRed ? 'red' : 'blue'}  // Toggle between red and blue
      />
      
      {/* 
        Optional: Add some visual feedback for XR users
        This text will only show when in XR mode to guide users
      */}
      {isPresenting && (
        <mesh position={[0, 1.5, 0]}>
          {/* Simple text representation - in a real app you might use Text3D from drei */}
          <boxGeometry args={[2, 0.2, 0.1]} />
          <meshBasicMaterial color="white" transparent opacity={0.8} />
        </mesh>
      )}
    </mesh>
  );
}
