'use client';

import React, { useEffect, useRef } from 'react';

export function AiEngineCore() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Add dynamic glow animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse-glow {
        0%, 100% { filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 40px rgba(59, 130, 246, 0.3)); }
        50% { filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 60px rgba(59, 130, 246, 0.5)); }
      }
      
      @keyframes orbit-rings {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes orbit-rings-reverse {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
      }
      
      @keyframes nucleus-pulse {
        0%, 100% { r: 15px; }
        50% { r: 18px; }
      }
      
      @keyframes neural-flow {
        0% { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: -1000; }
      }
      
      .engine-core {
        animation: pulse-glow 3s ease-in-out infinite;
      }
      
      .orbit-ring {
        transform-origin: center;
        animation: orbit-rings 20s linear infinite;
      }
      
      .orbit-ring-reverse {
        transform-origin: center;
        animation: orbit-rings-reverse 15s linear infinite;
      }
      
      .nucleus {
        animation: nucleus-pulse 2s ease-in-out infinite;
      }
      
      .neural-line {
        animation: neural-flow 8s linear infinite;
        stroke-linecap: round;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-full w-full">
      <svg
        ref={svgRef}
        viewBox="0 0 300 300"
        className="engine-core w-full h-full max-w-md max-h-md"
        style={{ filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.6))' }}
      >
        {/* Outer rings */}
        <g className="orbit-ring" opacity="0.3">
          <circle cx="150" cy="150" r="130" fill="none" stroke="url(#gradient1)" strokeWidth="2" />
        </g>

        <g className="orbit-ring-reverse" opacity="0.4">
          <circle cx="150" cy="150" r="100" fill="none" stroke="url(#gradient2)" strokeWidth="2" />
        </g>

        <g className="orbit-ring" opacity="0.5">
          <circle cx="150" cy="150" r="70" fill="none" stroke="url(#gradient3)" strokeWidth="2" />
        </g>

        {/* Neural network lines */}
        <line
          x1="150"
          y1="150"
          x2="220"
          y2="150"
          stroke="url(#gradientNeural)"
          strokeWidth="1.5"
          opacity="0.6"
          className="neural-line"
          strokeDasharray="1000"
        />
        <line
          x1="150"
          y1="150"
          x2="100"
          y2="220"
          stroke="url(#gradientNeural)"
          strokeWidth="1.5"
          opacity="0.6"
          className="neural-line"
          strokeDasharray="1000"
        />
        <line
          x1="150"
          y1="150"
          x2="80"
          y2="100"
          stroke="url(#gradientNeural)"
          strokeWidth="1.5"
          opacity="0.6"
          className="neural-line"
          strokeDasharray="1000"
        />

        {/* Orbiting particles */}
        <g className="orbit-ring">
          <circle cx="150" cy="30" r="3" fill="#00d9ff" opacity="0.8" />
        </g>
        <g className="orbit-ring-reverse">
          <circle cx="270" cy="150" r="3" fill="#a78bfa" opacity="0.8" />
        </g>
        <g className="orbit-ring">
          <circle cx="150" cy="270" r="3" fill="#00d9ff" opacity="0.8" />
        </g>

        {/* Central nucleus */}
        <defs>
          <radialGradient id="gradient1" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id="gradient2" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
          </radialGradient>
          <radialGradient id="gradient3" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00d9ff" stopOpacity="0.3" />
          </radialGradient>
          <linearGradient id="gradientNeural" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#00d9ff" />
          </linearGradient>
          <radialGradient id="nucleusGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </radialGradient>
        </defs>

        {/* Nucleus core - the heart of the engine */}
        <circle cx="150" cy="150" r="15" fill="url(#nucleusGradient)" className="nucleus" />

        {/* Nucleus glow */}
        <circle
          cx="150"
          cy="150"
          r="15"
          fill="none"
          stroke="#a78bfa"
          strokeWidth="1"
          opacity="0.4"
          className="nucleus"
        />
      </svg>
    </div>
  );
}
