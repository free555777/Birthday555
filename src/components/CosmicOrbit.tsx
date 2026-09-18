import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Heart, Sparkles, X, Orbit as OrbitIcon } from 'lucide-react';
import { SiteConfig } from '../types';

interface CosmicOrbitProps {
  config: SiteConfig;
}

export const CosmicOrbit: React.FC<CosmicOrbitProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedSphere, setSelectedSphere] = useState<'YOU' | 'ME' | null>(null);

  const traits = {
    YOU: [
      { title: 'Your Warmth', desc: 'How you make anywhere feel instantly like home.' },
      { title: 'Your Chaos', desc: 'The spontaneous giggles and funny faces you make when thinking.' },
      { title: 'Your Kindness', desc: 'Always seeing the purest light in every person and animal.' },
      { title: 'Your Brilliance', desc: 'The way your mind solves things and inspires everyone around you.' },
    ],
    ME: [
      { title: 'Your Anchor', desc: 'Always here to hold you steady, no matter what winds blow.' },
      { title: 'Your Biggest Fan', desc: 'Cheering for your dreams louder than the entire universe.' },
      { title: 'Forever Yours', desc: 'Gravitating around you, today, tomorrow, and endlessly.' },
      { title: 'Your Comfort', desc: 'Ready with warm tea, warm hugs, and silent listening.' },
    ],
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 8, 22);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    const isMobile = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.3));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Orbit Controls for smooth mouse/touch dragging
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // keep layout stable
    controls.maxPolarAngle = Math.PI / 2 + 0.3;
    controls.minPolarAngle = Math.PI / 4;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const centerLight = new THREE.PointLight(0xff7eb6, 3, 40);
    centerLight.position.set(0, 0, 0);
    scene.add(centerLight);

    const secondLight = new THREE.PointLight(0xa78bfa, 2, 40);
    secondLight.position.set(0, 4, 0);
    scene.add(secondLight);

    // Central Glowing Heart
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.5, y + 0.5);
    heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    heartShape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    heartShape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
    heartShape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

    const extrudeSettings = {
      depth: 0.4,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    };
    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeometry.center();

    const heartMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4d94,
      emissive: 0xff1a75,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
    });
    const heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
    heartMesh.rotation.z = Math.PI;
    heartMesh.scale.set(1.5, 1.5, 1.5);
    scene.add(heartMesh);

    // Orbital Rings
    const createOrbitRing = (radius: number, color: number) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.04, radius + 0.04, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      return ring;
    };

    const ringYou = createOrbitRing(8, 0xff7eb6);
    const ringMe = createOrbitRing(12, 0xa78bfa);
    scene.add(ringYou);
    scene.add(ringMe);

    // Orbiting Spheres: YOU (Pink) & ME (Lavender)
    const sphereGeo = new THREE.SphereGeometry(1.2, 32, 32);

    const youMat = new THREE.MeshStandardMaterial({
      color: 0xff7eb6,
      emissive: 0xff4081,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.3,
    });
    const youSphere = new THREE.Mesh(sphereGeo, youMat);
    youSphere.name = 'YOU';
    scene.add(youSphere);

    const meMat = new THREE.MeshStandardMaterial({
      color: 0xa78bfa,
      emissive: 0x7c3aed,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.3,
    });
    const meSphere = new THREE.Mesh(sphereGeo, meMat);
    meSphere.name = 'ME';
    scene.add(meSphere);

    // Background Stars in Nebula
    const starCount = isMobile ? 500 : 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const cPink = new THREE.Color('#FF7EB6');
    const cWhite = new THREE.Color('#FFF7FB');
    const cLav = new THREE.Color('#A78BFA');

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      starPos[i3] = (Math.random() - 0.5) * 70;
      starPos[i3 + 1] = (Math.random() - 0.5) * 50;
      starPos[i3 + 2] = (Math.random() - 0.5) * 70;

      const pick = Math.random();
      const col = pick < 0.4 ? cPink : pick < 0.7 ? cLav : cWhite;
      starColors[i3] = col.r;
      starColors[i3 + 1] = col.g;
      starColors[i3 + 2] = col.b;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // Raycaster for clicking spheres
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([youSphere, meSphere]);

      if (intersects.length > 0) {
        const clickedName = intersects[0].object.name as 'YOU' | 'ME';
        setSelectedSphere(clickedName);
      }
    };
    canvas.addEventListener('click', handleCanvasClick);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Pulse heart
      const heartScale = 1.4 + Math.sin(elapsed * 2.5) * 0.12;
      heartMesh.scale.set(heartScale, heartScale, heartScale);
      heartMesh.rotation.y = elapsed * 0.4;

      // Orbit YOU sphere
      const speedYou = elapsed * 0.55;
      youSphere.position.x = Math.cos(speedYou) * 8;
      youSphere.position.z = Math.sin(speedYou) * 8;
      youSphere.position.y = Math.sin(speedYou * 2) * 1.2;

      // Orbit ME sphere
      const speedMe = elapsed * 0.38 + Math.PI;
      meSphere.position.x = Math.cos(speedMe) * 12;
      meSphere.position.z = Math.sin(speedMe) * 12;
      meSphere.position.y = Math.cos(speedMe * 2) * 1.5;

      starPoints.rotation.y = elapsed * 0.015;

      controls.update();
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

    if (containerRef.current) {
      observer.observe(containerRef.current);
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
      canvas.removeEventListener('click', handleCanvasClick);
      controls.dispose();
      heartGeometry.dispose();
      heartMaterial.dispose();
      sphereGeo.dispose();
      youMat.dispose();
      meMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="cosmic-orbit-section"
      className="relative min-h-[90vh] w-full flex flex-col items-center justify-center bg-[#08090D] overflow-hidden px-6 py-20 select-none"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute h-[550px] w-[550px] rounded-full bg-[#FF7EB6]/10 blur-[140px]" />
      <div className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-[#A78BFA]/10 blur-[140px] translate-x-32" />

      {/* Section Header */}
      <div className="relative z-10 max-w-3xl mx-auto text-center mb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-widest text-[#FF7EB6] uppercase mb-3">
          <OrbitIcon className="w-3.5 h-3.5" />
          <span>Gravitational Pull</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#FFF7FB] tracking-tight mb-3">
          Cosmic Connection
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#FFF7FB]/65 max-w-md mx-auto font-light">
          Two celestial souls orbiting around one glowing heart. Drag to rotate our universe, or click a sphere below to inspect.
        </p>

        {/* Sphere Selector Buttons */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setSelectedSphere('YOU')}
            data-cursor="pointer"
            className={`px-5 py-2 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
              selectedSphere === 'YOU'
                ? 'bg-[#FF7EB6] text-[#08090D] shadow-[0_0_20px_#FF7EB6]'
                : 'glass-pill text-[#FFB6D9] hover:bg-[#FF7EB6]/20'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-[#FF7EB6] inline-block shadow-[0_0_6px_#FF7EB6]" />
            <span>YOU ({config.partnerName})</span>
          </button>

          <button
            onClick={() => setSelectedSphere('ME')}
            data-cursor="pointer"
            className={`px-5 py-2 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
              selectedSphere === 'ME'
                ? 'bg-[#A78BFA] text-[#08090D] shadow-[0_0_20px_#A78BFA]'
                : 'glass-pill text-[#C4B5FD] hover:bg-[#A78BFA]/20'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-[#A78BFA] inline-block shadow-[0_0_6px_#A78BFA]" />
            <span>ME</span>
          </button>
        </div>
      </div>

      {/* 3D Three.js Canvas Container */}
      <div className="relative w-full max-w-5xl h-[420px] sm:h-[500px] md:h-[560px] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Orbit Hint */}
        <div className="pointer-events-none absolute bottom-4 left-6 flex items-center space-x-2 text-[11px] font-mono text-white/40">
          <Sparkles className="w-3.5 h-3.5 text-[#FF7EB6]" />
          <span>Drag to rotate • Touch enabled</span>
        </div>

        {/* Trait Card Popover when Sphere is clicked */}
        {selectedSphere && (
          <div className="absolute top-6 right-6 max-w-xs sm:max-w-sm w-full p-5 rounded-2xl glass-card border border-white/20 shadow-2xl z-20 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center space-x-2">
                <Heart
                  className={`w-4 h-4 ${
                    selectedSphere === 'YOU' ? 'text-[#FF7EB6] fill-[#FF7EB6]' : 'text-[#A78BFA] fill-[#A78BFA]'
                  }`}
                />
                <h4 className="font-serif text-lg text-[#FFF7FB] font-medium">
                  {selectedSphere === 'YOU' ? `${config.partnerName}'s Essence` : 'My Heart Towards You'}
                </h4>
              </div>
              <button
                onClick={() => setSelectedSphere(null)}
                data-cursor="pointer"
                className="p-1 rounded-full text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {traits[selectedSphere].map((trait, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="block text-xs font-mono tracking-wide text-[#FFB6D9] mb-0.5">
                    {trait.title}
                  </span>
                  <p className="text-xs text-[#FFF7FB]/80 font-light leading-relaxed">
                    {trait.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
