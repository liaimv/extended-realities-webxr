'use client';

import { useMemo } from 'react';
import CandyCane from './CandyCane';
import CottonCandy from './CottonCandy';
import Lollipop from './Lollipop';

// Component that randomly spawns candy models throughout the scene
// This creates a festive environment with multiple instances of each candy type
export default function RandomSpawner() {
  // Generate random positions and Y rotations for all models using useMemo for performance
  // This ensures the positions and rotations are calculated once and don't change on re-renders
  const candyData = useMemo(() => {
    const data: Array<{ x: number; z: number; rotationY: number }> = [];
    
    // Generate 60 random positions (20 for each candy type)
    // We'll use a larger range to avoid overlapping with existing models
    for (let i = 0; i < 60; i++) {
      let x: number, z: number;
      let attempts = 0;
      const maxAttempts = 100;
      
      // Keep trying until we find a position that doesn't overlap with existing models
      let isValidPosition = false;
      do {
        // Random X position between -50 and 50 (larger spawn area)
        x = (Math.random() - 0.5) * 100;
        // Random Z position between -50 and 50 (larger spawn area)
        z = (Math.random() - 0.5) * 100;
        
        // Check if position is too close to existing models
        const isTooCloseToHouse = Math.abs(x) < 8 && Math.abs(z) < 8; // House area
        const isTooCloseToWagon = Math.abs(x - 15) < 5 && Math.abs(z - 5) < 5; // Wagon area
        const isTooCloseToExisting = data.some(pos => 
          Math.abs(pos.x - x) < 3 && Math.abs(pos.z - z) < 3
        );
        
        // Check if position is valid (not too close to anything)
        isValidPosition = !isTooCloseToHouse && !isTooCloseToWagon && !isTooCloseToExisting;
        
        attempts++;
      } while (!isValidPosition && attempts < maxAttempts);
      
      // Generate random Y rotation (0 to 2π radians, which is 0 to 360 degrees)
      const rotationY = Math.random() * Math.PI * 2;
      
      data.push({ x, z, rotationY });
    }
    
    return data;
  }, []);

  return (
    <>
      {/* Spawn 20 Candy Canes with random positions and Y rotations */}
      {Array.from({ length: 20 }, (_, index) => (
        <CandyCane
          key={`candy-cane-${index}`}
          position={[
            candyData[index].x,          // Random X position
            3,                          // Preserve Y position from original
            candyData[index].z          // Random Z position
          ]}
          rotation={[0, candyData[index].rotationY, 0]}  // Random Y rotation
          scale={[1, 5, 0.8]}          // Preserve scale from original
        />
      ))}
      
      {/* Spawn 20 Cotton Candy with random positions and Y rotations */}
      {Array.from({ length: 20 }, (_, index) => (
        <CottonCandy
          key={`cotton-candy-${index}`}
          position={[
            candyData[index + 20].x,      // Random X position (using next 20 positions)
            11,                           // Preserve Y position from original
            candyData[index + 20].z       // Random Z position
          ]}
          rotation={[0, candyData[index + 20].rotationY, -Math.PI / 25]}  // Random Y rotation + original Z rotation
          scale={[10, 10, 10]}             // Preserve scale from original
        />
      ))}
      
      {/* Spawn 20 Lollipops with random positions and Y rotations */}
      {Array.from({ length: 20 }, (_, index) => (
        <Lollipop
          key={`lollipop-${index}`}
          position={[
            candyData[index + 40].x,       // Random X position (using last 20 positions)
            0,                            // Preserve Y position from original
            candyData[index + 40].z        // Random Z position
          ]}
          rotation={[Math.PI / 5, 0, 0]}  // Original X rotation + random Y rotation
          scale={[4, 4, 4]}                // Preserve scale from original
        />
      ))}
    </>
  );
}
