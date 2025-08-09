import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Download, FileText, File } from 'lucide-react';
import Header from './Header';
import { fileService } from '../services/api';
import { getFileTypeCategory, formatFileSize, formatDate } from '../utils/fileUtils';
import { FileData, FileContent } from '../types';

const FileViewer: React.FC = () => {
  const { fileName } = useParams<{ fileName: string }>();
  const [file, setFile] = useState<FileData | null>(null);
  const [content, setContent] = useState<FileContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const loadFile = useCallback(async () => {
    if (!fileName) return;
    
    try {
      setLoading(true);
      setError('');
      const blob = await fileService.downloadFile(fileName);

            const mockFile: FileData = {
        id: Date.now(),
        fileName: fileName,
        originalFileName: fileName,
        fileSize: blob.size,
        uploadedAt: new Date().toISOString(),
        contentType: blob.type
      };
      
      setFile(mockFile);
      
      const fileTypeCategory = getFileTypeCategory(fileName);
      
      if (fileTypeCategory === 'text') {
        const text = await blob.text();
        setContent({ type: 'text', data: text });
      } else if (fileTypeCategory === 'image') {
        const url = URL.createObjectURL(blob);
        setContent({ type: 'image', data: url });
      } else {
        setContent({ type: 'download', data: blob });
      }
      
    } catch (err) {
      setError('Failed to load file. Please try again.');
      console.error('Error loading file:', err);
    } finally {
      setLoading(false);
    }
  }, [fileName]);

  useEffect(() => {
    loadFile();
  }, [loadFile]);

  const handleDownload = () => {
    if (content && content.type === 'download' && fileName) {
      const url = window.URL.createObjectURL(content.data as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const renderContent = () => {
    if (!content) return null;

    switch (content.type) {
      case 'text':
        return (
          <div className="file-content">
            {content.data as string}
          </div>
        );
      
      case 'image':
        return (
          <img 
            src={content.data as string} 
            alt={fileName || 'File preview'}
            className="file-preview"
          />
        );
      
      case 'download':
        return (
          <div className="file-content">
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <File size={64} style={{ marginBottom: '16px', color: '#666' }} />
              <h3>File Preview Not Available</h3>
              <p>This file type cannot be previewed. Please download to view.</p>
              <button 
                className="btn btn-primary"
                onClick={handleDownload}
                style={{ marginTop: '16px' }}
              >
                <Download size={16} />
                Download File
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="loading">
            <FileText size={24} className="spinning" />
            Loading file...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="error">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <div className="container">
        {file && (
          <div className="card">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div>
                <h2>{file.originalFileName}</h2>
                <div style={{ color: '#666', marginTop: '8px' }}>
                  Size: {formatFileSize(file.fileSize)} | 
                  Uploaded: {formatDate(file.uploadedAt)}
                </div>
              </div>
              
              {content && content.type === 'download' && (
                <button 
                  className="btn btn-primary"
                  onClick={handleDownload}
                >
                  <Download size={16} />
                  Download
                </button>
              )}
            </div>

            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileViewer; 