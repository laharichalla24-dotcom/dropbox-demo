import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import FileViewer from './components/FileViewer';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/file/:fileName" element={<FileViewer />} />
      </Routes>
    </div>
  );
};

export default App; 