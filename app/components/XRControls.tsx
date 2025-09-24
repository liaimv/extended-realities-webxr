// XR Controls Component
// Provides buttons for users to enter and exit AR/VR modes
// These controls integrate with the XR store to manage immersive experiences

'use client';

import { useState, useEffect } from 'react';
import { xrStore } from '../store/xrStore';

// Component that renders AR/VR control buttons
export function XRControls() {
  // Use client-side state to avoid hydration mismatches
  const [isWebXRSupported, setIsWebXRSupported] = useState<boolean | null>(null);
  
  // Check WebXR support on the client side only
  useEffect(() => {
    const checkWebXRSupport = () => {
      const supported = typeof window !== 'undefined' && 'xr' in navigator;
      setIsWebXRSupported(supported);
    };
    
    checkWebXRSupport();
  }, []);

  // Show loading state during hydration
  if (isWebXRSupported === null) {
    return (
      <div 
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          padding: '12px 20px',
          backgroundColor: '#666',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        🔄 Loading XR...
      </div>
    );
  }

  // Show not supported message if WebXR is not available
  if (!isWebXRSupported) {
    return (
      <div 
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          padding: '12px 20px',
          backgroundColor: '#ff9800',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        ⚠️ WebXR not supported
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'absolute',     // Positioned absolutely over the 3D scene
        top: '20px',             // 20 pixels from the top
        left: '20px',            // 20 pixels from the left
        zIndex: 1000,            // High z-index to appear above 3D content
        display: 'flex',         // Flex layout for button arrangement
        gap: '10px',             // 10 pixel gap between buttons
      }}
    >
      {/* 
        AR (Augmented Reality) Button
        When clicked, this button will enter AR mode on supported devices
        AR overlays 3D content onto the real world through the device camera
      */}
      <button
        onClick={() => {
          try {
            xrStore.enterAR();  // Call the XR store's enterAR method
          } catch (error) {
            console.error('Error entering AR:', error);
            alert('AR is not supported on this device or browser. Please try VR instead.');
          }
        }}
        style={{
          padding: '12px 20px',           // Button padding for comfortable clicking
          backgroundColor: '#4CAF50',     // Green color for AR (augmented reality)
          color: 'white',                 // White text for contrast
          border: 'none',                 // Remove default border
          borderRadius: '8px',            // Rounded corners for modern look
          fontSize: '16px',               // Readable font size
          fontWeight: 'bold',             // Bold text for emphasis
          cursor: 'pointer',              // Pointer cursor on hover
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Subtle shadow for depth
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#45a049'; // Darker green on hover
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#4CAF50'; // Back to original green
        }}
      >
        🥽 Enter AR
      </button>

      {/* 
        VR (Virtual Reality) Button
        When clicked, this button will enter VR mode on supported devices
        VR creates a fully immersive virtual environment
      */}
      <button
        onClick={() => {
          try {
            xrStore.enterVR();  // Call the XR store's enterVR method
          } catch (error) {
            console.error('Error entering VR:', error);
            alert('VR is not supported on this device or browser.');
          }
        }}
        style={{
          padding: '12px 20px',           // Same styling as AR button
          backgroundColor: '#2196F3',     // Blue color for VR (virtual reality)
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#1976D2'; // Darker blue on hover
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#2196F3'; // Back to original blue
        }}
      >
        🥽 Enter VR
      </button>

      {/* 
        Exit XR Button
        Allows users to exit any active XR session and return to normal view
        This button will be visible when in AR or VR mode
      */}
      <button
        onClick={() => {
          try {
            xrStore.exitXR();   // Call the XR store's exitXR method
          } catch (error) {
            console.error('Error exiting XR:', error);
            // Exit XR might fail if not in an XR session, which is okay
          }
        }}
        style={{
          padding: '12px 20px',
          backgroundColor: '#f44336',     // Red color for exit action
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#d32f2f'; // Darker red on hover
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#f44336'; // Back to original red
        }}
      >
        ❌ Exit XR
      </button>
    </div>
  );
}
