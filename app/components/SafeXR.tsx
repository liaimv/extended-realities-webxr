// Safe XR Component Wrapper
// Provides error boundaries and graceful fallbacks for XR functionality
// This prevents the entire app from crashing if XR fails to initialize

'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { XR } from '@react-three/xr';
import { xrStore } from '../store/xrStore';

// Error Boundary Component for XR
class XRErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    console.warn('XR Error caught by boundary:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error for debugging
    console.error('XR Error details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when XR fails
      return (
        <div 
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 1000,
            padding: '12px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          ⚠️ XR initialization failed
        </div>
      );
    }

    return this.props.children;
  }
}

// Safe XR Component that wraps content with error handling
interface SafeXRProps {
  children: ReactNode;
}

export function SafeXR({ children }: SafeXRProps) {
  return (
    <XRErrorBoundary>
      <XR store={xrStore}>
        {children}
      </XR>
    </XRErrorBoundary>
  );
}
