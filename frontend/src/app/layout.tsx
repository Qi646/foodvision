import './globals.css';
import { Outfit, Space_Mono } from 'next/font/google';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '700', '900'],
});

const spaceMono = Space_Mono({ 
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'FoodVision | Nutrition_Log',
  description: 'Digital Receipt of Nutritional Truth. Powered by Groq LPU.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${spaceMono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
