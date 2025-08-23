'use client';

import React, { useEffect, useRef, useState } from 'react';

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [start, setStart] = useState<boolean>(true);
  const frameIdRed = useRef<number | null>(null);
  const [showButton, setShowButton] = useState<boolean>(true);
  const birdImgYRef = useRef<number>(200);
  const birdVelocityRef = useRef<number>(0);
  const [gameOver, setGameOver] = useState(false);

  const buttonClasses =
    'cursor-pointer w-fit rounded-xl bg-orange-600 px-4 py-2 text-center text-xl font-bold text-white ring-2 ring-white transition-colors hover:bg-orange-500 active:bg-orange-400';

  const handler = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (showButton) return;

    birdVelocityRef.current = -10;
  };

  useEffect(() => {
    if (gameOver && frameIdRed.current !== null) {
      cancelAnimationFrame(frameIdRed.current);
    }
  }, [gameOver]);

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
    let birdAngle = 0;

    async function animate() {
      if (!ctx || !canvasRef.current) return;

      tileOffset -= speed;
      birdAngle += 0.1;
      const birdOffset = Math.sin(birdAngle) * 10;

      if (!showButton) {
        birdVelocityRef.current += 0.8;
        birdImgYRef.current += birdVelocityRef.current;
      }

      ctx.drawImage(backgroundImg, 0, 0, canvasRef.current.width, canvasRef.current.height);

      ctx.drawImage(
        birdImg,
        200,
        !showButton ? birdImgYRef.current : birdImgYRef.current + birdOffset,
        80,
        80
      );

      ctx.fillStyle = 'green';
      ctx.fillRect(0, 570, canvasRef.current.width, 30);

      ctx.fillStyle = 'rgba(216, 195, 95, 1)';
      ctx.fillRect(0, 600, canvasRef.current.width, 100);

      if (birdImgYRef.current >= 520) {
        setGameOver(true);
        if (frameIdRed.current !== null) {
          cancelAnimationFrame(frameIdRed.current);
        }
      }

      if (tileOffset <= -spacing) tileOffset += spacing;

      ctx.fillStyle = 'rgba(0, 208, 33, 1)';
      for (let x = tileOffset; x < canvasRef.current.width + spacing; x += spacing) {
        ctx.fillRect(x, groundY, tileW, tileH);
      }

      frameIdRed.current = requestAnimationFrame(animate);
    }

    animate();
  }, [start, showButton]);

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <canvas
        onClick={(e) => handler(e)}
        ref={canvasRef}
        width={500}
        height={700}
        className="bg-black"
      />
      {showButton && (
        <div className="absolute top-100 mx-auto inline-flex gap-4">
          <button
            onClick={() => {
              setStart(true);
              setShowButton(false);
            }}
            className={buttonClasses}
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
            className={buttonClasses}
          >
            Stop Game
          </button>
        </div>
      )}
      {gameOver && (
        <div className="absolute top-100 mx-auto flex flex-col items-center justify-center gap-4">
          <div className="rounded-2xl bg-orange-600 px-8 py-4 text-center text-4xl font-bold text-white ring-2 ring-white">
            Game Over
          </div>
          <button
            onClick={() => {
              setGameOver(false);
              setShowButton(true);
              setStart(false);
              birdImgYRef.current = 200;
              birdVelocityRef.current = 0;
            }}
            className={buttonClasses}
          >
            Re-Start
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
