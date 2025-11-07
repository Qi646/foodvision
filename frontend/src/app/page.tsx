'use client';

import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import AnalysisResult from '../components/AnalysisResult';
import ImageDisplay from '../components/ImageDisplay';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (file: File) => {
    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleClear = () => {
    setSelectedFile(null);
    setImageUrl(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="container mx-auto p-4 sm:p-8">
        <header className="text-center my-12">
          <h1 className="text-5xl font-bold text-primary tracking-tight">
            FoodVision
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Your friendly, AI-powered nutrition guide.
          </p>
        </header>

        <div className="max-w-2xl mx-auto flex flex-col items-center space-y-8">
          <ImageUpload
            onImageUpload={handleImageUpload}
            onClear={handleClear}
            selectedFile={selectedFile}
            onAnalyze={handleAnalyze}
            loading={loading}
          />

          {imageUrl && selectedFile && (
            <ImageDisplay imageUrl={imageUrl} fileName={selectedFile.name} />
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-lg">Analyzing your food...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
              <p><span className="font-semibold">Oops!</span> {error}</p>
            </div>
          )}

          {analysisResult && (
            <AnalysisResult data={analysisResult} />
          )}
        </div>
      </div>
    </main>
  );
}
