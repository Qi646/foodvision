'use client';

import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import AnalysisResult from '../components/AnalysisResult';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Info, Terminal, LayoutDashboard, Database } from 'lucide-react';

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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
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
    <main className="min-h-screen relative p-4 md:p-12 selection:bg-accent selection:text-white">
      {/* Background HUD Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
        <div className="absolute top-10 left-10 text-[10px] font-mono text-white/40">
          SYS_LOG_V:0.9.4<br />
          GROQ_ACCEL: ENABLED<br />
          LPU_TEMP: 34.2C
        </div>
        <div className="absolute bottom-10 right-10 text-[10px] font-mono text-white/40 text-right">
          LATENCY_OPTIMIZATION: ACTIVE<br />
          PORT: 8000_LOCAL<br />
          CONN: SSL_BYPASS_DEV
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-12 border-b border-white/10 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic">
              FoodVision<span className="text-accent italic not-italic text-sm ml-2 font-mono tracking-widest">[BETA_V1]</span>
            </h1>
            <p className="text-xs font-mono text-white/40 uppercase tracking-[0.3em] mt-2">
              Digital Receipt of Nutritional Truth // Powered by Groq LPU™
            </p>
          </div>
          <div className="hidden md:flex space-x-4 mb-2">
            <div className="flex items-center space-x-1 text-white/40 text-[10px] font-mono uppercase">
              <Database className="w-3 h-3" />
              <span>USDA_DB_0.1</span>
            </div>
            <div className="flex items-center space-x-1 text-accent text-[10px] font-mono uppercase">
              <Terminal className="w-3 h-3" />
              <span>LPU_ONLINE</span>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Input */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-white/60">TARGET_ACQUISITION</h2>
              </div>
              <ImageUpload
                onImageUpload={handleImageUpload}
                onClear={handleClear}
                selectedFile={selectedFile}
                imageUrl={imageUrl}
                onAnalyze={handleAnalyze}
                loading={loading}
              />
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="p-4 border-l-4 border-accent bg-accent/10 text-accent font-mono text-xs uppercase"
                >
                  <p className="font-bold mb-1">[ERROR_DETECTED]</p>
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tooltip/Info */}
            <div className="p-4 border border-white/10 text-white/40 font-mono text-[10px] uppercase leading-relaxed">
              <p className="flex items-center mb-2 text-white/60">
                <Info className="w-3 h-3 mr-2" />
                <span>Operational Parameters:</span>
              </p>
              <p>Upload a high-fidelity image containing edible organic matter. Identification accuracy is optimized for 224x224 input resolution. Processing handles extraction, identification, and USDA lookup in under 1.5s.</p>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="relative min-h-[400px] flex flex-col items-center">
            <div className="absolute top-0 left-0 w-full h-full border-2 border-white/5 border-dashed rounded-sm -z-10" />
            
            <AnimatePresence mode="wait">
              {analysisResult ? (
                <AnalysisResult key="result" data={analysisResult} />
              ) : loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-20 flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-16 h-16 border-4 border-white/10 border-t-accent rounded-full animate-spin" />
                  <div className="font-mono text-xs uppercase tracking-widest text-accent animate-pulse">
                    Synthesizing_Nutritional_Truth...
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-20 flex flex-col items-center text-center space-y-6 opacity-20"
                >
                  <LayoutDashboard className="w-16 h-16 text-white" />
                  <div className="font-mono text-xs uppercase tracking-[0.4em] text-white">
                    Waiting_For_Target
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </main>
  );
}
