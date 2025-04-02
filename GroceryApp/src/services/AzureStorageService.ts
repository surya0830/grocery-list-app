import { BlobServiceClient, ContainerClient, BlobClient } from '@azure/storage-blob';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import { security } from '../middleware/security';

class AzureStorageService {
  private static instance: AzureStorageService;
  private blobServiceClient: BlobServiceClient | null = null;
  private containerClient: ContainerClient | null = null;

  private constructor() {}

  static getInstance(): AzureStorageService {
    if (!AzureStorageService.instance) {
      AzureStorageService.instance = new AzureStorageService();
    }
    return AzureStorageService.instance;
  }

  async initialize(connectionString: string, containerName: string): Promise<void> {
    try {
      // Validate inputs
      if (!security.validateInput(containerName)) {
        throw new Error('Invalid container name');
      }

      this.blobServiceClient = new BlobServiceClient(connectionString);
      this.containerClient = this.blobServiceClient.getContainerClient(containerName);

      // Ensure container exists and is private
      const exists = await this.containerClient.exists();
      if (!exists) {
        await this.containerClient.create();
      }
    } catch (error) {
      console.error('Error initializing Azure Storage:', error);
      throw error;
    }
  }

  /**
   * Upload file to Azure Blob Storage with security checks
   * @param fileUri Local file URI
   * @param blobName Name to use for the blob
   * @returns URL of the uploaded blob
   */
  async uploadFile(fileUri: string, blobName: string): Promise<string> {
    if (!this.containerClient) {
      throw new Error('Azure Storage not initialized');
    }

    try {
      // Rate limiting
      if (!(await security.rateLimiter.canMakeRequest())) {
        throw new Error('Rate limit exceeded');
      }

      // Validate inputs
      if (!security.validateInput(blobName)) {
        throw new Error('Invalid blob name');
      }

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      // Validate file
      if (!security.validateFile(blobName, 'image/jpeg', fileInfo.size)) {
        throw new Error('Invalid file');
      }

      const blobClient = this.containerClient.getBlobClient(blobName);

      // Read the file content
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to buffer
      const buffer = Buffer.from(fileContent, 'base64');

      // Upload with content type and encryption
      await blobClient.uploadData(buffer, {
        blobHTTPHeaders: {
          blobContentType: 'image/jpeg',
        },
      });

      // Set metadata after upload
      await blobClient.setMetadata({
        uploadedAt: new Date().toISOString(),
        source: Platform.OS,
      });

      // Generate SAS URL with short expiry
      const sasUrl = await this.generateSasUrl(blobClient);
      return sasUrl;
    } catch (error) {
      console.error('Error uploading file to Azure:', error);
      throw error;
    }
  }

  /**
   * Generate a secure SAS URL with short expiry
   */
  private async generateSasUrl(blobClient: BlobClient): Promise<string> {
    const startsOn = new Date();
    const expiresOn = new Date(startsOn);
    expiresOn.setMinutes(startsOn.getMinutes() + security.config.sasTokenExpiry);

    const sasToken = await blobClient.generateSasUrl({
      permissions: 'r', // Read only
      startsOn,
      expiresOn,
      protocol: 'https',
    });

    return sasToken;
  }

  /**
   * Delete a blob from storage with security checks
   */
  async deleteFile(blobName: string): Promise<void> {
    if (!this.containerClient) {
      throw new Error('Azure Storage not initialized');
    }

    try {
      // Rate limiting
      if (!(await security.rateLimiter.canMakeRequest())) {
        throw new Error('Rate limit exceeded');
      }

      // Validate input
      if (!security.validateInput(blobName)) {
        throw new Error('Invalid blob name');
      }

      const blobClient = this.containerClient.getBlobClient(blobName);
      await blobClient.delete();
    } catch (error) {
      console.error('Error deleting file from Azure:', error);
      throw error;
    }
  }

  /**
   * Get a secure URL for a blob
   */
  async getFileUrl(blobName: string): Promise<string> {
    if (!this.containerClient) {
      throw new Error('Azure Storage not initialized');
    }

    try {
      // Rate limiting
      if (!(await security.rateLimiter.canMakeRequest())) {
        throw new Error('Rate limit exceeded');
      }

      // Validate input
      if (!security.validateInput(blobName)) {
        throw new Error('Invalid blob name');
      }

      const blobClient = this.containerClient.getBlobClient(blobName);
      return this.generateSasUrl(blobClient);
    } catch (error) {
      console.error('Error getting file URL from Azure:', error);
      throw error;
    }
  }
}

export default AzureStorageService.getInstance(); 