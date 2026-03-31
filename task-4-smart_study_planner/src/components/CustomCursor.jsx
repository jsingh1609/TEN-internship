import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: -100, y: -100 });
  const ring    = useRef({ x: -100, y: -100 });
  const raf     = useRef(null);
  const hovering = useRef(false);

  useEffect(() => {
    const dot  = dotRef.current;
    const ringEl = ringRef.current;
    if (!dot || !ringEl) return;

    const onMove = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };

    const onEnter = () => { hovering.current = true; };
    const onLeave = () => { hovering.current = false; };

    // attach hover detection to interactive elements
    const attach = () => {
      document.querySelectorAll("button,a,input,select,[role=button],.subject-card,.session-row,.day-chip,.exam-card").forEach(el => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });

    function tick() {
      // ring lags behind dot
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;

      dot.style.transform  = `translate(${pos.current.x}px,${pos.current.y}px) translate(-50%,-50%)`;
      ringEl.style.transform = `translate(${ring.current.x}px,${ring.current.y}px) translate(-50%,-50%) scale(${hovering.current ? 1.7 : 1})`;
      ringEl.style.opacity = hovering.current ? "0.55" : "1";
      raf.current = requestAnimationFrame(tick);
    }
    document.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      obs.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
