import React from 'react';

interface SkillbagLogoProps {
  width?: number;
  height?: number;
  className?: string;
  isWhite?: boolean;
}

export function SkillbagLogo({ width = 200, height = 48, className = '', isWhite = false }: SkillbagLogoProps) {
  // Colors based on the exact image
  const orangeColor = isWhite ? "#FFFFFF" : "#FF6B00"; // Brighter orange for better visibility
  const blueColor = isWhite ? "#FFFFFF" : "#0C2D69"; // Navy blue
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 400 48" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Logo Group */}
      <g>
        {/* Orange Spiral/Swirl - enhanced design */}
        <path 
          d="M45,24 C45,8 3,8 3,24 C3,40 45,40 45,24 C45,16 30,16 30,24 C30,32 45,32 45,24" 
          fill={orangeColor}
          strokeWidth="0"
        />
        
        {/* Text "Skillbag" */}
        <g transform="translate(55, 4)">
          {/* S */}
          <path d="M14,4 C8,4 4,8 4,13 C4,18 8,20 14,22 C20,24 23,26 23,31 C23,36 19,40 14,40 C7,40 3,35 3,29 L8,29 C8,33 10,35 14,35 C18,35 18,31 18,29 C18,25 14,23 10,21 C4,19 -1,17 -1,10 C-1,4 4,0 13,0 C21,0 24,6 24,12 L19,12 C19,7 16,4 14,4Z" fill={blueColor}/>
          
          {/* k */}
          <path d="M37,1 L37,16 L52,1 L60,1 L44,16 L62,39 L54,39 L40,20 L37,23 L37,39 L32,39 L32,1 L37,1Z" fill={blueColor}/>
          
          {/* i */}
          <path d="M72,1 L72,39 L67,39 L67,1 L72,1Z" fill={blueColor}/>
          <circle cx="70" cy="-5" r="5" fill={orangeColor}/>
          
          {/* l */}
          <path d="M87,1 L87,39 L82,39 L82,1 L87,1Z" fill={blueColor}/>
          
          {/* l */}
          <path d="M102,1 L102,39 L97,39 L97,1 L102,1Z" fill={blueColor}/>
          
          {/* b */}
          <path d="M117,1 L117,39 L112,39 L112,30 C110,36 105,40 100,40 C90,40 85,33 85,20 C85,7 90,0 100,0 C105,0 110,4 112,10 L112,1 L117,1Z M100,5 C92,5 90,11 90,20 C90,29 92,35 100,35 C108,35 112,29 112,20 C112,11 108,5 100,5Z" fill={blueColor}/>
          
          {/* a */}
          <path d="M135,0 C145,0 150,7 150,20 L150,39 L145,39 L145,30 C143,36 138,40 133,40 C123,40 118,35 118,27 C118,18 123,13 135,13 L145,13 L145,11 C145,8 142,5 135,5 C128,5 127,9 127,13 L122,13 C122,4 128,0 135,0Z M135,18 C125,18 123,23 123,27 C123,31 126,35 133,35 C143,35 145,25 145,23 L145,18 L135,18Z" fill={blueColor}/>
          
          {/* g */}
          <path d="M170,0 C180,0 185,7 185,20 C185,33 180,40 170,40 C165,40 160,36 158,30 L158,48 L153,48 L153,1 L158,1 L158,10 C160,4 165,0 170,0Z M170,5 C162,5 158,11 158,20 C158,29 162,35 170,35 C178,35 180,29 180,20 C180,11 178,5 170,5Z" fill={blueColor}/>
        </g>
      </g>
    </svg>
  );
}