// DragControlsManager Component
// This component manages the interaction between OrbitControls and DragControls
// It ensures that camera controls don't interfere with object dragging

'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DragControls } from 'three-stdlib';

// Props for the manager component
interface DragControlsManagerProps {
  children: React.ReactNode;
}

// Component that manages both OrbitControls and DragControls
export function DragControlsManager({ children }: DragControlsManagerProps) {
  // Reference to OrbitControls
  const orbitControlsRef = useRef<any>(null);
  
  // Reference to DragControls
  const dragControlsRef = useRef<DragControls | null>(null);
  
  // Array to store draggable mesh objects
  const draggableMeshes = useRef<THREE.Mesh[]>([]);
  
  // Get access to Three.js camera and renderer
  const { camera, gl } = useThree();

  // Function to register a mesh as draggable
  const registerDraggableMesh = useCallback((mesh: THREE.Mesh) => {
    if (mesh && !draggableMeshes.current.includes(mesh)) {
      draggableMeshes.current.push(mesh);
      
      // If drag controls already exist, add this mesh to them
      if (dragControlsRef.current) {
        dragControlsRef.current.getObjects().push(mesh);
      }
    }
  }, []);

  // Function to unregister a mesh from being draggable
  const unregisterDraggableMesh = useCallback((mesh: THREE.Mesh) => {
    draggableMeshes.current = draggableMeshes.current.filter(m => m !== mesh);
    
    // If drag controls exist, remove this mesh from them
    if (dragControlsRef.current) {
      const objects = dragControlsRef.current.getObjects();
      const index = objects.indexOf(mesh);
      if (index > -1) {
        objects.splice(index, 1);
      }
    }
  }, []);

  // Set up drag controls and manage interactions
  useEffect(() => {
    if (draggableMeshes.current.length > 0) {
      // Create drag controls for all draggable objects
      const dragControls = new DragControls(draggableMeshes.current, camera, gl.domElement);
      dragControlsRef.current = dragControls;

      // Handle drag start - disable orbit controls
      const handleDragStart = () => {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = false;
        }
      };

      // Handle drag end - re-enable orbit controls
      const handleDragEnd = () => {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = true;
        }
      };

      // Attach event listeners
      dragControls.addEventListener('dragstart', handleDragStart);
      dragControls.addEventListener('dragend', handleDragEnd);

      // Cleanup function
      return () => {
        dragControls.removeEventListener('dragstart', handleDragStart);
        dragControls.removeEventListener('dragend', handleDragEnd);
      };
    }
  }, [camera, gl]);

  return (
    <>
      {/* 
        OrbitControls for camera movement
        This allows users to orbit around the scene when not dragging objects
      */}
      <OrbitControls 
        ref={orbitControlsRef}
        enablePan={true}      // Allow panning (moving the camera)
        enableZoom={true}     // Allow zooming in/out
        enableRotate={true}   // Allow rotating around the scene
      />
      
      {/* 
        Render children components with the registration function
        This is where the draggable objects will be rendered
      */}
      <DraggableMeshProvider 
        registerMesh={registerDraggableMesh}
        unregisterMesh={unregisterDraggableMesh}
      >
        {children}
      </DraggableMeshProvider>
    </>
  );
}

// Context for providing mesh registration functions
const DraggableMeshContext = React.createContext<{
  registerMesh: (mesh: THREE.Mesh) => void;
  unregisterMesh: (mesh: THREE.Mesh) => void;
} | null>(null);

// Provider component for the context
function DraggableMeshProvider({ 
  children, 
  registerMesh, 
  unregisterMesh 
}: {
  children: React.ReactNode;
  registerMesh: (mesh: THREE.Mesh) => void;
  unregisterMesh: (mesh: THREE.Mesh) => void;
}) {
  return (
    <DraggableMeshContext.Provider value={{ registerMesh, unregisterMesh }}>
      {children}
    </DraggableMeshContext.Provider>
  );
}

// Hook to use the mesh registration functions
export function useDraggableMesh() {
  const context = React.useContext(DraggableMeshContext);
  if (!context) {
    throw new Error('useDraggableMesh must be used within a DragControlsManager');
  }
  return context;
}
