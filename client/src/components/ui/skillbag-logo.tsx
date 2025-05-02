import React from 'react';

interface SkillbagLogoProps {
  width?: number;
  height?: number;
  className?: string;
  isWhite?: boolean;
}

export function SkillbagLogo({ width = 200, height = 60, className = '', isWhite = false }: SkillbagLogoProps) {
  // Use the exact logo image from the attached assets
  const logoSrc = "/images/skillbag-logo.jpeg";
  
  return (
    <img 
      src={logoSrc}
      alt="Skillbag Logo"
      width={width}
      height={height}
      className={className}
      style={{ objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle' }}
    />
  );
}