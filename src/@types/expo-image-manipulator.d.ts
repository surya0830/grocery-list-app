declare module 'expo-image-manipulator' {
  export interface ManipulateOptions {
    resize?: {
      width?: number;
      height?: number;
    };
    format?: 'jpeg' | 'png';
    compress?: number;
  }

  export interface ManipulateResult {
    uri: string;
    width: number;
    height: number;
    type: 'image';
  }

  export function manipulateAsync(
    uri: string,
    actions: ManipulateOptions[],
    options?: { format?: 'jpeg' | 'png'; compress?: number }
  ): Promise<ManipulateResult>;
} 