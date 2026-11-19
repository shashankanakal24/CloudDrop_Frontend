import axios from 'axios';
import {
  FileRecord,
  UploadSessionResponse,
  DownloadUrlResponse,
  DirectUploadResponse,
  HealthResponse,
} from '../types';
import {
  requestMiddleware,
  responseSuccessMiddleware,
  responseErrorMiddleware,
} from '../middleware/apiMiddleware';

/**
 * Returns the active Backend API URL.
 * Priority:
 * 1. URL Query parameter: ?api=http://... (saves automatically to localStorage)
 * 2. LocalStorage override: CLOUDDROP_API_URL
 * 3. Build-time environment variable: VITE_API_URL
 */
export function getApiBase(): string {
  if (typeof window !== 'undefined') {
    // 1. Check URL query param ?api=http://... (for instant testing or demo links without rebuild)
    const urlParams = new URLSearchParams(window.location.search);
    const queryApi = urlParams.get('api');
    if (queryApi) {
      const cleanUrl = queryApi.trim().replace(/\/+$/, '');
      localStorage.setItem('CLOUDDROP_API_URL', cleanUrl);
      return cleanUrl;
    }

    // 2. Check localStorage override
    const saved = localStorage.getItem('CLOUDDROP_API_URL');
    if (saved) {
      return saved.trim().replace(/\/+$/, '');
    }
  }

  // 3. Fallback to build-time Vite env variable
  return (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
}

/**
 * Sets a custom backend EC2 IP or URL on the fly, with zero Amplify rebuild required!
 */
export function setCustomApiUrl(url: string | null): void {
  if (url && url.trim()) {
    localStorage.setItem('CLOUDDROP_API_URL', url.trim().replace(/\/+$/, ''));
  } else {
    localStorage.removeItem('CLOUDDROP_API_URL');
  }
  window.location.reload();
}

const client = axios.create({
  timeout: 60000, // 60s timeout
});

// Dynamic baseURL interceptor so changed EC2 IPs apply immediately
client.interceptors.request.use((config) => {
  config.baseURL = getApiBase();
  return requestMiddleware(config);
}, (err) => Promise.reject(err));

client.interceptors.response.use(responseSuccessMiddleware, responseErrorMiddleware);

export const api = {
  /**
   * Health check endpoint: GET /api/health
   */
  async getHealth(): Promise<HealthResponse> {
    const res = await client.get<HealthResponse>('/api/health');
    return res.data;
  },

  /**
   * Target group health check: GET /health
   */
  async getSystemHealth(): Promise<HealthResponse> {
    const res = await client.get<HealthResponse>('/health');
    return res.data;
  },

  /**
   * List all stored files: GET /api/files
   */
  async listFiles(): Promise<FileRecord[]> {
    const res = await client.get<FileRecord[]>('/api/files');
    return res.data;
  },

  /**
   * Get single file metadata: GET /api/files/:fileId
   */
  async getFileDetails(fileId: string): Promise<FileRecord> {
    const res = await client.get<FileRecord>(`/api/files/${encodeURIComponent(fileId)}`);
    return res.data;
  },

  /**
   * Request pre-signed S3 upload PUT URL: POST /api/files/upload-url
   */
  async requestUpload(
    fileName: string,
    mimeType: string,
    sizeBytes: number,
    expiryHours: number = 24,
    tags: string[] = [],
  ): Promise<UploadSessionResponse> {
    const res = await client.post<UploadSessionResponse>('/api/files/upload-url', {
      fileName,
      mimeType,
      sizeBytes,
      expiryHours,
      tags,
    });
    return res.data;
  },

  /**
   * Direct high-speed PUT binary upload to S3 using the pre-signed URL
   */
  async uploadDirectToS3(
    uploadUrl: string,
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<void> {
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
  },

  /**
   * Confirm direct S3 upload completion: POST /api/files/:fileId/confirm
   */
  async confirmUpload(fileId: string): Promise<void> {
    await client.post(`/api/files/${encodeURIComponent(fileId)}/confirm`, {});
  },

  /**
   * Direct multipart form upload: POST /api/files/upload
   * (Allows immediate upload through backend reverse proxy to S3 with instant link generation)
   */
  async uploadMultipartDirect(
    file: File,
    expiryHours: number = 24,
    onProgress?: (percent: number) => void,
  ): Promise<DirectUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('expiryHours', String(expiryHours));

    const res = await client.post<DirectUploadResponse>('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return res.data;
  },

  /**
   * Get secure pre-signed download URL: GET /api/files/:fileId/download-url
   */
  async getDownloadUrl(fileId: string, forceDownload = false): Promise<DownloadUrlResponse> {
    const res = await client.get<DownloadUrlResponse>(
      `/api/files/${encodeURIComponent(fileId)}/download-url`,
      {
        params: forceDownload ? { download: 'true' } : undefined,
      },
    );
    return res.data;
  },

  /**
   * Delete file from S3 and DynamoDB: DELETE /api/files/:fileId
   */
  async deleteFile(fileId: string): Promise<void> {
    await client.delete(`/api/files/${encodeURIComponent(fileId)}`);
  },

  /**
   * Helper to construct backend direct instant download link: GET /d/:fileId
   */
  getDirectDownloadUrl(fileId: string): string {
    return `${getApiBase()}/d/${fileId}`;
  },

  /**
   * Helper to construct backend direct media stream/view link: GET /f/:fileId
   */
  getPreviewUrl(fileId: string): string {
    return `${getApiBase()}/f/${fileId}`;
  },

  /**
   * Helper to construct recipient frontend download page URL: /download/:fileId
   */
  getShareablePageUrl(fileId: string): string {
    return `${window.location.origin}/download/${fileId}`;
  },
};
