// TODO: Need real types for any types

import { useEffect, useRef } from "react";

export const WavyBackground = ({
  children,
  className = "",
  containerClassName = "",
  colors = ["#2563eb", "#7c3aed", "#06b6d4"],
  waveWidth = 50,
  backgroundFill = "black",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  [key: string]: any;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    contextRef.current = context;
    let animationFrameId: number;
    let phase = 0;

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.scale(dpr, dpr);
    };

    const renderFrame = () => {
      if (!contextRef.current) return;
      const ctx = contextRef.current;
      const { width, height } = ctx.canvas;

      ctx.fillStyle = backgroundFill;
      ctx.fillRect(0, 0, width, height);

      colors.forEach((color, i) => {
        const w = width + waveWidth;
        const h = height * 0.5;
        const scale = 1;

        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x < w; x += 1) {
          const dx = x * scale;
          const dy = Math.sin(x * 0.01 + phase + i * 2) * waveWidth;
          ctx.lineTo(dx, h + dy);
        }

        ctx.lineTo(w, height);
        ctx.closePath();

        ctx.fillStyle = `${color}${Math.floor(waveOpacity * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.fill();
      });

      phase += speed === "fast" ? 0.03 : 0.01;
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    resizeCanvas();
    renderFrame();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colors, waveWidth, backgroundFill, speed, waveOpacity]);

  return (
    <div className={`relative flex flex-col ${containerClassName}`} {...props}>
      <canvas
        className={`absolute inset-0 z-0 h-full w-full ${className}`}
        ref={canvasRef}
        style={{
          filter: `blur(${blur}px)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
