import React from 'react';

interface SkillbagLogoProps {
  width?: number;
  height?: number;
  className?: string;
  isWhite?: boolean;
}

export function SkillbagLogo({ width = 200, height = 60, className = '', isWhite = false }: SkillbagLogoProps) {
  return (
    <div className={className} style={{ width: width, height: height }}>
      <img 
        src="/assets/skillbag-logo.jpeg"
        alt="Skillbag Logo"
        width={width}
        height={height}
        style={{ 
          objectFit: 'contain', 
          width: '100%', 
          height: '100%', 
          display: 'inline-block', 
          verticalAlign: 'middle' 
        }}
      />
    </div>
  );
}