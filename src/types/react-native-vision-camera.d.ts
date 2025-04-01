declare module 'react-native-vision-camera' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';

  export interface CameraProps extends ViewProps {
    device?: CameraDevice;
    isActive?: boolean;
    photo?: boolean;
    video?: boolean;
    audio?: boolean;
    onError?: (error: Error) => void;
  }

  export interface CameraDevice {
    id: string;
    position: 'front' | 'back';
    hasFlash: boolean;
    hasTorch: boolean;
    minZoom: number;
    maxZoom: number;
  }

  export class Camera extends React.Component<CameraProps> {
    static getAvailableCameraDevices(): Promise<CameraDevice[]>;
    static requestCameraPermission(): Promise<boolean>;
  }
} 