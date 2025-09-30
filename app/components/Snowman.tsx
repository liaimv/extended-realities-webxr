// Interactive 3D Snowman model component that loads a GLTF file
// This demonstrates advanced concepts: file loading, state management, and user interaction

import * as THREE from 'three'
import React, { useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTFResult } from '../types/gltf'

// Component that renders a 3D snowman model with interactive features
// It accepts group props, which means you can position, rotate, and scale the entire model
export function Model(props: React.ComponentProps<'group'>) {
  
  // GLTF LOADING
  // useGLTF hook loads a 3D model file and extracts its parts
  // The file '/Snowman (Final).glb' must be in the public folder
  const { nodes, materials } = useGLTF('/Snowman (Final).glb') as unknown as GLTFResult
  
  // Debug: Log the available nodes and materials to console
  console.log('Snowman nodes:', Object.keys(nodes));
  console.log('Snowman materials:', Object.keys(materials));
  
  // STATE MANAGEMENT
  // useState hook manages the snowman's position in 3D space
  // The position is an array of [x, y, z] coordinates
  // TypeScript annotation ensures type safety
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0])
  
  // INTERACTION HANDLER
  // Function that generates a random position when the snowman is clicked
  const randomizePosition = () => {
    // Math.random() gives 0-1, subtract 0.5 to get -0.5 to 0.5, multiply by 15 for -7.5 to +7.5 range
    const randomX = (Math.random() - 0.5) * 15 // Random X coordinate between -7.5 and +7.5
    const randomZ = (Math.random() - 0.5) * 15 // Random Z coordinate between -7.5 and +7.5
    // Y is set to 0 to position the snowman on the grid floor
    setPosition([randomX, 0, randomZ])
  }
  
  return (
    // group is like a container that holds multiple 3D objects together
    // It's useful for organizing complex models with multiple parts
    // dispose={null} prevents automatic cleanup, position applies our state
    <group {...props} dispose={null} position={position}>
      
      {/* 
        Render all nodes from the GLTF file
        This approach handles any structure the GLTF file might have
      */}
      {Object.entries(nodes).map(([name, node]) => {
        // Skip non-mesh nodes and ensure it's a valid mesh
        if (!node || !(node as THREE.Mesh).geometry) return null;
        
        return (
          <mesh
            key={name}
            geometry={(node as THREE.Mesh).geometry}
            material={(node as THREE.Mesh).material}
            
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
        );
      })}
    </group>
  )
}

// PERFORMANCE OPTIMIZATION
// Preload the GLTF file so it's ready when the component mounts
// This prevents loading delays when the component first renders
useGLTF.preload('/Snowman (Final).glb')
