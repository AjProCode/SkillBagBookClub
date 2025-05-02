import React from 'react';

export const SkillbagLogo = ({ height = 50, className = '' }) => {
  const width = height * 3;
  return (
    <div className={`relative overflow-visible ${className}`} style={{ height: `${height}px`, width: `${width}px` }}>
      <div className="font-bold" style={{ 
        fontSize: `${height * 0.7}px`, 
        color: '#1A237E',
        display: 'inline-block',
        position: 'absolute',
        left: `${height * 0.8}px`,
        top: '50%',
        transform: 'translateY(-50%)'
      }}>
        Skillbag
      </div>
      <div style={{ 
        height: `${height}px`, 
        width: `${height}px`, 
        borderRadius: '50%', 
        backgroundColor: '#FF7F00',
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          height: `${height * 0.6}px`, 
          width: `${height * 0.6}px`, 
          borderRadius: '50%', 
          border: `${height * 0.08}px solid white`,
          borderTopColor: 'transparent',
          transform: 'rotate(45deg)'
        }}></div>
      </div>
    </div>
  );
};

export const SkillbagLogoWhite = ({ height = 50, className = '' }) => {
  const width = height * 3;
  return (
    <div className={`relative overflow-visible ${className}`} style={{ height: `${height}px`, width: `${width}px` }}>
      <div className="font-bold" style={{ 
        fontSize: `${height * 0.7}px`, 
        color: 'white',
        display: 'inline-block',
        position: 'absolute',
        left: `${height * 0.8}px`,
        top: '50%',
        transform: 'translateY(-50%)'
      }}>
        Skillbag
      </div>
      <div style={{ 
        height: `${height}px`, 
        width: `${height}px`, 
        borderRadius: '50%', 
        backgroundColor: 'white',
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          height: `${height * 0.6}px`, 
          width: `${height * 0.6}px`, 
          borderRadius: '50%', 
          border: `${height * 0.08}px solid #FF7F00`,
          borderTopColor: 'transparent',
          transform: 'rotate(45deg)'
        }}></div>
      </div>
    </div>
  );
};