'use client';

import React from 'react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onClear: () => void;
  selectedFile: File | null;
  onAnalyze: () => void; // New prop for explicit analyze action
  loading: boolean; // New prop to indicate loading state
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, onClear, selectedFile, onAnalyze, loading }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="bg-secondary p-8 rounded-2xl shadow-md border border-gray-200">
      <h3 className="text-2xl font-semibold text-primary mb-6 text-center">Upload Your Food Image</h3>
      <div className={`relative border border-gray-400 rounded-xl p-12 text-center transition-all duration-300 ease-in-out bg-white
        ${selectedFile ? '' : 'hover:border-primary hover:bg-gray-50'}`}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          disabled={selectedFile !== null || loading}
        />
        <div className={`flex flex-col items-center ${selectedFile ? 'text-gray-600' : 'text-gray-500'}`}>
          <svg className="w-16 h-16 mb-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
          <p className="font-medium text-lg">{selectedFile ? selectedFile.name : 'Drag your food photo here, or click to choose'}</p>
          {!selectedFile && <p className="text-sm text-gray-500 mt-1">(JPG, PNG, GIF, WEBP)</p>}
        </div>
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        {selectedFile && (
          <button
            onClick={onClear}
            className="px-8 py-3 bg-gray-500 text-white rounded-lg text-lg font-semibold shadow-sm hover:bg-gray-600 transition-colors duration-300"
            disabled={loading}
          >
            Clear Photo
          </button>
        )}
        {selectedFile && (
          <button
            onClick={onAnalyze}
            className="px-8 py-3 bg-primary text-white rounded-lg text-lg font-semibold shadow-sm hover:bg-green-700 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze My Food'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;