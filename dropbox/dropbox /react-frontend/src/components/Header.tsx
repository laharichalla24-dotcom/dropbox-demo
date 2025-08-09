import React from 'react';
import { Cloud, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">
        <Cloud size={32} color="#7c9ff0" />
        <h1>CloudVault</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Zap size={20} color="#7c9ff0" />
        <span style={{ color: '#7c9ff0', fontWeight: '600' }}>Secure & Fast</span>
      </div>
    </header>
  );
};

export default Header; 