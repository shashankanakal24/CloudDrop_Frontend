export interface FileRecord {
  fileId: string;
  originalName: string;
  uploaderId?: string;
  s3Key: string;
  mimeType: string;
  sizeBytes: number;
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'EXPIRED' | 'DELETED';
  uploadedAt: string;
  updatedAt?: string;
  expiresAt: number; // Unix epoch seconds
  downloadCount: number;
  tags?: string[];
  downloadLink?: string;
  previewLink?: string;
  shareLink?: string;
  processedMetadata?: {
    md5Checksum?: string;
    previewGenerated?: boolean;
    lambdaProcessedAt?: string;
  };
}

export interface UploadSessionResponse {
  fileId: string;
  s3Key: string;
  uploadUrl: string;
  expiresAt: string;
}

export interface DirectUploadResponse {
  message: string;
  downloadLink: string;
  previewLink: string;
  shareLink?: string;
  fileId: string;
  originalName: string;
  sizeBytes: number;
  mimeType: string;
  status: 'READY';
  expiryHours: number;
  expiresAt: string;
}

export interface DownloadUrlResponse {
  fileId: string;
  originalName: string;
  mimeType?: string;
  mediaUrl?: string;
  directDownloadUrl?: string;
  downloadUrl: string;
  downloadCount: number;
  expiresInSeconds: number;
}

export interface HealthResponse {
  status: string;
  service: string;
  uptime?: number;
  timestamp: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
