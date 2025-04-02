declare module 'vision-camera-lidar' {
  import * as React from 'react';
  import { CameraProps } from 'react-native-vision-camera';

  export interface LidarCameraProps extends CameraProps {
    lidarEnabled?: boolean;
    onLidarData?: (data: LidarData) => void;
  }

  export interface LidarData {
    depthMap: number[][];
    confidenceMap: number[][];
    timestamp: number;
  }

  export class LidarCamera extends React.Component<LidarCameraProps> {
    static isLidarAvailable(): Promise<boolean>;
  }
} 