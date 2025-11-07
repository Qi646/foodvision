'use client';

import React from 'react';
import Image from 'next/image';

interface ImageDisplayProps {
  imageUrl: string;
  fileName: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, fileName }) => {
  return (
    <div className="bg-secondary p-8 rounded-2xl shadow-md border border-gray-200">
      <h3 className="text-2xl font-semibold text-primary mb-6 text-center">Your Food Photo</h3>
      <div className="relative w-full h-80 rounded-xl overflow-hidden border border-gray-300">
        <Image src={imageUrl} alt={`Selected food: ${fileName}`} width={320} height={320} className="object-cover w-full h-full" />
      </div>
    </div>
  );
};

export default ImageDisplay;
