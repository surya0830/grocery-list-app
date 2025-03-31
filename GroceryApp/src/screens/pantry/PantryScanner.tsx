import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';
import { VisionCamera, useCameraDevice } from 'react-native-vision-camera';
import { useLidarAvailability, useLidar } from 'vision-camera-lidar';
import AzureStorageService from '../../services/AzureStorageService';
import { useAppDispatch } from '../../store/hooks';
import { addScannedItems } from '../../store/features/pantrySlice';
import uuid from 'react-native-uuid';

const PantryScanner: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
  const cameraRef = useRef<Camera>(null);
  const visionCameraRef = useRef<any>(null);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  // Check if device supports Lidar
  const { isLidarAvailable } = useLidarAvailability();
  const device = useCameraDevice('back');
  
  // Use Lidar if available
  const {
    depthData,
    isReady: isLidarReady
  } = useLidar({
    cameraRef: visionCameraRef,
  });

  useEffect(() => {
    // Request camera permissions
    (async () => {
      if (Platform.OS === 'ios' && isLidarAvailable) {
        const cameraPermission = await VisionCamera.requestCameraPermission();
        setHasPermission(cameraPermission === 'granted');
      } else {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      }
    })();
  }, []);

  const takePicture = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      let photo;
      
      if (Platform.OS === 'ios' && isLidarAvailable && visionCameraRef.current) {
        // Take photo with Lidar data
        photo = await visionCameraRef.current.takePhoto({
          flash: 'off',
          enableAutoStabilization: true,
        });
        
        // Process the depth data and photo together
        await processLidarData(photo.path, depthData);
      } else if (cameraRef.current) {
        // Standard camera photo
        photo = await cameraRef.current.takePictureAsync();
        
        // Resize the image to reduce upload size
        const manipResult = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 1000 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        
        await uploadImageToAzure(manipResult.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
    } finally {
      setIsProcessing(false);
    }
  };

  const processLidarData = async (photoPath: string, depth: any) => {
    // Process the photo and depth data to identify objects
    // Here we would use algorithms to analyze the 3D data and identify products
    // For now, we'll just upload the image and simulate item detection
    
    try {
      // Upload the photo
      await uploadImageToAzure(photoPath);
      
      // Simulate object detection
      // In a real implementation, this would analyze depth data to identify objects
      setTimeout(() => {
        const mockDetectedItems = [
          'Milk Carton',
          'Cereal Box',
          'Apple',
          'Soda Can'
        ];
        setDetectedObjects(mockDetectedItems);
        
        // Send detected items to store for further processing
        dispatch(addScannedItems(mockDetectedItems));
      }, 1500);
    } catch (error) {
      console.error('Error processing Lidar data:', error);
      Alert.alert('Error', 'Failed to process LiDAR data');
    }
  };

  const uploadImageToAzure = async (uri: string) => {
    try {
      // Generate unique blob name
      const blobName = `pantry_scan_${uuid.v4()}.jpg`;
      
      // Upload to Azure Blob Storage
      const imageUrl = await AzureStorageService.uploadFile(uri, blobName);
      console.log('Image uploaded successfully:', imageUrl);
      
      // Here you could send the imageUrl to your backend for further processing
      // or store it in your local state/redux store
      
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image to Azure:', error);
      Alert.alert('Upload Error', 'Failed to upload image to cloud storage');
      throw error;
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && isLidarAvailable && device ? (
        // Use VisionCamera with Lidar for iOS devices with Lidar
        <VisionCamera
          ref={visionCameraRef}
          style={styles.camera}
          device={device}
          isActive={true}
          photo={true}
        />
      ) : (
        // Use regular Expo Camera for other devices
        <Camera 
          ref={cameraRef}
          style={styles.camera}
          type={CameraType.back}
        />
      )}
      
      <View style={styles.overlay}>
        {detectedObjects.length > 0 && (
          <View style={styles.detectedItemsContainer}>
            <Text style={styles.detectedItemsTitle}>Detected Items:</Text>
            {detectedObjects.map((item, index) => (
              <Text key={index} style={styles.detectedItem}>{item}</Text>
            ))}
          </View>
        )}
        
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
  detectedItemsContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
  },
  detectedItemsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detectedItem: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 2,
  },
});

export default PantryScanner; 