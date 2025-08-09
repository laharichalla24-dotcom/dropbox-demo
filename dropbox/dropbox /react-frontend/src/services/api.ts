import axios from 'axios';
import { FileData } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// File operations
export const fileService = {
  // Get all files
  getAllFiles: async (): Promise<FileData[]> => {
    try {
      const response = await api.get<FileData[]>('/files');
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock data');
      return [
        {
          id: 1,
          fileName: 'dummy.txt',
          originalFileName: 'dummy.txt',
          fileSize: 1024,
          uploadedAt: new Date().toISOString(),
          contentType: 'text/plain'
        }
      ];
    }
  },

  // Upload file
  uploadFile: async (file: File): Promise<FileData> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post<FileData>('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, simulating upload');
      return {
        id: Date.now(),
        fileName: file.name,
        originalFileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        contentType: file.type
      };
    }
  },

  // Download file
  downloadFile: async (fileName: string): Promise<Blob> => {
    try {
      const response = await api.get(`/files/download/${fileName}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, creating mock blob');
      const mockContent = `This is a mock file: ${fileName}\n\nBackend server is not running, so this is simulated content.`;
      return new Blob([mockContent], { type: 'text/plain' });
    }
  },

  // Delete file
  deleteFile: async (fileName: string): Promise<void> => {
    try {
      await api.delete(`/files/${fileName}`);
    } catch (error) {
      console.warn('Backend not available, simulating delete');
      return Promise.resolve();
    }
  },
};

export default api; 