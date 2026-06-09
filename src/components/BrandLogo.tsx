import React from 'react';

interface BrandLogoProps {
  id: string;
  className?: string;
}

export default function BrandLogo({ id, className = "w-full h-full object-contain" }: BrandLogoProps) {
  const [imgError, setImgError] = React.useState(false);
  
  // Map brand ID to filename (keeping your original filenames)
  const getImagePath = (brandId: string): string => {
    const brandMap: Record<string, string> = {
      'volkswagen': '/volkswagen.jpg',
      'skoda': '/skoda.jpg',
      'kia': '/kia.jpg',
      'toyota': '/toyota.jpg',
      'tata': '/tata.jpg',
      'hyundai': '/hyundai.jpg',
      'mahindra': '/mahindra.jpg',
      'maruti': '/Maruti-su.jpg',
      'maruti suzuki': '/Maruti&suzuki.jpg',
      'honda': '/honda.jpg',
      'mg': '/mghector.jpg',
    };
    
    const normalizedId = brandId.toLowerCase();
    return brandMap[normalizedId] || '';
  };

  const imagePath = getImagePath(id);

  if (imgError || !imagePath) {
    // Fallback: Show brand name initial
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-full">
        <span className="text-sm font-bold text-slate-500">
          {id.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={imagePath}
      alt={`${id} logo`}
      className={className}
      onError={() => setImgError(true)}
    />
  );
}