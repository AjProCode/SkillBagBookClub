import React from 'react';

interface SkillbagLogoProps {
  width?: number;
  height?: number;
  className?: string;
  isWhite?: boolean;
}

export function SkillbagLogo({ width = 200, height = 60, className = '', isWhite = false }: SkillbagLogoProps) {
  // Colors exactly matched from the screenshot
  const orangeColor = isWhite ? "#FFFFFF" : "#FF6E00"; // Bright orange from the original logo
  const blueColor = isWhite ? "#FFFFFF" : "#192C6B"; // Navy blue from the original logo
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 600 144" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <g>
        {/* Orange Spiral - exact match to the original */}
        <path
          d="M116,72 C116,33 20,33 20,72 C20,111 116,111 116,72 Z"
          fill={orangeColor}
          strokeWidth="0"
        />
        <path
          d="M95,72 C95,50 40,50 40,72 C40,94 95,94 95,72 Z"
          fill="#FFFFFF"
          strokeWidth="0"
        />
        <path
          d="M82,72 C82,56 53,56 53,72 C53,88 82,88 82,72 Z"
          fill={orangeColor}
          strokeWidth="0"
        />
        
        {/* Skillbag text - exact match to original */}
        <g transform="translate(160, 20)">
          {/* S */}
          <path d="M20,18 C10,18 5,25 5,32 C5,42 12,45 25,50 C38,55 42,60 42,70 C42,80 35,90 20,90 C5,90 0,80 0,70 L15,70 C15,75 17,78 20,78 C25,78 27,75 27,70 C27,65 23,63 15,60 C0,55 -10,50 -10,32 C-10,15 0,5 20,5 C40,5 50,15 50,28 L35,28 C35,22 30,18 20,18" fill={blueColor}/>
          
          {/* k */}
          <path d="M90,8 L90,35 L120,8 L145,8 L105,45 L148,92 L123,92 L90,50 L90,92 L75,92 L75,8 L90,8Z" fill={blueColor}/>
          
          {/* i */}
          <path d="M160,8 L160,92 L145,92 L145,8 L160,8Z" fill={blueColor}/>
          <circle cx="152.5" cy="-5" r="12" fill={orangeColor}/> 
          
          {/* l */}
          <path d="M185,8 L185,92 L170,92 L170,8 L185,8Z" fill={blueColor}/>
          
          {/* l */}
          <path d="M210,8 L210,92 L195,92 L195,8 L210,8Z" fill={blueColor}/>
          
          {/* b */}
          <path d="M235,8 L235,92 L220,92 L220,80 C215,88 205,95 190,95 C170,95 155,80 155,50 C155,20 170,5 190,5 C205,5 215,12 220,20 L220,8 L235,8Z M190,20 C175,20 170,30 170,50 C170,70 175,80 190,80 C205,80 220,70 220,50 C220,30 205,20 190,20Z" fill={blueColor}/>
          
          {/* a */}
          <path d="M270,5 C290,5 305,15 305,50 L305,92 L290,92 L290,80 C285,88 275,95 260,95 C240,95 225,85 225,70 C225,55 240,40 270,40 L290,40 C290,28 285,20 270,20 C255,20 250,28 250,38 L235,38 C235,15 250,5 270,5Z M270,55 C250,55 240,60 240,70 C240,80 250,82 260,82 C282,82 290,65 290,60 L290,55 L270,55Z" fill={blueColor}/>
          
          {/* g */}
          <path d="M340,5 C360,5 375,20 375,50 C375,80 360,95 340,95 C325,95 315,88 310,80 L310,110 L295,110 L295,8 L310,8 L310,20 C315,12 325,5 340,5Z M340,20 C325,20 310,30 310,50 C310,70 325,80 340,80 C355,80 360,70 360,50 C360,30 355,20 340,20Z" fill={blueColor}/>
        </g>
      </g>
    </svg>
  );
}