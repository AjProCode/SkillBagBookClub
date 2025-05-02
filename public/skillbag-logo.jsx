import React from 'react';

export const SkillbagLogo = ({ height = 50, className = '' }) => {
  return (
    <svg width={height * 2} height={height} viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="35" fill="#FF7F00" />
      <path d="M35 35C35 35 50 25 65 35C80 45 65 70 50 65C35 60 35 35 35 35Z" fill="white" />
      <text x="75" y="60" fontFamily="Arial" fontSize="32" fontWeight="bold" fill="#1A237E">Skillbag</text>
    </svg>
  );
};

export const SkillbagLogoWhite = ({ height = 50, className = '' }) => {
  return (
    <svg width={height * 2} height={height} viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="35" fill="white" />
      <path d="M35 35C35 35 50 25 65 35C80 45 65 70 50 65C35 60 35 35 35 35Z" fill="#FF7F00" />
      <text x="75" y="60" fontFamily="Arial" fontSize="32" fontWeight="bold" fill="white">Skillbag</text>
    </svg>
  );
};