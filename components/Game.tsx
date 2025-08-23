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
  const [score, setScore] = useState(0);

  const buttonClasses =
    'cursor-pointer w-fit rounded-xl bg-orange-600 px-4 py-2 text-center text-xl font-bold text-white ring-2 ring-white transition-colors hover:bg-orange-500 active:bg-orange-400';

  const handler = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (showButton) return;
    birdVelocityRef.current = -5;
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

    const pipes: Array<{ x: number; gapY: number; passed: boolean }> = [];
    const pipeWidth = 80;
    const pipeGap = 150;
    const pipeSpeed = 3;
    let pipeSpawnTimer = 0;
    const pipeSpawnInterval = 120;

    async function animate() {
      if (!ctx || !canvasRef.current) return;

      tileOffset -= speed;
      birdAngle += 0.1;
      const birdOffset = Math.sin(birdAngle) * 10;

      if (!showButton) {
        pipeSpawnTimer++;
        if (pipeSpawnTimer >= pipeSpawnInterval) {
          const gapY = Math.random() * (canvasRef.current.height - pipeGap - 200) + 100;
          pipes.push({ x: canvasRef.current.width, gapY, passed: false });
          pipeSpawnTimer = 0;
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
          pipes[i].x -= pipeSpeed;

          if (pipes[i].x + pipeWidth < 0) {
            pipes.pop();
            continue;
          }

          if (!pipes[i].passed && pipes[i].x + pipeWidth < 200) {
            pipes[i].passed = true;
            setScore((prev) => prev + 1);
          }

          const birdX = 200;
          const birdY = birdImgYRef.current;
          const birdSize = 80;

          if (
            birdX < pipes[i].x + pipeWidth &&
            birdX + birdSize > pipes[i].x &&
            (birdY < pipes[i].gapY || birdY + birdSize > pipes[i].gapY + pipeGap)
          ) {
            setGameOver(true);
            if (frameIdRed.current !== null) {
              cancelAnimationFrame(frameIdRed.current);
            }
            return;
          }
        }

        birdVelocityRef.current += 0.5;
        birdImgYRef.current += birdVelocityRef.current;
      }

      ctx.drawImage(backgroundImg, 0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw pipes
      ctx.fillStyle = 'green';
      pipes.forEach((pipe) => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.gapY);
        // Bottom pipe
        ctx.fillRect(
          pipe.x,
          pipe.gapY + pipeGap,
          pipeWidth,
          canvasRef.current!.height - (pipe.gapY + pipeGap)
        );
      });

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
          <div className="rounded-2xl bg-orange-600 px-8 py-4 text-center text-2xl font-bold text-white ring-2 ring-white">
            Score: {score}
          </div>
          <button
            onClick={() => {
              setGameOver(false);
              setShowButton(true);
              setStart(false);
              setScore(0);
              birdImgYRef.current = 200;
              birdVelocityRef.current = 0;
            }}
            className={buttonClasses}
          >
            Re-Start
          </button>
        </div>
      )}
      {!showButton && !gameOver && (
        <div className="absolute top-4 left-4 rounded-2xl bg-orange-600 px-4 py-2 text-center text-2xl font-bold text-white ring-2 ring-white">
          Score: {score}
        </div>
      )}
    </div>
  );
};

export default Game;
