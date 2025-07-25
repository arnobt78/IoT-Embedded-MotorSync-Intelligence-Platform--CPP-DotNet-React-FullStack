
import { useEffect, useRef, useState } from 'react';
import { FaCog } from 'react-icons/fa';


export default function AnimatedMotor({ rpm }: { rpm: number }) {
  const idleRps = 0.5;
  const [activeRps, setActiveRps] = useState(idleRps);
  const [angle, setAngle] = useState(0);
  const lastTimeRef = useRef<number | null>(null);
  const rpmTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (rpmTimeout.current) clearTimeout(rpmTimeout.current);
    const rps = Math.max(rpm / 60, idleRps);
    setActiveRps(rps);
    rpmTimeout.current = setTimeout(() => setActiveRps(idleRps), 1000);
    
  }, [rpm]);

  useEffect(() => {
    let running = true;
    function animate(now: number) {
      if (!running) return;
      if (lastTimeRef.current === null) lastTimeRef.current = now;
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      setAngle(a => (a + 360 * activeRps * delta) % 360);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    return () => { running = false; lastTimeRef.current = null; };
  }, [activeRps]);

  const shadowX = Math.round(18 * Math.cos((angle * Math.PI) / 180));
  const shadowY = Math.round(18 * Math.sin((angle * Math.PI) / 180));

  return (
    <div className="relative w-32 h-32 flex items-center justify-center mx-auto">
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          width: '90px',
          height: '30px',
          background: 'radial-gradient(ellipse at center, #1e40af44 60%, transparent 100%)',
          filter: 'blur(6px)',
          transform: `translate(-50%, -50%) translate(${shadowX}px, ${shadowY}px)`,
          zIndex: 0,
        }}
      />
      <div
        className="w-32 h-32 flex items-center justify-center"
        style={{ zIndex: 1, transform: `rotate(${angle}deg)` }}
      >
        <FaCog
          className="w-28 h-28 text-blue-400"
          style={{
            filter: 'drop-shadow(0px 2px 8px #0002)',
            transform: 'perspective(200px) rotateX(18deg) rotateZ(0deg)',
          }}
        />
      </div>
    </div>
  );
}
