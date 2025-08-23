'use client';

import React, { useEffect, useRef, useState } from 'react';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [start, setStart] = useState<boolean>(true);
  const frameIdRed = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const backgroundImg = new Image();
    backgroundImg.src = '/background.jpeg';

    const birdImg = new Image();
    birdImg.src = '/bird.png';

    let imagesLoaded = 0;
    const totalImages = 2;

    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        drawInitialFrame();
      }
    };

    backgroundImg.onload = onImageLoad;
    birdImg.onload = onImageLoad;

    const drawInitialFrame = () => {
      if (!canvasRef.current) return;
      ctx.drawImage(backgroundImg, 0, 0, canvasRef.current.width, canvasRef.current.height);

      ctx.drawImage(birdImg, 200, 200, 80, 80);

      if (!start) {
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 570, canvasRef.current.width, 30);

        ctx.fillStyle = 'rgba(216, 195, 95, 1)';
        ctx.fillRect(0, 600, canvasRef.current.width, 100);

        ctx.fillStyle = 'rgba(0, 208, 33, 1)';
        for (let x = tileOffset; x < canvasRef.current.width + spacing; x += spacing) {
          ctx.fillRect(x, groundY, tileW, tileH);
        }
      }
    };

    let tileOffset = 0;
    const speed = 4;
    const tileH = 26;
    const tileW = 30;
    const spacing = 36;
    const groundY = 572;
    const birdImgY = 200;
    let birdAngle = 0;

    async function animate() {
      if (!ctx || !canvasRef.current) return;

      tileOffset -= speed;
      birdAngle += 0.1;
      const birdOffset = Math.sin(birdAngle) * 10;

      ctx.drawImage(backgroundImg, 0, 0, canvasRef.current.width, canvasRef.current.height);

      ctx.fillStyle = 'green';
      ctx.fillRect(0, 570, canvasRef.current.width, 30);

      ctx.fillStyle = 'rgba(216, 195, 95, 1)';
      ctx.fillRect(0, 600, canvasRef.current.width, 100);

      ctx.drawImage(birdImg, 200, birdImgY + birdOffset, 80, 80);

      if (tileOffset <= -spacing) tileOffset += spacing;

      ctx.fillStyle = 'rgba(0, 208, 33, 1)';
      for (let x = tileOffset; x < canvasRef.current.width + spacing; x += spacing) {
        ctx.fillRect(x, groundY, tileW, tileH);
      }

      if (start) {
        frameIdRed.current = requestAnimationFrame(animate);
      }
    }

    animate();
  }, [start]);

  useEffect(() => {}, []);

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={500} height={700} className="bg-black" />
      <div className="absolute top-0 right-0 inline-flex gap-4">
        <button
          onClick={() => setStart(true)}
          className="cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-center font-bold text-white"
        >
          Start Game
        </button>
        <button
          onClick={() => {
            if (frameIdRed.current !== null) {
              cancelAnimationFrame(frameIdRed.current);
              frameIdRed.current = null;
              setStart(false);
            }
          }}
          className="cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-center font-bold text-white"
        >
          Stop Game
        </button>
      </div>
    </div>
  );
};

export default Game;
