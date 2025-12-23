import React from 'react';

const SkeletonCard = () => {
  return (
    <div style={{
      border: '1px solid #333',
      height: '100%',
      background: '#111',
      animation: 'pulse 1.5s infinite ease-in-out'
    }}>
      <div style={{ 
        aspectRatio: '3/4', 
        background: '#222',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
          animation: 'shimmer 1.5s infinite'
        }}></div>
      </div>
      
      <div style={{ padding: '1rem' }}>
        <div style={{ height: '10px', width: '30%', background: '#333', marginBottom: '0.5rem', borderRadius: '4px' }}></div>
        <div style={{ height: '20px', width: '80%', background: '#333', marginBottom: '0.5rem', borderRadius: '4px' }}></div>
        <div style={{ height: '18px', width: '40%', background: '#333', borderRadius: '4px' }}></div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SkeletonCard;
