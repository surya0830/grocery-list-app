import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';

// Configure Azure Storage connection
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || 'pantry-images';

class AzureStorageService {
  private blobServiceClient: BlobServiceClient;
  
  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  }

  /**
   * Get a block blob client
   */
  private getBlockBlobClient(blobName: string): BlockBlobClient {
    const containerClient = this.blobServiceClient.getContainerClient(CONTAINER_NAME);
    return containerClient.getBlockBlobClient(blobName);
  }

  /**
   * Upload file to Azure Blob Storage
   * @param uri Local file URI
   * @param blobName Name to use for the blob
   * @returns URL of the uploaded blob
   */
  async uploadFile(uri: string, blobName: string): Promise<string> {
    try {
      // Read the file
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error(`File does not exist at ${uri}`);
      }

      // Convert local file to blob
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const buffer = Buffer.from(base64, 'base64');
      
      // Get blob client and upload
      const blockBlobClient = this.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(buffer);
      
      return blockBlobClient.url;
    } catch (error) {
      console.error('Error uploading file to Azure Blob Storage:', error);
      throw error;
    }
  }

  /**
   * Delete a blob from storage
   * @param blobName Name of the blob to delete
   */
  async deleteBlob(blobName: string): Promise<void> {
    try {
      const blockBlobClient = this.getBlockBlobClient(blobName);
      await blockBlobClient.delete();
    } catch (error) {
      console.error('Error deleting blob from Azure Storage:', error);
      throw error;
    }
  }
}

export default new AzureStorageService(); 