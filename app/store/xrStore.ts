// XR Store for managing Extended Reality (AR/VR) state
// This store handles entering and exiting AR/VR modes
import { createXRStore } from '@react-three/xr';

// Create a centralized XR store that manages AR/VR state
// This store provides methods like enterAR(), enterVR(), and exitXR()
export const xrStore = createXRStore();

// The store handles:
// - Detecting if XR is supported on the current device
// - Managing XR session state (active/inactive)
// - Providing methods to enter AR mode (augmented reality)
// - Providing methods to enter VR mode (virtual reality)
// - Handling XR session cleanup and exit