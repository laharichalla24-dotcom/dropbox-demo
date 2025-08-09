import React, { useState, useEffect } from 'react';
import { FolderOpen, RefreshCw } from 'lucide-react';
import Header from './Header';
import FileUpload from './FileUpload';
import FileCard from './FileCard';
import { fileService } from '../services/api';
import { FileData } from '../types';

const HomePage: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const data = await fileService.getAllFiles();
      setFiles(data);
    } catch (err) {
      setError('Failed to load files. Please try again.');
      console.error('Error loading files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File): Promise<void> => {
    setUploading(true);
    setError('');
    setSuccess('');
    
    try {
      const uploadedFile = await fileService.uploadFile(file);
      setFiles(prev => [uploadedFile, ...prev]);
      setSuccess(`File "${file.name}" uploaded successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Error uploading file:', err);
      throw err; // Re-throw to let the FileUpload component handle the error
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string): Promise<void> => {
    try {
      await fileService.deleteFile(fileName);
      setFiles(prev => prev.filter(file => file.fileName !== fileName));
      setSuccess('File deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete file. Please try again.');
      console.error('Error deleting file:', err);
    }
  };

  const handleDownload = async (fileName: string): Promise<void> => {
    try {
      const blob = await fileService.downloadFile(fileName);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download file. Please try again.');
      console.error('Error downloading file:', err);
    }
  };

  const handleUploadError = (errors: string[]): void => {
    setError(errors.join(', '));
  };

  return (
    <div>
      <Header />
      
      <div className="container">
        {/* Upload Section */}
        <FileUpload 
          onUpload={handleUpload}
          onError={handleUploadError}
          isUploading={uploading}
        />

        {/* Messages */}
        {error && (
          <div className="error">
            {error}
          </div>
        )}
        
        {success && (
          <div className="success">
            {success}
          </div>
        )}

        {/* Files Section */}
        <div className="card">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2>Your Files ({files.length})</h2>
            <button 
              className="btn btn-secondary"
              onClick={loadFiles}
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'spinning' : ''} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="loading">
              <RefreshCw size={24} className="spinning" />
              Loading files...
            </div>
          ) : files.length === 0 ? (
            <div className="empty-state">
              <FolderOpen className="empty-icon" />
              <h3>No files uploaded yet</h3>
              <p>Upload your first file to get started!</p>
            </div>
          ) : (
            <div className="file-grid">
              {files.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 