import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Trash2, Eye, FileText, Image, File, Archive } from 'lucide-react';
import { 
  formatFileSize, 
  formatDate, 
  getFileTypeCategory 
} from '../utils/fileUtils';
import { FileCardProps } from '../types';

const FileCard: React.FC<FileCardProps> = ({ file, onDelete, onDownload }) => {
  const navigate = useNavigate();
  const fileTypeCategory = getFileTypeCategory(file.originalFileName);

  const handleView = () => {
    navigate(`/file/${file.fileName}`);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(file.fileName);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${file.originalFileName}"?`)) {
      onDelete(file.fileName);
    }
  };

  const getFileIconComponent = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const size = 24;
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension || '')) {
      return <Image size={size} style={{
        background: 'linear-gradient(135deg, #7c9ff0 0%, #a78bfa 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }} />;
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
      return <Archive size={size} style={{
        background: 'linear-gradient(135deg, #7c9ff0 0%, #a78bfa 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }} />;
    } else {
      return <FileText size={size} style={{
        background: 'linear-gradient(135deg, #7c9ff0 0%, #a78bfa 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }} />;
    }
  };

  return (
    <div className="file-card">
      <div className="file-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          {getFileIconComponent(file.originalFileName)}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="file-name">{file.originalFileName}</div>
            <div className="file-meta">
              <span>{formatFileSize(file.fileSize)}</span>
              <span style={{
                background: 'linear-gradient(135deg, #7c9ff0 0%, #a78bfa 50%, #c4b5fd 100%)',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {fileTypeCategory}
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ 
          fontSize: '0.8rem', 
          color: '#718096', 
          marginBottom: '15px',
          padding: '8px 12px',
          background: 'linear-gradient(135deg, rgba(124, 159, 240, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%)',
          borderRadius: '8px',
          border: '1px solid rgba(124, 159, 240, 0.1)'
        }}>
          📅 Uploaded: {formatDate(file.uploadedAt)}
        </div>
      </div>
      
      <div className="file-actions">
        <button 
          className="btn btn-primary"
          onClick={handleView}
          style={{ flex: 1 }}
        >
          <Eye size={16} />
          View
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={handleDownload}
          style={{ flex: 1 }}
        >
          <Download size={16} />
          Download
        </button>
        
        <button 
          className="btn btn-danger"
          onClick={handleDelete}
          style={{ flex: 1 }}
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default FileCard; 