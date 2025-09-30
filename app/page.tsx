// This directive tells Next.js that this component runs on the client-side
// It's needed because we're using browser-specific features like 3D graphics
'use client';

// Import required components
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Grid, Environment } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// Import our custom 3D model components
import GingerBreadHouse from './components/GingerBreadHouse';
import Gift from './components/Gift';
import ChristmasTree from './components/ChristmasTree';
import GingerBreadWagon from './components/GingerBreadWagon';
import RandomSpawner from './components/RandomSpawner';

// First-person controller component that handles mouse look and WASD movement
function FirstPersonController() {
  const { camera } = useThree();
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const [mouseSensitivity] = useState(0.002);
  const [moveSpeed] = useState(5);
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  // Handle keyboard input for movement
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          moveForward.current = true;
          break;
        case 'KeyS':
          moveBackward.current = true;
          break;
        case 'KeyA':
          moveLeft.current = true;
          break;
        case 'KeyD':
          moveRight.current = true;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
          moveForward.current = false;
          break;
        case 'KeyS':
          moveBackward.current = false;
          break;
        case 'KeyA':
          moveLeft.current = false;
          break;
        case 'KeyD':
          moveRight.current = false;
          break;
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isPointerLocked) return;
      
      // Mouse look - rotate camera based on mouse movement
      const deltaX = event.movementX * mouseSensitivity;
      const deltaY = event.movementY * mouseSensitivity;
      
      // Get current rotation as Euler angles
      const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
      
      // Apply yaw rotation (horizontal mouse movement around Y axis)
      euler.y -= deltaX;
      
      // Apply pitch rotation (vertical mouse movement around X axis) with limits
      euler.x -= deltaY;
      euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
      
      // Keep roll at 0 (no Z-axis rotation for standard FPS controls)
      euler.z = 0;
      
      // Apply the new rotation
      camera.quaternion.setFromEuler(euler);
    };

    const handlePointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement === document.body);
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [camera, mouseSensitivity, isPointerLocked]);

  // Update movement every frame
  useFrame((state, delta) => {
    if (!isPointerLocked) return;

    // Calculate movement direction based on camera rotation
    direction.current.set(0, 0, 0);
    
    if (moveForward.current) {
      direction.current.z += 1;
    }
    if (moveBackward.current) {
      direction.current.z -= 1;
    }
    if (moveLeft.current) {
      direction.current.x -= 1;
    }
    if (moveRight.current) {
      direction.current.x += 1;
    }

    // Normalize direction to prevent faster diagonal movement
    if (direction.current.length() > 0) {
      direction.current.normalize();
    }

    // Apply movement speed and delta time
    const moveDistance = moveSpeed * delta;
    
    // Calculate movement in world space based on camera rotation
    const forward = new THREE.Vector3(0, 0, -1);
    const right = new THREE.Vector3(1, 0, 0);
    
    forward.applyQuaternion(camera.quaternion);
    right.applyQuaternion(camera.quaternion);
    
    // Don't move vertically (keep Y at 0)
    forward.y = 0;
    right.y = 0;
    forward.normalize();
    right.normalize();
    
    // Calculate final movement vector
    const moveVector = new THREE.Vector3();
    moveVector.addScaledVector(forward, direction.current.z * moveDistance);
    moveVector.addScaledVector(right, direction.current.x * moveDistance);
    
    // Apply movement to camera position
    camera.position.add(moveVector);
  });

  // Handle click to enable pointer lock
  const handleClick = () => {
    if (!isPointerLocked) {
      document.body.requestPointerLock();
    }
  };

  return null;
}

// Main homepage component that renders our 3D scene
export default function Home() {
  return (
    // Container div that takes up the full viewport (100% width and height)
    <div style={{ width: '100vw', height: '100vh' }}>
      
      {/* 
        INSTRUCTIONS OVERLAY
        This shows users how to control the first-person camera
        It's positioned in the top-left corner for easy reference
      */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>First-Person Controls:</div>
        <div>• Click anywhere to enable mouse look</div>
        <div>• WASD keys to move</div>
        <div>• Mouse to look around</div>
        <div>• ESC to exit mouse lock</div>
      </div>
      
      {/* 
        Canvas is the main React Three Fiber component that creates a 3D scene
        It sets up WebGL context and handles rendering
        camera prop sets the initial camera position [x, y, z] at ground level
      */}
      <Canvas 
        camera={{ position: [0, 2, 15] }}
        onClick={() => {
          if (!document.pointerLockElement) {
            document.body.requestPointerLock();
          }
        }}
      >
        
        {/* 
          LIGHTING SETUP
          We use multiple light sources to create depth and visual interest
        */}
        
        {/* Ambient light provides soft, overall illumination without direction */}
        <ambientLight intensity={0.4} />
        
        {/* Directional light simulates sunlight - comes from one direction */}
        <directionalLight 
          position={[10, 10, 5]}  // Position in 3D space [x, y, z]
          intensity={1.0}         // How bright the light is
          castShadow              // Enable this light to cast shadows
        />
        
        {/* Point light radiates in all directions from a single point */}
        <pointLight 
          position={[-10, -10, -5]}  // Positioned opposite to main light
          intensity={0.5}            // Dimmer than main light
          color="#ffffff"            // Pure white light
        />
        
        {/* Spot light creates a cone of light, like a flashlight */}
        <spotLight
          position={[0, 10, 0]}  // Directly above the scene
          angle={0.3}            // Width of the light cone
          penumbra={1}           // Softness of light edges (0 = sharp, 1 = very soft)
          intensity={0.3}        // Gentle fill light
          castShadow             // Enable shadow casting
        />
        
        {/* 
          SKYBOX ENVIRONMENT
          This creates a beautiful sky environment using the HDR file
          The Environment component automatically creates a skybox that surrounds the entire scene
        */}
        <Environment 
          files="/Puresky.hdr"    // Path to the HDR skybox file
          background={true}       // Use the HDR as the background
          environmentIntensity={0.5}  // How bright the environment lighting is
        />
        
        {/* 
          FIRST-PERSON CONTROLLER
          This component handles mouse look and WASD movement
          It must be inside the Canvas to access the camera
        */}
        <FirstPersonController />
        
        {/* 
          SCENE HELPERS
          Visual aids that help users understand the 3D space
        */}
        
        {/* White ground plane provides a solid surface to walk on */}
        <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshLambertMaterial color="white" />
        </mesh>
        
        {/* Grid floor provides spatial reference and depth perception */}
        <Grid 
          args={[50, 50]}           // Grid dimensions: 50x50 units
          position={[0, -1, 0]}     // Positioned 1 unit below origin
          cellSize={1}              // Each cell is 1x1 unit
          cellThickness={0.5}       // Thin lines for individual cells
          cellColor="#6f6f6f"       // Gray color for cell lines
          sectionSize={5}           // Major grid lines every 5 cells
          sectionThickness={1}      // Thicker lines for major sections
          sectionColor="#9d4b4b"    // Reddish color for section lines
          fadeDistance={50}         // Grid fades out at this distance
          fadeStrength={1}          // How quickly the fade happens
        />
        
        {/* 
          3D MODELS SECTION
          Here we add our custom 3D models to the scene
        */}
        
        {/* Ginger Bread House - the main structure */}
        <GingerBreadHouse 
          position={[0, 6, 0]}   // Center of the scene
          scale={[50, 50, 50]}         // Normal size
        />
        
        {/* Gift box positioned inside the ginger bread house */}
        <Gift 
          position={[2, 0, 1]}      // Inside the house, slightly to the right and forward
          scale={[0.5, 0.5, 0.5]}   // Smaller scale to fit inside
        />
        
        {/* Christmas Tree positioned inside the ginger bread house */}
        <ChristmasTree 
          position={[-2, 0, -1]}    // Inside the house, to the left and back
          scale={[0.8, 0.8, 0.8]}   // Slightly larger than gift but still fits inside
        />
        
        {/* 
          ADDITIONAL FESTIVE MODELS
          These models are positioned around the ginger bread house to create a festive scene
        */}
        
        {/* Ginger Bread Wagon - positioned to the right of the house */}
        <GingerBreadWagon 
          position={[10, -1, 5]}   // To the right and forward of the house
          rotation={[-Math.PI / 2, 0, Math.PI / 4]}  // Rotate 90 degrees around Y-axis to face forward
          scale={[15, 15, 15]}         // Slightly larger scale for visibility
        />
        
        {/* 
          RANDOM SPAWNER
          This component randomly spawns 10 of each candy model throughout the scene
          without overlapping with existing models
        */}
        <RandomSpawner />
        
      </Canvas>
    </div>
  );
}
