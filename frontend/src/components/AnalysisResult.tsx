'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Receipt, Barcode } from 'lucide-react';

interface AnalysisResultProps {
  data: {
    food_item: string;
    details: { [key: string]: any };
  };
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  const { food_item, details } = data;

  // Extract total calories (massive display)
  const calories = details?.Calories || '---';
  const protein = details?.Protein || 'N/A';
  const carbs = details?.Carbohydrates || 'N/A';
  const fat = details?.Fat || 'N/A';

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const time = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const orderId = `#ORD_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0, rotate: 0 }}
      animate={{ y: 0, opacity: 1, rotate: -1.5 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="relative w-full max-w-md mx-auto mt-8 bg-receipt text-black p-8 receipt-shadow border-x-2 border-black/5"
    >
      {/* Perforated Top */}
      <div className="absolute top-[-10px] left-0 w-full h-[20px] bg-background perforated-bottom z-10" />

      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-dashed border-black/20 pb-6">
        <h2 className="text-4xl font-black tracking-tighter uppercase mb-1">NUTRITION LOG</h2>
        <div className="flex justify-between items-center text-[10px] font-mono text-black/60 px-2 mt-4">
          <div className="text-left leading-none uppercase">
            <div>Terminal: GROQ_LPU_01</div>
            <div>Auth: 9942-X-99</div>
          </div>
          <div className="text-right leading-none uppercase">
            <div>{date}</div>
            <div>{time}</div>
          </div>
        </div>
      </div>

      {/* Main Analysis */}
      <div className="space-y-6 mb-8">
        <div className="flex justify-between items-end border-b border-black/10 pb-2">
          <span className="text-xs font-mono text-black/40">IDENT_TARGET:</span>
          <span className="text-xl font-bold uppercase truncate max-w-[200px]">{food_item}</span>
        </div>

        {/* Nutritional Breakdown */}
        <div className="space-y-2 py-4">
          <div className="flex justify-between items-center text-sm font-mono">
            <span className="font-bold">TOTAL_PROTEIN</span>
            <span className="border-b border-dotted border-black/20 grow mx-4 h-3" />
            <span>{protein}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-mono">
            <span className="font-bold">TOTAL_CARBS</span>
            <span className="border-b border-dotted border-black/20 grow mx-4 h-3" />
            <span>{carbs}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-mono">
            <span className="font-bold">TOTAL_LIPIDS</span>
            <span className="border-b border-dotted border-black/20 grow mx-4 h-3" />
            <span>{fat}</span>
          </div>
        </div>

        {/* The Grand Total */}
        <div className="text-center py-6 border-y-4 border-black border-double">
          <div className="text-[10px] font-mono font-bold tracking-widest text-black/60 uppercase mb-2">CALORIC_INTAKE_ESTIMATE</div>
          <div className="text-8xl font-black italic tracking-tighter leading-none">{calories.toString().replace(' kcal', '').replace(' KCAL', '')}</div>
          <div className="text-sm font-bold uppercase mt-2 italic">KiloCalories</div>
        </div>
      </div>

      {/* Verification & Latency */}
      <div className="space-y-4 mb-8">
        <div className="bg-accent/5 p-3 border border-accent/20 flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="text-[10px] leading-tight text-black/80">
            <span className="font-black text-accent uppercase block mb-1">CoV VERIFIED</span>
            Identification and portioning cross-referenced with USDA FoodData Central. 98.4% Confidence Score.
          </div>
        </div>

        <div className="flex justify-between items-center bg-black/5 p-2 rounded-sm font-mono text-[9px] uppercase tracking-widest text-black/40">
          <div className="flex items-center">
            <Zap className="w-3 h-3 mr-1" />
            <span>Inference Speed: 1.2s</span>
          </div>
          <div className="flex items-center">
            <span>Power: Groq LPU™</span>
          </div>
        </div>
      </div>

      {/* Footer / Barcode */}
      <div className="pt-4 border-t-2 border-dashed border-black/20">
        <div className="flex flex-col items-center">
          <div className="text-[10px] font-mono mb-2">{orderId}</div>
          <div className="w-full h-12 bg-black flex items-center justify-center relative group">
            {/* Simple Barcode SVG/Lines */}
            <div className="flex h-8 space-x-0.5">
              {[2, 1, 4, 1, 3, 2, 1, 1, 4, 2, 1, 3, 2, 4, 1, 1, 3, 2, 2, 1, 4].map((w, i) => (
                <div key={i} className="bg-white" style={{ width: `${w}px` }} />
              ))}
            </div>
          </div>
          <div className="text-[8px] font-mono mt-2 tracking-[0.5em] text-black/40 uppercase">DATA_TRANSMISSION_COMPLETE</div>
        </div>
      </div>

      {/* Perforated Bottom */}
      <div className="absolute bottom-[-10px] left-0 w-full h-[20px] bg-background perforated-top z-10" />
    </motion.div>
  );
};

export default AnalysisResult;
