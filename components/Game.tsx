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
      if (!canvasRef.current) return;
      ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    let offset = 0;
    const speed = 4;
    const tileH = 26;
    const tileW = 30;
    const spacing = 36;
    const groundy = 572;

    function animate() {
      if (!ctx || !canvasRef.current) return;
      offset -= speed;

      ctx.fillStyle = 'green';
      ctx.fillRect(0, 570, canvasRef.current.width, tileH);

      ctx.fillStyle = 'rgba(245, 201, 145, 0.8)';
      ctx.fillRect(0, 600, canvasRef.current.width, 100);

      if (offset <= -spacing) offset += spacing;

      ctx.fillStyle = 'rgba(0, 208, 33, 0.8)';
      for (let x = offset; x < canvasRef.current.width + spacing; x += spacing) {
        ctx.fillRect(x, groundy, tileW, tileH);
      }

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return <canvas ref={canvasRef} width={500} height={700} className="bg-black" />;
};

export default Game;
