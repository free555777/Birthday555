import React, { useEffect, useRef } from 'react';

interface FireworksProps {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

export const Fireworks: React.FC<FireworksProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: Particle[] = [];
    const colors = ['#FF7EB6', '#FFB6D9', '#A78BFA', '#FDE047', '#FFF7FB'];

    const createExplosion = (x: number, y: number) => {
      const count = 45;
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: Math.random() * 2.5 + 1.5,
          decay: Math.random() * 0.015 + 0.01,
        });
      }
    };

    // Trigger initial explosions
    createExplosion(window.innerWidth * 0.3, window.innerHeight * 0.35);
    createExplosion(window.innerWidth * 0.7, window.innerHeight * 0.3);
    createExplosion(window.innerWidth * 0.5, window.innerHeight * 0.25);

    let interval = setInterval(() => {
      if (!active) return;
      const rx = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
      const ry = Math.random() * window.innerHeight * 0.45 + window.innerHeight * 0.15;
      createExplosion(rx, ry);
    }, 900);

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // subtle gravity
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          particles.splice(idx, 1);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9900] h-full w-full"
    />
  );
};
