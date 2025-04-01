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
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';
import AzureStorageService from '../../services/AzureStorageService';
import { useAppDispatch } from '../../store/hooks';
import { addScannedItems } from '../../store/features/pantrySlice';
import { v4 as uuidv4 } from 'uuid';

const PantryScanner: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
  const cameraRef = useRef<any>(null);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Request camera permissions
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      
      if (cameraRef.current) {
        // Take photo
        const photo = await cameraRef.current.takePictureAsync();
        
        // Resize the image to reduce upload size
        const manipResult = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 1000 } }],
          { compress: 0.8, format: 'jpeg' }
        );
        
        // Upload the photo
        await uploadImageToAzure(manipResult.uri);
        
        // Simulate object detection
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
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadImageToAzure = async (uri: string) => {
    try {
      // Generate unique blob name
      const blobName = `pantry_scan_${uuidv4()}.jpg`;
      
      // Upload to Azure Blob Storage
      const imageUrl = await AzureStorageService.uploadFile(uri, blobName);
      console.log('Image uploaded successfully:', imageUrl);
      
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
      <Camera 
        ref={cameraRef}
        style={styles.camera}
        type="back"
      />
      
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
    padding: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  detectedItemsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
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
    marginBottom: 5,
  },
});

export default PantryScanner; 