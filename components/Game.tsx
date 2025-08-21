'use client';

import React, { useEffect, useRef } from 'react';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.src = '/background.jpeg';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 500, 700);
    };
  }, []);

  return <canvas ref={canvasRef} width={500} height={700} className="bg-black" />;
};

export default Game;
