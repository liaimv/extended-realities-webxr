// This directive tells Next.js that this component runs on the client-side
// It's needed because we're using browser-specific features like 3D graphics
'use client';

// Import required components
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { XR } from '@react-three/xr';
import { Model as PottedPlant } from './components/PottedPlant';
import { Cube } from './components/Cube';
import { xrStore } from './store/xrStore';

// Main homepage component that renders our 3D scene
export default function Home() {
  return (
    // Container div that takes up the full viewport (100% width and height)
    <div style={{ width: '100vw', height: '100vh' }}>
      
      {/* 
        XR CONTROL BUTTONS
        These buttons allow users to enter AR (Augmented Reality) or VR (Virtual Reality) modes
        AR overlays 3D objects on the real world through the camera
        VR creates an immersive virtual environment
      */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        zIndex: 1000,
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          onClick={() => xrStore.enterAR()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Enter AR
        </button>
        
        <button 
          onClick={() => xrStore.enterVR()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Enter VR
        </button>
        
        <button 
          onClick={() => xrStore.getState().session?.end()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Exit XR
        </button>
      </div>
      {/* 
        Canvas is the main React Three Fiber component that creates a 3D scene
        It sets up WebGL context and handles rendering
        camera prop sets the initial camera position [x, y, z]
      */}
      <Canvas camera={{ position: [5, 5, 5] }}>
        
        {/* 
          XR COMPONENT WRAPPER
          The XR component enables Extended Reality (AR/VR) functionality
          It must wrap all 3D content that should be available in XR mode
          The store prop connects our XR store to manage XR state
        */}
        <XR store={xrStore}>
        
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
          3D OBJECTS
          These are our interactive 3D elements in the scene
        */}
        
        {/* Static orange cube positioned at the origin (0, 0, 0) */}
        <Cube />
        
        {/* Interactive potted plant that can be clicked to teleport */}
        <PottedPlant scale={10} />
        
        {/* 
          SCENE HELPERS
          Visual aids that help users understand the 3D space
        */}
        
        {/* Grid floor provides spatial reference and depth perception */}
        <Grid 
          args={[20, 20]}           // Grid dimensions: 20x20 units
          position={[0, -1, 0]}     // Positioned 1 unit below origin
          cellSize={1}              // Each cell is 1x1 unit
          cellThickness={0.5}       // Thin lines for individual cells
          cellColor="#6f6f6f"       // Gray color for cell lines
          sectionSize={5}           // Major grid lines every 5 cells
          sectionThickness={1}      // Thicker lines for major sections
          sectionColor="#9d4b4b"    // Reddish color for section lines
          fadeDistance={25}         // Grid fades out at this distance
          fadeStrength={1}          // How quickly the fade happens
        />
        
        {/* 
          CAMERA CONTROLS
          OrbitControls allows users to navigate around the 3D scene
          - Left click + drag: Rotate camera around the scene
          - Right click + drag: Pan the camera
          - Scroll wheel: Zoom in and out
        */}
        <OrbitControls 
          enablePan={true}      // Allow panning (moving the camera)
          enableZoom={true}     // Allow zooming in/out
          enableRotate={true}   // Allow rotating around the scene
        />
        
        {/* Close the XR component wrapper */}
        </XR>
      </Canvas>
    </div>
  );
}
