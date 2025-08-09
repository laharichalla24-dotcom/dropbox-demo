import { FileTypeCategory } from '../types';

// Supported file types
export const SUPPORTED_FILE_TYPES: Record<string, string> = {
  // Text files
  '.txt': 'text/plain',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.csv': 'text/csv',
  '.md': 'text/markdown',
  
  // Image files
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.svg': 'image/svg+xml',
  
  // Document files
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  
  // Archive files
  '.zip': 'application/zip',
  '.rar': 'application/x-rar-compressed',
  '.7z': 'application/x-7z-compressed',
  '.tar': 'application/x-tar',
  '.gz': 'application/gzip'
};

// File size limits (100MB)
export const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Check if file type is supported
export const isFileTypeSupported = (fileName: string): boolean => {
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return SUPPORTED_FILE_TYPES.hasOwnProperty(extension);
};

// Get file type category
export const getFileTypeCategory = (fileName: string): FileTypeCategory => {
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  
  if (['.txt', '.json', '.xml', '.csv', '.md'].includes(extension)) {
    return 'text';
  } else if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'].includes(extension)) {
    return 'image';
  } else if (['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'].includes(extension)) {
    return 'document';
  } else if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(extension)) {
    return 'archive';
  }
  
  return 'unknown';
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

// Validate file before upload
export const validateFile = (file: File): string[] => {
  const errors: string[] = [];
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`);
  }
  
  // Check file type
  if (!isFileTypeSupported(file.name)) {
    errors.push('File type not supported');
  }
  
  // Check if file is empty
  if (file.size === 0) {
    errors.push('File is empty');
  }
  
  return errors;
}; 