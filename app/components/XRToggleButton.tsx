// XR Toggle Button Component
// This component creates a single button that toggles between "Enter XR" and "Exit XR"
// It must be inside the XR component to access the XR session state

import { useXR } from '@react-three/xr';
import { xrStore } from '../store/xrStore';

export function XRToggleButton() {
  // useXR hook gives us access to the current XR session state
  // We use a selector to get just the session information we need
  const session = useXR((state) => state.session);
  
  // Determine if we're currently in an XR session
  const isInXR = session !== null;
  
  // Function to handle button clicks
  const handleXRToggle = () => {
    if (isInXR) {
      // If we're in XR, exit the session
      xrStore.getState().session?.end();
    } else {
      // If we're not in XR, try to enter AR first, then VR if AR fails
      // This provides the best user experience across different devices
      xrStore.enterAR().catch(() => {
        // If AR fails (device doesn't support it), try VR
        xrStore.enterVR();
      });
    }
  };
  
  return (
    <>
      {/* 
        XR TOGGLE BUTTON
        This button appears in the 3D scene and toggles XR mode
        It's positioned in 3D space so it appears in both regular and XR views
      */}
      <mesh 
        position={[0, 2, -2]}  // Position the button in front of the user
        onClick={handleXRToggle}
        pointerEventsType={{ deny: 'grab' }}  // Enable clicking but prevent grabbing
      >
        {/* Button geometry - a simple plane */}
        <planeGeometry args={[2, 0.8]} />
        
        {/* Button material with different colors based on XR state */}
        <meshBasicMaterial 
          color={isInXR ? '#f44336' : '#4CAF50'}  // Red when in XR, green when not
          transparent={true}
          opacity={0.9}
        />
        
        {/* 
          Button text using HTML overlay
          We'll add this as a separate HTML element positioned over the 3D button
        */}
      </mesh>
      
      {/* 
        HTML OVERLAY FOR BUTTON TEXT
        This creates text that appears over the 3D button
        It's positioned using CSS to align with the 3D button
      */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          pointerEvents: 'none', // Don't interfere with 3D interactions
        }}
      >
        <div
          onClick={handleXRToggle}
          style={{
            padding: '15px 30px',
            backgroundColor: isInXR ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            pointerEvents: 'auto', // Re-enable pointer events for this element
          }}
        >
          {isInXR ? 'Exit XR' : 'Enter XR'}
        </div>
      </div>
    </>
  );
}
