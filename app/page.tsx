// This directive tells Next.js that this component runs on the client-side
// It's needed because we're using browser-specific features like 3D graphics
'use client';

// Import required components
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Stars, Sparkles } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// Import our custom 3D model components
import GingerBreadHouse from './components/GingerBreadHouse';
import GingerBreadWagon from './components/GingerBreadWagon';
import RandomSpawner from './components/RandomSpawner';

// Dreamy particle system component for magical atmosphere
function DreamyParticles() {
  const meshRef = useRef<THREE.Points>(null);
  
  // Create floating particles that gently move up and down
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating motion
      meshRef.current.rotation.y += 0.001;
      meshRef.current.rotation.x += 0.0005;
      
      // Move particles up and down in a wave pattern
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time * 0.5) * 2;
    }
  });

  return (
    <points ref={meshRef}>
      {/* Create 5000 random particles for an incredibly magical atmosphere */}
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={5000}
          array={new Float32Array(
            Array.from({ length: 5000 * 3 }, () => (Math.random() - 0.5) * 100)
          )}
          itemSize={3}
          args={[new Float32Array(
            Array.from({ length: 5000 * 3 }, () => (Math.random() - 0.5) * 100)
          ), 3]}
        />
      </bufferGeometry>
      {/* Soft, glowing material for dreamy effect */}
      <pointsMaterial 
        color="#ffb3e6" 
        size={0.2} 
        transparent 
        opacity={0.3}
        sizeAttenuation={true}
      />
    </points>
  );
}

// First-person controller component that handles mouse look and WASD movement
function FirstPersonController() {
  const { camera } = useThree();
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  // const velocity = useRef(new THREE.Vector3()); // Removed unused variable
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
  // const handleClick = () => {
  //   if (!isPointerLocked) {
  //     document.body.requestPointerLock();
  //   }
  // }; // Removed unused function

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
          DREAMY LIGHTING SETUP
          Soft, pastel lighting that creates a dreamlike atmosphere
        */}
        
        {/* Soft ambient light with a dreamy pink tint */}
        <ambientLight intensity={0.6} color="#ffb3e6" />
        
        {/* Gentle directional light with warm, soft color */}
        <directionalLight 
          position={[10, 10, 5]}  // Position in 3D space [x, y, z]
          intensity={0.8}         // Softer than before
          color="#fff0f5"         // Soft pink-white light
          castShadow              // Enable this light to cast shadows
        />
        
        {/* Dreamy point light with purple tint */}
        <pointLight 
          position={[-10, -10, -5]}  // Positioned opposite to main light
          intensity={0.4}            // Gentle intensity
          color="#e6b3ff"            // Soft purple light
        />
        
        {/* Magical spot light with golden glow */}
        <spotLight
          position={[0, 10, 0]}  // Directly above the scene
          angle={0.4}            // Wider light cone for softer effect
          penumbra={1}           // Very soft edges
          intensity={0.4}        // Gentle magical light
          color="#fff8dc"        // Creamy golden light
          castShadow             // Enable shadow casting
        />
        
        {/* Additional dreamy lights for magical atmosphere */}
        <pointLight 
          position={[5, 5, 5]}   // Top-right corner
          intensity={0.3}        // Subtle
          color="#b3d9ff"        // Soft blue light
        />
        
        <pointLight 
          position={[-5, 5, -5]} // Top-left corner
          intensity={0.3}        // Subtle
          color="#b3ffb3"        // Soft green light
        />
        
        {/* 
          DREAMY ATMOSPHERIC EFFECTS
          These create the dreamlike atmosphere with fog, stars, and sparkles
        */}
        
        {/* Atmospheric fog for depth and dreaminess */}
        <fog attach="fog" args={["#ffb3e6", 10, 100]} />
        
        {/* Twinkling stars in the background */}
        <Stars 
          radius={100}           // How far the stars extend
          depth={50}            // Depth of the star field
          count={5000}          // Number of stars
          factor={4}            // Size of stars
          saturation={0}        // No color saturation for pure white stars
          fade={true}           // Stars fade with distance
        />
        
        {/* Magical sparkles floating around the scene */}
        <Sparkles 
          count={100}           // Number of sparkles
          scale={10}            // Size of sparkles
          size={2}              // Individual sparkle size
          speed={0.4}           // How fast they twinkle
          color="#ffb3e6"       // Pink sparkles
        />
        
        {/* 
          SKYBOX ENVIRONMENT
          This creates a beautiful sky environment using the HDR file
          The Environment component automatically creates a skybox that surrounds the entire scene
        */}
        <Environment 
          files="/Puresky.hdr"    // Path to the HDR skybox file
          background={true}       // Use the HDR as the background
          environmentIntensity={0.3}  // Dimmer for dreamy effect
        />
        
        {/* 
          FIRST-PERSON CONTROLLER
          This component handles mouse look and WASD movement
          It must be inside the Canvas to access the camera
        */}
        <FirstPersonController />
        
        {/* 
          DREAMY SCENE ELEMENTS
          Soft, magical ground and atmospheric effects
        */}
        
        {/* Dreamy ground plane with soft pastel color - solid, not transparent */}
        <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color="#fff0f5"         // Soft pink-white ground
            side={THREE.DoubleSide}  // Make sure both sides are visible
            transparent={false}      // Explicitly set to not transparent
            opacity={1.0}           // Full opacity
          />
        </mesh>
        
        {/* Dreamy floating particles */}
        <DreamyParticles />
        
        {/* Additional magical sparkles at different heights */}
        <Sparkles 
          count={50}            // Fewer sparkles for variety
          scale={15}           // Larger scale
          size={3}              // Bigger individual sparkles
          speed={0.2}           // Slower movement
          color="#e6b3ff"       // Purple sparkles
          position={[0, 5, 0]}  // Higher up
        />
        
        <Sparkles 
          count={30}            // Even fewer sparkles
          scale={20}           // Even larger scale
          size={4}              // Even bigger sparkles
          speed={0.1}           // Very slow movement
          color="#b3d9ff"       // Blue sparkles
          position={[0, 10, 0]} // Much higher up
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
