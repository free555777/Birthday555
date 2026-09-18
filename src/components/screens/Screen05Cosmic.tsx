import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import * as THREE from 'three';
import { Heart, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { SiteConfig } from '../../types';

interface Screen05CosmicProps {
  config: SiteConfig;
  onNext: () => void;
  onPrev: () => void;
}

export const Screen05Cosmic: React.FC<Screen05CosmicProps> = ({ config, onNext, onPrev }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;
    let isCleanedUp = false;

    try {
      // Setup Three.js scene with soft pink romantic cosmic atmosphere
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#FFF0F2');
      scene.fog = new THREE.FogExp2('#FFF0F2', 0.035);

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.set(0, 1.2, 5.5);

      const isMobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5);

      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(dpr);
      container.appendChild(renderer.domElement);

      // Ambient & Directional Lights
      const ambientLight = new THREE.AmbientLight('#FFE3E8', 1.8);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight('#FFFFFF', 2.0);
      dirLight.position.set(5, 8, 5);
      scene.add(dirLight);

      const pinkPointLight = new THREE.PointLight('#F45B82', 3.5, 10);
      pinkPointLight.position.set(0, 0, 0);
      scene.add(pinkPointLight);

      // Central Heart Geometry
      const heartShape = new THREE.Shape();
      const x = 0, y = 0;
      heartShape.moveTo(x + 0.25, y + 0.25);
      heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
      heartShape.bezierCurveTo(x - 0.35, y, x - 0.35, y + 0.35, x - 0.35, y + 0.35);
      heartShape.bezierCurveTo(x - 0.35, y + 0.55, x - 0.15, y + 0.77, x + 0.25, y + 0.95);
      heartShape.bezierCurveTo(x + 0.65, y + 0.77, x + 0.85, y + 0.55, x + 0.85, y + 0.35);
      heartShape.bezierCurveTo(x + 0.85, y + 0.35, x + 0.85, y, x + 0.5, y);
      heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

      const extrudeSettings = {
        depth: 0.18,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.06,
        bevelThickness: 0.06,
      };

      const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
      heartGeometry.center();

      const heartMaterial = new THREE.MeshStandardMaterial({
        color: '#E83D6F',
        emissive: '#F45B82',
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.1,
      });

      const heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
      heartMesh.scale.set(1.1, 1.1, 1.1);
      scene.add(heartMesh);

      // Soft Floating Stardust / Romantic Rose Particles
      const starCount = isMobile ? 250 : 600;
      const starGeo = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starCount * 3);
      const starColors = new Float32Array(starCount * 3);

      const colorPalette = [
        new THREE.Color('#F45B82'),
        new THREE.Color('#E83D6F'),
        new THREE.Color('#D9A441'),
        new THREE.Color('#FFD5DD'),
      ];

      for (let i = 0; i < starCount; i++) {
        const radius = 1.8 + Math.random() * 5.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;

        starPositions[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
        starPositions[i * 3 + 1] = radius * Math.sin(phi);
        starPositions[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);

        const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        starColors[i * 3] = col.r;
        starColors[i * 3 + 1] = col.g;
        starColors[i * 3 + 2] = col.b;
      }

      starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

      const starMat = new THREE.PointsMaterial({
        size: isMobile ? 0.05 : 0.07,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
      });

      const starField = new THREE.Points(starGeo, starMat);
      scene.add(starField);

      // Two Orbiting Spheres: "YOU" and "ME"
      const sphereGeo = new THREE.SphereGeometry(0.24, 24, 24);

      // YOU sphere (Soft Rose Quartz)
      const youMat = new THREE.MeshStandardMaterial({
        color: '#F45B82',
        emissive: '#FF7EB6',
        emissiveIntensity: 0.6,
        roughness: 0.1,
      });
      const youSphere = new THREE.Mesh(sphereGeo, youMat);
      scene.add(youSphere);

      // ME sphere (Deep Romantic Rose)
      const meMat = new THREE.MeshStandardMaterial({
        color: '#C93B61',
        emissive: '#E83D6F',
        emissiveIntensity: 0.5,
        roughness: 0.1,
      });
      const meSphere = new THREE.Mesh(sphereGeo, meMat);
      scene.add(meSphere);

      // Orbit Paths (Delicate Ring)
      const orbitRingGeo = new THREE.RingGeometry(1.85, 1.87, 64);
      const orbitRingMat = new THREE.MeshBasicMaterial({
        color: '#FFD5DD',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
      orbitRing.rotation.x = Math.PI / 2.3;
      scene.add(orbitRing);

      // Interactive mouse & touch control
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;

      const handlePointerMove = (e: MouseEvent | TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const normX = (clientX / window.innerWidth) * 2 - 1;
        const normY = -(clientY / window.innerHeight) * 2 + 1;
        targetRotY = normX * 0.45;
        targetRotX = normY * 0.3;
      };

      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('touchmove', handlePointerMove, { passive: true });

      // Resize handler
      const handleResize = () => {
        if (!container || !renderer) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };
      window.addEventListener('resize', handleResize);

      // Animation Loop
      let clock = new THREE.Clock();

      const animate = () => {
        if (isCleanedUp) return;
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Smooth camera response
        currentRotX += (targetRotX - currentRotX) * 0.05;
        currentRotY += (targetRotY - currentRotY) * 0.05;
        camera.position.x = Math.sin(currentRotY) * 5.5;
        camera.position.z = Math.cos(currentRotY) * 5.5;
        camera.position.y = 1.2 + currentRotX * 1.5;
        camera.lookAt(0, 0, 0);

        // Heart gentle floating pulse
        heartMesh.rotation.y = Math.sin(elapsedTime * 0.6) * 0.15;
        const heartScale = 1.05 + Math.sin(elapsedTime * 2.2) * 0.05;
        heartMesh.scale.set(heartScale, heartScale, heartScale);

        // Orbit calculation for "YOU" and "ME"
        const orbitSpeed = elapsedTime * 0.75;
        const orbitRadius = 1.86;

        // YOU sphere
        youSphere.position.x = Math.cos(orbitSpeed) * orbitRadius;
        youSphere.position.z = Math.sin(orbitSpeed) * orbitRadius * Math.cos(Math.PI / 6);
        youSphere.position.y = Math.sin(orbitSpeed) * 0.45;

        // ME sphere (180 degrees opposite)
        meSphere.position.x = Math.cos(orbitSpeed + Math.PI) * orbitRadius;
        meSphere.position.z = Math.sin(orbitSpeed + Math.PI) * orbitRadius * Math.cos(Math.PI / 6);
        meSphere.position.y = Math.sin(orbitSpeed + Math.PI) * 0.45;

        // Stardust slow drift
        starField.rotation.y = elapsedTime * 0.03;

        renderer?.render(scene, camera);
      };

      animate();

      return () => {
        isCleanedUp = true;
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);

        if (renderer) {
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
      };
    } catch (err) {
      console.warn('Three.js failed to initialize, using CSS fallback:', err);
      setHasWebGL(false);
    }
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-7 md:p-9 overflow-hidden select-none bg-[#FFF0F2]">
      {/* 3D WebGL Canvas Container */}
      {hasWebGL ? (
        <div ref={mountRef} className="absolute inset-0 z-0" />
      ) : (
        /* CSS Animated Fallback */
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="relative w-72 h-72 rounded-full border-2 border-dashed border-[#FFD5DD] animate-spin" style={{ animationDuration: '20s' }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#F45B82] shadow-lg flex items-center justify-center text-[10px] text-white font-bold">
              YOU
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#C93B61] shadow-lg flex items-center justify-center text-[10px] text-white font-bold">
              ME
            </div>
          </div>
          <Heart className="absolute w-16 h-16 text-[#E83D6F] fill-[#E83D6F] animate-pulse" />
        </div>
      )}

      {/* Screen Header */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-4xl mx-auto pt-1 pointer-events-auto">
        <button
          onClick={onPrev}
          className="btn-romantic-secondary px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1.5 cursor-pointer"
          data-cursor="pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#E83D6F] uppercase block">
            Celestial Constellation
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-[#6D3046] font-semibold">
            Our Cosmic Orbit
          </h2>
        </div>

        <div className="inline-flex items-center space-x-1 text-xs text-[#9B6577] font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#F45B82]" />
          <span>Interactive 3D</span>
        </div>
      </div>

      {/* Orbit Labels Overlay */}
      <div className="relative z-10 my-auto w-full max-w-xl mx-auto text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-block px-5 py-2.5 rounded-full pill-romantic border border-[#FFD5DD] shadow-sm backdrop-blur-md"
        >
          <p className="font-serif text-xs sm:text-sm text-[#6D3046]">
            Two souls orbiting the same glowing heart. Move or drag to explore.
          </p>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between pb-2 pointer-events-auto">
        <div className="flex items-center space-x-3 text-xs text-[#6D3046]">
          <span className="inline-flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F45B82]" />
            <span className="font-medium">YOU</span>
          </span>
          <span className="inline-flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C93B61]" />
            <span className="font-medium">ME</span>
          </span>
        </div>

        <button
          onClick={onNext}
          className="group btn-romantic-primary py-3 px-7 rounded-full text-sm sm:text-base font-medium flex items-center space-x-2.5 cursor-pointer shadow-md"
          data-cursor="pointer"
        >
          <span>Continue Our Story</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
