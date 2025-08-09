export interface FileData {
  id: number;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  uploadedAt: string;
  contentType: string;
}

export interface FileContent {
  type: 'text' | 'image' | 'download';
  data: string | Blob;
}

export interface UploadError {
  message: string;
  field?: string;
}

export interface FileValidationError {
  message: string;
  code: string;
}

export type FileTypeCategory = 'text' | 'image' | 'document' | 'archive' | 'unknown';

export interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  onError: (errors: string[]) => void;
  isUploading: boolean;
}

export interface FileCardProps {
  file: FileData;
  onDelete: (fileName: string) => void;
  onDownload: (fileName: string) => void;
}
