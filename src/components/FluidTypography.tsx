import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SiteConfig } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface FluidTypographyProps {
  config: SiteConfig;
}

export const FluidTypography: React.FC<FluidTypographyProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  const fullText = config.fluidTypographyText || 'You are my favorite chapter.';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Three.js Scene for Fluid Particle Field & Depth Waves
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / 600, 0.1, 100);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Dynamic wave particles
    const count = 400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const pink = new THREE.Color('#FF7EB6');
    const lavender = new THREE.Color('#A78BFA');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 35;
      positions[i3 + 1] = (Math.random() - 0.5) * 12;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      const mix = Math.random();
      const col = pink.clone().lerp(lavender, mix);
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Floating torus knot ribbon in background
    const torusGeo = new THREE.TorusKnotGeometry(3.5, 0.2, 80, 12, 2, 3);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xff7eb6,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

    let animId: number = 0;
    let clock = new THREE.Clock();
    let isVisible = true;

    const animate = () => {
      if (!isVisible) return;
      const elapsed = clock.getElapsedTime();
      points.rotation.y = elapsed * 0.04;
      torus.rotation.x = elapsed * 0.1;
      torus.rotation.y = elapsed * 0.15;
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

    // GSAP ScrollTrigger Integration
    const ctx = gsap.context(() => {
      if (lettersRef.current.length > 0) {
        gsap.fromTo(
          lettersRef.current,
          {
            opacity: 0,
            y: 50,
            rotateX: 60,
            scale: 0.8,
            filter: 'blur(10px)',
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            filter: 'blur(0px)',
            stagger: 0.04,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 75%',
              end: 'center 45%',
              scrub: 1,
            },
          }
        );
      }

      // Camera bend & depth reaction
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          camera.position.z = 15 - self.progress * 4;
          camera.position.y = (self.progress - 0.5) * 2;
          torusMat.opacity = 0.08 + self.progress * 0.15;
        },
      });
    }, containerRef);

    const handleResize = () => {
      if (!canvas) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      ctx.revert();
      geometry.dispose();
      material.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="fluid-typography-section"
      className="relative min-h-[75vh] w-full flex flex-col items-center justify-center overflow-hidden bg-[#08090D] px-6 py-20 select-none"
    >
      {/* Three.js Background WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        <span className="text-xs font-mono tracking-widest text-[#A78BFA] uppercase mb-4">
          Chapter II • Destiny
        </span>

        {/* 3D Fluid Typography */}
        <div
          ref={textWrapperRef}
          className="perspective-1000 flex flex-wrap justify-center items-center gap-x-3 gap-y-2 py-4"
        >
          {fullText.split(' ').map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block whitespace-nowrap">
              {word.split('').map((char, charIdx) => (
                <span
                  key={charIdx}
                  ref={(el) => {
                    if (el && !lettersRef.current.includes(el)) {
                      lettersRef.current.push(el);
                    }
                  }}
                  className={`inline-block font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight transition-colors duration-200 ${
                    word.toLowerCase().includes('favorite') || word.toLowerCase().includes('chapter')
                      ? 'text-transparent bg-clip-text bg-gradient-to-br from-[#FF7EB6] via-[#FFB6D9] to-[#FFF7FB] italic font-normal text-glow-pink'
                      : 'text-[#FFF7FB]/95 font-light'
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {char}
                </span>
              ))}
              <span className="inline-block w-2 md:w-3" />
            </span>
          ))}
        </div>

        <p className="mt-8 font-sans text-sm md:text-base text-[#FFF7FB]/60 max-w-md font-light tracking-wide">
          Written in gentle glances, endless laughter, and words that only we understand.
        </p>
      </div>
    </section>
  );
};
