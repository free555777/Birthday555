import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Sparkles, ChevronDown, Heart } from 'lucide-react';
import { SiteConfig } from '../types';

interface HeroProps {
  config: SiteConfig;
  onEnterStory: () => void;
}

export const Hero: React.FC<HeroProps> = ({ config, onEnterStory }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Particle Stars
    const particleCount = isMobile ? 650 : 1600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const pinkColor = new THREE.Color('#FF7EB6');
    const lavenderColor = new THREE.Color('#A78BFA');
    const whiteColor = new THREE.Color('#FFF7FB');

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 80;
      positions[i3 + 2] = (Math.random() - 0.5) * 60;

      // Color variation: 60% warm white, 25% soft pink, 15% lavender
      const choice = Math.random();
      let c = whiteColor;
      if (choice < 0.25) c = pinkColor;
      else if (choice < 0.4) c = lavenderColor;

      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;

      scales[i] = Math.random() * 2.5 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom shader material or soft particle texture
    const canvasPoint = document.createElement('canvas');
    canvasPoint.width = 32;
    canvasPoint.height = 32;
    const ctxPoint = canvasPoint.getContext('2d');
    if (ctxPoint) {
      const grad = ctxPoint.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(255,200,230,0.8)');
      grad.addColorStop(0.8, 'rgba(255,126,182,0.2)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctxPoint.fillStyle = grad;
      ctxPoint.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvasPoint);

    const material = new THREE.PointsMaterial({
      size: 0.6,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Subtle Heart Constellation in 3D
    const heartPoints: THREE.Vector3[] = [];
    const heartPointsCount = 80;
    for (let i = 0; i < heartPointsCount; i++) {
      const t = (i / heartPointsCount) * Math.PI * 2;
      // Parametric heart formula
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      heartPoints.push(new THREE.Vector3(x * 0.28, y * 0.28 + 1, -5));
    }
    const heartGeo = new THREE.BufferGeometry().setFromPoints(heartPoints);
    const heartMat = new THREE.PointsMaterial({
      size: 0.8,
      map: texture,
      color: new THREE.Color('#FF7EB6'),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const heartParticles = new THREE.Points(heartGeo, heartMat);
    scene.add(heartParticles);

    // Mouse movement tracking
    let targetX = 0;
    let targetY = 0;
    const handlePointerMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handlePointerMove);

    // Resize handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with Visibility Caching
    let animId: number = 0;
    let clock = new THREE.Clock();
    let isVisible = true;

    const animate = () => {
      if (!isVisible) return;
      const elapsedTime = clock.getElapsedTime();

      // Rotate particle cloud gently
      particles.rotation.y = elapsedTime * 0.02;
      particles.rotation.x = Math.sin(elapsedTime * 0.015) * 0.05;

      // Pulse heart constellation
      const scaleVal = 1 + Math.sin(elapsedTime * 1.5) * 0.05;
      heartParticles.scale.set(scaleVal, scaleVal, scaleVal);
      heartParticles.rotation.z = Math.sin(elapsedTime * 0.5) * 0.03;

      // Smooth camera parallax
      camera.position.x += (targetX * 2 - camera.position.x) * 0.03;
      camera.position.y += (-targetY * 1.5 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animId);
      }
    }, { threshold: 0.05 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    animate();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      heartGeo.dispose();
      heartMat.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero-section"
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#08090D] px-6 text-center select-none"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />

      {/* Atmospheric lighting gradients */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-[#08090D]/50 to-[#08090D] z-10" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#FF7EB6]/10 blur-[130px] z-10" />

      {/* Center Content */}
      <div className="relative z-20 flex flex-col items-center max-w-4xl mx-auto pt-16 pb-12">
        {/* Romantic Birthday Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-pill mb-6 text-xs sm:text-sm font-medium tracking-wide text-[#FFB6D9] animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-[#FF7EB6]" />
          <span>Happy Birthday to My Favorite Person</span>
          <Heart className="w-3.5 h-3.5 text-[#FF7EB6] fill-[#FF7EB6]" />
        </div>

        {/* Oversized Cinematic Typography */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight text-[#FFF7FB] leading-[0.95] mb-6 drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
          OUR
          <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-[#FFF7FB] via-[#FFB6D9] to-[#FF7EB6]">
            STORY
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-base sm:text-lg md:text-xl text-[#FFF7FB]/75 max-w-xl font-light tracking-wide mb-10 leading-relaxed">
          {config.heroSubtitle}
        </p>

        {/* Call To Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <button
            onClick={onEnterStory}
            data-cursor="pointer"
            className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#FF7EB6] text-[#08090D] font-medium text-sm sm:text-base tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:bg-[#FFB6D9] hover:shadow-[0_0_35px_rgba(255,126,182,0.6)] cursor-pointer"
          >
            <span>Enter Our Story →</span>
          </button>

          <button
            onClick={() => {
              const candleSection = document.getElementById('candle-section');
              candleSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            data-cursor="pointer"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-full glass-pill text-[#FFF7FB]/90 text-sm font-light tracking-wide hover:bg-white/10 transition-all duration-200 cursor-pointer"
          >
            <span>Make A Birthday Wish 🎂</span>
          </button>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div
        onClick={onEnterStory}
        data-cursor="pointer"
        className="absolute bottom-8 z-20 flex flex-col items-center space-y-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
      >
        <span className="text-[11px] font-mono tracking-widest text-[#FFF7FB]/60 uppercase">
          Scroll to explore
        </span>
        <ChevronDown className="w-4 h-4 text-[#FF7EB6] animate-bounce" />
      </div>
    </section>
  );
};
