import React, { useState, useRef, useCallback } from 'react';
import { Upload, AlertCircle, CheckCircle, XCircle, FileText } from 'lucide-react';
import { validateFile, SUPPORTED_FILE_TYPES } from '../utils/fileUtils';
import { FileUploadProps } from '../types';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, onError, isUploading }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setUploadError('');
    setStatus('idle');
    setUploadProgress(0);
    
    // Validate file
    const errors = validateFile(file);
    if (errors.length > 0) {
      setUploadError(errors.join(', '));
      setStatus('error');
      onError && onError(errors);
      return;
    }

    setSelectedFile(file);
    setStatus('idle');
  }, [onError]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setStatus('uploading');
    setUploadProgress(0);
    setUploadError('');

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev >= 90 ? 90 : prev + 10;
          if (prev >= 90) {
            clearInterval(progressInterval);
          }
          return newProgress;
        });
      }, 200);

      await onUpload(selectedFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setStatus('success');
      setSelectedFile(null);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setUploadProgress(0);
      }, 3000);
      
    } catch (err) {
      setStatus('error');
      setUploadError('Upload failed. Please try again.');
      setUploadProgress(0);
    }
  }, [selectedFile, onUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="card">
      <div
        className={`upload-area ${dragActive ? 'dragover' : ''} ${status === 'uploading' ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          accept={Object.keys(SUPPORTED_FILE_TYPES).join(',')}
          style={{ display: 'none' }}
        />
        
        {status === 'success' ? (
          <CheckCircle className="upload-icon" style={{ 
            background: 'linear-gradient(135deg, #a5f4a5 0%, #a0f0a0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }} />
        ) : status === 'error' ? (
          <XCircle className="upload-icon" style={{ 
            background: 'linear-gradient(135deg, #f4a5a5 0%, #f0a0a0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }} />
        ) : (
          <Upload className="upload-icon" />
        )}
        
        <div className="upload-text">
          {status === 'uploading' ? 'Uploading...' : 
           status === 'success' ? 'Upload Complete!' :
           status === 'error' ? 'Upload Failed' :
           'Drop files here or click to upload'}
        </div>
        <div className="upload-subtext">
          Supported formats: TXT, JSON, XML, CSV, MD, JPG, PNG, GIF, PDF, DOC, XLS, PPT, ZIP, RAR
        </div>
        <div className="upload-subtext">
          Max file size: 100MB
        </div>
      </div>

      {/* File Info */}
      {selectedFile && status !== 'uploading' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(124, 159, 240, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)',
          borderRadius: '12px',
          padding: '15px',
          marginTop: '20px',
          border: '1px solid rgba(124, 159, 240, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <FileText size={20} style={{
              background: 'linear-gradient(135deg, #7c9ff0 0%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }} />
            <span style={{ fontWeight: '600', color: '#2d3748' }}>{selectedFile.name}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#718096' }}>
            Size: {formatFileSize(selectedFile.size)} | Type: {selectedFile.type || 'Unknown'}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {(status === 'uploading' || uploadProgress > 0) && (
        <div style={{ marginTop: '20px' }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            height: '8px',
            overflow: 'hidden',
            marginBottom: '10px'
          }}>
            <div 
              style={{
                background: 'linear-gradient(135deg, #7c9ff0 0%, #a78bfa 50%, #c4b5fd 100%)',
                height: '100%',
                width: `${uploadProgress}%`,
                transition: 'width 0.3s ease',
                borderRadius: '10px'
              }}
            />
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#718096' }}>
            {uploadProgress}% uploaded
            {status === 'uploading' && (
              <div style={{ fontSize: '0.8rem', color: '#a0aec0', marginTop: '4px' }}>
                Uploading {selectedFile?.name}...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && status === 'idle' && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={isUploading}
            style={{ minWidth: '200px' }}
          >
            <Upload size={16} />
            Upload File
          </button>
        </div>
      )}

      {/* Success Message */}
      {status === 'success' && (
        <div className="success" style={{ marginTop: '20px' }}>
          <CheckCircle size={16} style={{ marginRight: '8px' }} />
          File uploaded successfully!
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="error" style={{ marginTop: '20px' }}>
          <AlertCircle size={16} style={{ marginRight: '8px' }} />
          {uploadError}
        </div>
      )}
    </div>
  );
};

export default FileUpload; 