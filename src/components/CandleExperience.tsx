import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { Sparkles, Mic, Wind, Heart, RotateCcw } from 'lucide-react';
import { SiteConfig } from '../types';
import { romanticAudio } from '../utils/audio';
import { Fireworks } from './Fireworks';

interface CandleExperienceProps {
  config: SiteConfig;
}

export const CandleExperience: React.FC<CandleExperienceProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isBlown, setIsBlown] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  // References for Three.js objects
  const flameMeshRef = useRef<THREE.Mesh | null>(null);
  const flameLightRef = useRef<THREE.PointLight | null>(null);
  const smokeParticlesRef = useRef<THREE.Points | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Trigger blowing the candle
  const blowCandle = () => {
    if (isBlown) return;
    setIsBlown(true);

    // Stop mic listening if active
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    setIsListeningMic(false);

    // Play magical chime & romantic sound
    romanticAudio.playWishChime();

    // Trigger full romantic confetti bursts
    const end = Date.now() + 3000;
    const colors = ['#FF7EB6', '#FFB6D9', '#A78BFA', '#FDE047', '#FFF7FB'];

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Center burst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors,
      });
    }, 400);
  };

  const relightCandle = () => {
    setIsBlown(false);
  };

  // Microphone audio detection for blowing
  const startMicDetection = async () => {
    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListeningMic(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let blowStreak = 0;

      const checkAudio = () => {
        if (!micStreamRef.current) return;
        analyser.getByteFrequencyData(dataArray);

        // Compute average intensity
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setMicVolume(normalized);

        // Puff / blow of air creates sudden high energy
        if (normalized > 42) {
          blowStreak++;
          if (blowStreak >= 3) {
            blowCandle();
            return;
          }
        } else {
          blowStreak = Math.max(0, blowStreak - 1);
        }

        requestAnimationFrame(checkAudio);
      };

      checkAudio();
    } catch (err) {
      console.warn('Microphone permission denied or unavailable:', err);
      setMicError('Microphone not available. Please tap "Blow the Candle" button below.');
      setIsListeningMic(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Three.js Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 5.5, 12);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.4));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7fb, 1.2);
    dirLight.position.set(5, 12, 8);
    scene.add(dirLight);

    // Candle flame light
    const flameLight = new THREE.PointLight(0xff9900, 3.5, 15);
    flameLight.position.set(0, 3.8, 0);
    scene.add(flameLight);
    flameLightRef.current = flameLight;

    // --- 3D CAKE MODEL ---
    const cakeGroup = new THREE.Group();

    // 1. Ceramic Cake Stand
    const standGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.4, 48);
    const standMat = new THREE.MeshStandardMaterial({
      color: 0x1a1c24,
      metalness: 0.6,
      roughness: 0.2,
    });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.y = -0.2;
    cakeGroup.add(stand);

    // Golden rim on stand
    const rimGeo = new THREE.TorusGeometry(4.35, 0.08, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = -0.05;
    cakeGroup.add(rim);

    // 2. Bottom Tier Cake (Blush Pink / Velvet)
    const botTierGeo = new THREE.CylinderGeometry(3.2, 3.2, 1.6, 48);
    const botTierMat = new THREE.MeshStandardMaterial({
      color: 0xff7eb6,
      roughness: 0.4,
      metalness: 0.1,
    });
    const botTier = new THREE.Mesh(botTierGeo, botTierMat);
    botTier.position.y = 0.8;
    cakeGroup.add(botTier);

    // Frosting pearls around bottom
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const pearlGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const pearlMat = new THREE.MeshStandardMaterial({ color: 0xfff7fb, roughness: 0.2 });
      const pearl = new THREE.Mesh(pearlGeo, pearlMat);
      pearl.position.set(Math.cos(angle) * 3.25, 0.1, Math.sin(angle) * 3.25);
      cakeGroup.add(pearl);
    }

    // 3. Top Tier Cake (Ivory Cream)
    const topTierGeo = new THREE.CylinderGeometry(2.1, 2.1, 1.3, 48);
    const topTierMat = new THREE.MeshStandardMaterial({
      color: 0xfff0f5,
      roughness: 0.35,
      metalness: 0.05,
    });
    const topTier = new THREE.Mesh(topTierGeo, topTierMat);
    topTier.position.y = 2.25;
    cakeGroup.add(topTier);

    // Top tier decorative frosting swirls
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const pearlGeo = new THREE.SphereGeometry(0.15, 16, 16);
      const pearlMat = new THREE.MeshStandardMaterial({ color: 0xff7eb6, roughness: 0.3 });
      const pearl = new THREE.Mesh(pearlGeo, pearlMat);
      pearl.position.set(Math.cos(angle) * 2.12, 1.62, Math.sin(angle) * 2.12);
      cakeGroup.add(pearl);
    }

    // Small decorative strawberries/roses on top tier
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const roseGeo = new THREE.ConeGeometry(0.2, 0.3, 16);
      const roseMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.4 });
      const rose = new THREE.Mesh(roseGeo, roseMat);
      rose.position.set(Math.cos(angle) * 1.5, 3.0, Math.sin(angle) * 1.5);
      cakeGroup.add(rose);
    }

    // 4. Elegant Birthday Candle
    const candleGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 24);
    const candleMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.8,
      roughness: 0.2,
    });
    const candle = new THREE.Mesh(candleGeo, candleMat);
    candle.position.y = 3.5;
    cakeGroup.add(candle);

    // Candle Wick
    const wickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8);
    const wickMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const wick = new THREE.Mesh(wickGeo, wickMat);
    wick.position.y = 4.2;
    cakeGroup.add(wick);

    // 5. Teardrop Candle Flame
    const flameGeo = new THREE.ConeGeometry(0.18, 0.45, 16);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.95,
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.y = 4.45;
    cakeGroup.add(flameMesh);
    flameMeshRef.current = flameMesh;

    // Inner bright flame core
    const flameCoreGeo = new THREE.ConeGeometry(0.09, 0.25, 16);
    const flameCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const flameCore = new THREE.Mesh(flameCoreGeo, flameCoreMat);
    flameCore.position.y = -0.05;
    flameMesh.add(flameCore);

    // 6. Smoke Particle System (Activated on blow)
    const smokeCount = 45;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(smokeCount * 3);
    for (let i = 0; i < smokeCount; i++) {
      smokePositions[i * 3] = (Math.random() - 0.5) * 0.2;
      smokePositions[i * 3 + 1] = 4.3 + Math.random() * 0.8;
      smokePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
    const smokeMat = new THREE.PointsMaterial({
      size: 0.2,
      color: 0xcccccc,
      transparent: true,
      opacity: 0,
    });
    const smokeParticles = new THREE.Points(smokeGeo, smokeMat);
    cakeGroup.add(smokeParticles);
    smokeParticlesRef.current = smokeParticles;

    scene.add(cakeGroup);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Gentle cake rotation
      cakeGroup.rotation.y = elapsed * 0.2;

      // Flame flicker if active
      if (flameMeshRef.current && flameLightRef.current) {
        if (!isBlown) {
          flameMeshRef.current.visible = true;
          flameLightRef.current.intensity = 3.5 + Math.sin(elapsed * 25) * 0.8;
          flameMeshRef.current.scale.set(
            1 + Math.sin(elapsed * 20) * 0.15,
            1 + Math.cos(elapsed * 18) * 0.2,
            1 + Math.sin(elapsed * 22) * 0.15
          );
          if (smokeMat) smokeMat.opacity = 0;
        } else {
          flameMeshRef.current.visible = false;
          flameLightRef.current.intensity = 0.2;
          // Smoke rises
          if (smokeMat) {
            smokeMat.opacity = Math.max(0, 0.8 - (elapsed % 4) * 0.2);
          }
          const pos = smokeGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < smokeCount; i++) {
            pos[i * 3 + 1] += 0.015;
            pos[i * 3] += Math.sin(elapsed * 3 + i) * 0.005;
            if (pos[i * 3 + 1] > 6.5) {
              pos[i * 3 + 1] = 4.3;
            }
          }
          smokeGeo.attributes.position.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animId);
      }
    }, { threshold: 0.05 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    animate();

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
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      renderer.dispose();
    };
  }, [isBlown]);

  return (
    <section
      ref={sectionRef}
      id="candle-section"
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#08090D] overflow-hidden px-6 py-24 select-none transition-colors duration-1000"
      style={{
        backgroundColor: isBlown ? '#0f111a' : '#08090D',
      }}
    >
      {/* Fireworks Canvas overlay */}
      <Fireworks active={isBlown} />

      {/* Background glow intensified after blowing */}
      <div
        className={`pointer-events-none absolute h-[600px] w-[600px] rounded-full transition-all duration-1000 ${
          isBlown
            ? 'bg-[#FF7EB6]/25 blur-[140px] scale-125'
            : 'bg-[#FF7EB6]/10 blur-[140px] scale-100'
        }`}
      />

      {/* Header */}
      <div className="relative z-10 max-w-2xl mx-auto text-center mb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-widest text-[#FF7EB6] uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Birthday Moment</span>
          <Heart className="w-3.5 h-3.5 fill-[#FF7EB6]" />
        </div>

        <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-[#FFF7FB] tracking-tight mb-3">
          {isBlown ? 'Wish Made. ✨' : 'Make A Wish.'}
        </h2>

        <p className="font-sans text-sm sm:text-base text-[#FFF7FB]/70 max-w-md mx-auto font-light leading-relaxed">
          {isBlown
            ? `Happy Birthday, ${config.partnerName}! Here's to countless more memories, adventures, and endless joy together.`
            : `Close your eyes, hold a secret wish in your heart, and blow out the birthday candle.`}
        </p>
      </div>

      {/* 3D Birthday Cake Stage */}
      <div className="relative w-full max-w-3xl h-[380px] sm:h-[460px] md:h-[500px] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl flex items-center justify-center mb-8">
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Ambient status indicator */}
        <div className="absolute top-4 left-6 flex items-center space-x-2 text-xs font-mono text-white/50">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isBlown ? 'bg-gray-400' : 'bg-[#FDE047] animate-ping'
            }`}
          />
          <span>{isBlown ? 'Candle Extinguished' : 'Candle Burning Warmly'}</span>
        </div>

        {/* Mic Volume Level Bar if listening */}
        {isListeningMic && !isBlown && (
          <div className="absolute top-4 right-6 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
            <Mic className="w-3.5 h-3.5 text-[#FF7EB6] animate-pulse" />
            <span className="text-[11px] font-mono text-[#FFF7FB]">Blow into mic:</span>
            <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF7EB6] transition-all duration-75"
                style={{ width: `${micVolume}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls */}
      <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md w-full">
        {!isBlown ? (
          <>
            {/* Primary Fallback Button */}
            <button
              onClick={blowCandle}
              data-cursor="pointer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF7EB6] text-[#08090D] font-medium text-sm sm:text-base tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:bg-[#FFB6D9] hover:shadow-[0_0_35px_rgba(255,126,182,0.6)] cursor-pointer flex items-center justify-center space-x-2"
            >
              <Wind className="w-4 h-4" />
              <span>Blow the Candle 💨</span>
            </button>

            {/* Optional Microphone Detection */}
            {!isListeningMic ? (
              <button
                onClick={startMicDetection}
                data-cursor="pointer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full glass-pill text-[#FFF7FB]/80 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-light tracking-wide transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Mic className="w-4 h-4 text-[#A78BFA]" />
                <span>Use Microphone 🎙️</span>
              </button>
            ) : (
              <div className="text-xs font-mono text-[#FFB6D9] animate-pulse">
                Listening for your breath...
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={relightCandle}
              data-cursor="pointer"
              className="px-6 py-3 rounded-full glass-pill text-[#FFF7FB] text-xs sm:text-sm hover:bg-white/10 transition-all cursor-pointer flex items-center space-x-2"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#FF7EB6]" />
              <span>Light Candle Again 🔥</span>
            </button>

            <button
              onClick={() => {
                const secretSec = document.getElementById('secret-letter-section');
                secretSec?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-cursor="pointer"
              className="px-7 py-3 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#FF7EB6] text-[#08090D] font-medium text-xs sm:text-sm tracking-wide transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(167,139,250,0.5)] cursor-pointer"
            >
              Read Secret Letter 💌
            </button>
          </div>
        )}
      </div>

      {micError && (
        <p className="mt-4 text-xs text-rose-300/80 font-mono text-center max-w-sm">
          {micError}
        </p>
      )}
    </section>
  );
};
