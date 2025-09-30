// DraggableCube Component
// This component demonstrates how to implement drag controls in React Three Fiber
// Users can click and drag this cube around the 3D scene

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useDraggableMesh } from './DragControlsManager';

// Define the props that this component can accept
interface DraggableCubeProps extends React.ComponentProps<'mesh'> {
  // Additional props specific to draggable functionality
  onDragStart?: () => void;  // Callback when dragging starts
  onDragEnd?: () => void;    // Callback when dragging ends
}

// Main DraggableCube component
export function DraggableCube({ 
  onDragStart, 
  onDragEnd, 
  ...meshProps 
}: DraggableCubeProps) {
  // Reference to the mesh object for Three.js operations
  const meshRef = useRef<THREE.Mesh>(null);
  
  // State to track if the object is currently being dragged
  const [isDragging, setIsDragging] = useState(false);
  
  // Get access to the drag mesh registration functions
  const { registerMesh, unregisterMesh } = useDraggableMesh();

  // Register this mesh as draggable when component mounts
  useEffect(() => {
    if (meshRef.current) {
      registerMesh(meshRef.current);
      
      // Add event listeners for visual feedback
      const mesh = meshRef.current;
      
      const handleDragStart = (event: any) => {
        // Provide visual feedback by changing the emissive color
        if (mesh.material && 'emissive' in mesh.material) {
          mesh.material.emissive.setHex(0x444444); // Gray glow
        }
        setIsDragging(true);
        onDragStart?.(); // Call optional callback
      };

      const handleDragEnd = (event: any) => {
        // Remove visual feedback
        if (mesh.material && 'emissive' in mesh.material) {
          mesh.material.emissive.setHex(0x000000); // No glow
        }
        setIsDragging(false);
        onDragEnd?.(); // Call optional callback
      };

      // Attach event listeners to the mesh
      mesh.addEventListener('dragstart', handleDragStart);
      mesh.addEventListener('dragend', handleDragEnd);

      // Cleanup function
      return () => {
        unregisterMesh(mesh);
        mesh.removeEventListener('dragstart', handleDragStart);
        mesh.removeEventListener('dragend', handleDragEnd);
      };
    }
  }, [registerMesh, unregisterMesh, onDragStart, onDragEnd]);

  // Animation loop - this runs every frame
  useFrame(() => {
    // You can add any continuous animations here
    // For example, a gentle rotation when not being dragged
    if (meshRef.current && !isDragging) {
      meshRef.current.rotation.y += 0.01; // Slow rotation
    }
  });

  return (
    <mesh 
      ref={meshRef}
      {...meshProps}
    >
      {/* 
        Cube geometry - creates a 3D cube shape
        args={[width, height, depth]} - in this case, a 1x1x1 cube
      */}
      <boxGeometry args={[1, 1, 1]} />
      
      {/* 
        Material that responds to lighting and provides visual feedback
        The emissive property will be modified during drag operations
      */}
      <meshStandardMaterial 
        color="#4fc3f7"        // Light blue color
        metalness={0.3}        // Slightly metallic appearance
        roughness={0.4}        // Some surface roughness
        emissive="#000000"     // No initial glow (will change during drag)
      />
    </mesh>
  );
}
