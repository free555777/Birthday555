import React, { useEffect, useState, useRef } from 'react';
import { CursorState } from '../types';

export const CustomCursor: React.FC = () => {
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(false);

  useEffect(() => {
    const checkTouch = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024;
      setIsTouchDevice(isTouch);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch, { passive: true });

    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const viewTarget = target.closest('[data-cursor="view"]');
      const playTarget = target.closest('[data-cursor="play"]');
      const buttonTarget = target.closest('button, a, input, [role="button"], [data-cursor="pointer"]');

      if (viewTarget) {
        setCursorState('view');
      } else if (playTarget) {
        setCursorState('play');
      } else if (buttonTarget) {
        setCursorState('pointer');
      } else {
        setCursorState('default');
      }
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };
    const handleMouseEnter = () => {
      visibleRef.current = true;
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handlePointerMoveWithThrottling);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    function handlePointerMoveWithThrottling(e: MouseEvent) {
      handleMouseMove(e);
    }

    let animationFrameId: number;
    const renderLoop = () => {
      const factor = 0.22;
      ring.current.x += (mouse.current.x - ring.current.x) * factor;
      ring.current.y += (mouse.current.y - ring.current.y) * factor;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', checkTouch);
      window.removeEventListener('mousemove', handlePointerMoveWithThrottling);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  const isView = cursorState === 'view';
  const isPlay = cursorState === 'play';
  const isPointer = cursorState === 'pointer';
  const hasLabel = isView || isPlay;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300">
      {/* Pink Glowing Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-1 -mt-1 h-2.5 w-2.5 rounded-full bg-[#F45B82] shadow-[0_0_10px_#F45B82] transition-transform duration-75 ${
          hasLabel ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
        }`}
      />

      {/* Soft Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full transition-all duration-300 ease-out ${
          hasLabel
            ? '-ml-7 -mt-7 h-14 w-14 bg-white/95 text-[10px] font-bold tracking-widest text-[#E83D6F] uppercase border border-[#FFD5DD] shadow-lg backdrop-blur-sm'
            : isPointer
            ? '-ml-5 -mt-5 h-10 w-10 border border-[#F45B82]/80 bg-[#F45B82]/10 shadow-[0_0_15px_rgba(244,91,130,0.25)]'
            : '-ml-4 -mt-4 h-8 w-8 border border-[#F45B82]/40 bg-transparent'
        }`}
      >
        {isView && <span>VIEW</span>}
        {isPlay && <span>PLAY</span>}
      </div>
    </div>
  );
};
