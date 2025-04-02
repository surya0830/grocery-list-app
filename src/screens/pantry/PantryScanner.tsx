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
import AzureStorageService from '../../services/AzureStorageService';
import { useAppDispatch } from '../../store/hooks';
import { addScannedItems } from '../../store/features/pantrySlice';
import { v4 as uuidv4 } from 'uuid';

const PantryScanner: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
  const cameraRef = useRef<Camera>(null);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
        skipProcessing: true,
        exif: true
      });

      // Process the image
      const processedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Upload to Azure Blob Storage
      const blobName = `pantry-scans/${uuidv4()}.jpg`;
      await AzureStorageService.uploadFile(processedImage.uri, blobName);

      // Simulate object detection (replace with actual AI service)
      const mockDetectedItems = ['Apple', 'Banana', 'Orange'];
      setDetectedObjects(mockDetectedItems);

      // Add to pantry
      dispatch(addScannedItems(mockDetectedItems));

      Alert.alert('Success', 'Items scanned and added to pantry!');
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera 
        ref={cameraRef}
        style={styles.camera}
        type={CameraType.back}
      />
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, isProcessing && styles.buttonDisabled]}
          onPress={takePicture}
          disabled={isProcessing}
        >
          <Text style={styles.buttonText}>
            {isProcessing ? 'Processing...' : 'Take Picture'}
          </Text>
        </TouchableOpacity>
      </View>

      {detectedObjects.length > 0 && (
        <View style={styles.results}>
          <Text style={styles.resultsTitle}>Detected Items:</Text>
          {detectedObjects.map((item, index) => (
            <Text key={index} style={styles.resultItem}>{item}</Text>
          ))}
        </View>
      )}
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
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  results: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 8,
  },
  resultsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  resultItem: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default PantryScanner; 