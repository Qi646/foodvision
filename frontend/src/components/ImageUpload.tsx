'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Upload, Trash2, Crosshair, ChevronRight } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onClear: () => void;
  selectedFile: File | null;
  imageUrl: string | null;
  onAnalyze: () => void;
  loading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUpload, 
  onClear, 
  selectedFile, 
  imageUrl,
  onAnalyze, 
  loading 
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const captureId = `CAPT_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* HUD Scanner Container */}
      <div className="relative group overflow-hidden border-2 border-white/10 aspect-square sm:aspect-video rounded-sm bg-black flex items-center justify-center">
        
        {/* HUD Elements */}
        <div className="absolute top-4 left-4 z-20 flex flex-col text-[10px] font-mono text-accent leading-none">
          <span>{captureId}</span>
          <span>40.7128° N, 74.0060° W</span>
        </div>
        <div className="absolute bottom-4 right-4 z-20 text-[10px] font-mono text-accent">
          <span>{timestamp}</span>
        </div>

        {/* HUD Corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent z-10" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent z-10" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent z-10" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent z-10" />

        <AnimatePresence mode="wait">
          {!imageUrl ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
              />
              <Upload className="w-12 h-12 mb-4 text-white/40 group-hover:text-accent transition-colors duration-500" />
              <p className="text-sm font-mono tracking-widest uppercase text-white/40 group-hover:text-white transition-colors duration-500">
                [ INIT_UPLOAD_SEQUENCE ]
              </p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative w-full h-full"
            >
              <img src={imageUrl} alt="Target" className="w-full h-full object-cover" />
              
              {/* Scanner Line Animation */}
              {loading && (
                <motion.div 
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute left-0 w-full h-[2px] bg-accent shadow-[0_0_15px_rgba(255,77,0,0.8)] z-30"
                />
              )}

              {/* Targeting Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Crosshair className={`w-16 h-16 ${loading ? 'text-accent animate-pulse' : 'text-white/20'}`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onClear}
          disabled={!selectedFile || loading}
          className="flex items-center justify-center space-x-2 py-4 border border-white/10 font-mono text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all disabled:opacity-30"
        >
          <Trash2 className="w-4 h-4" />
          <span>Reset</span>
        </button>

        <button
          onClick={onAnalyze}
          disabled={!selectedFile || loading}
          className={`flex items-center justify-center space-x-2 py-4 font-mono text-xs tracking-widest uppercase transition-all
            ${loading ? 'bg-accent text-white animate-pulse' : 'bg-white text-black hover:bg-accent hover:text-white disabled:opacity-30'}`}
        >
          {loading ? (
            <>
              <Scan className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <ChevronRight className="w-4 h-4" />
              <span>Run_Analysis</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;
