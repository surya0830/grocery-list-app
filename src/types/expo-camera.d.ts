declare module 'expo-camera' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';
  
  export interface CameraProps extends ViewProps {
    type?: 'front' | 'back';
    ratio?: string;
    onBarCodeScanned?: (scanningResult: { data: string; type: string }) => void;
  }

  export class Camera extends React.Component<CameraProps> {
    static requestCameraPermissionsAsync(): Promise<{ status: string }>;
    static getCameraPermissionsAsync(): Promise<{ status: string }>;
  }
} 