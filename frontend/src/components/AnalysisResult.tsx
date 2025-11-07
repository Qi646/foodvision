import React from 'react';

interface AnalysisResultProps {
  data: {
    food_item: string;
    details: { [key: string]: any };
  };
}

// Helper function to get an icon based on nutrient key
const getNutrientIcon = (key: string) => {
  switch (key.toLowerCase()) {
    case 'calories':
      return <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" /></svg>;
    case 'protein':
      return <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 11-2 0 1 1 0 012 0zM5.586 16.414a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L10 14.414l-2.586 2.586a1 1 0 01-1.414 0zM15 10a1 1 0 11-2 0 1 1 0 012 0zm-10 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" /></svg>;
    case 'carbohydrates':
      return <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
    case 'fat':
      return <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.929 17.071A10.007 10.007 0 0110 20a10.007 10.007 0 017.071-2.929 10.007 10.007 0 01-7.071 2.929 10.007 10.007 0 01-7.071-2.929zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
    default:
      return <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a3 3 0 10-6 0v4a3 3 0 106 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" /></svg>;
  }
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  return (
    <div className="bg-secondary p-8 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold text-primary mb-6 text-center capitalize">{data.food_item}</h2>

      {data.details && Object.keys(data.details).length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-inner">
          <h3 className="text-xl font-semibold text-text mb-4">Nutritional Breakdown</h3>
          <ul className="space-y-3">
            {Object.entries(data.details).map(([key, value]) => (
              <li key={key} className="flex items-center justify-between text-lg">
                <span className="flex items-center capitalize font-semibold text-gray-700">
                  {getNutrientIcon(key)}{key}
                </span>
                <span className="font-mono bg-primary text-white px-3 py-1 rounded-md text-base">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
