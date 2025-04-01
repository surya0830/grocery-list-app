declare module '@azure/storage-blob' {
  export interface BlobServiceClientOptions {
    accountName: string;
    sasToken: string;
  }

  export interface ContainerClient {
    url: string;
    name: string;
    exists(): Promise<boolean>;
    create(): Promise<{ succeeded: boolean }>;
    delete(): Promise<void>;
    getBlobClient(blobName: string): BlobClient;
  }

  export interface BlobClient {
    url: string;
    name: string;
    exists(): Promise<boolean>;
    uploadData(data: Buffer | Blob | ArrayBuffer, options?: UploadOptions): Promise<{ etag: string }>;
    download(): Promise<{ blobBody: Promise<Blob> }>;
  }

  export interface UploadOptions {
    blobHTTPHeaders?: {
      blobContentType?: string;
      blobContentDisposition?: string;
    };
  }

  export class BlobServiceClient {
    constructor(url: string, options?: BlobServiceClientOptions);
    getContainerClient(containerName: string): ContainerClient;
  }
} 