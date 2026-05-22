import { useState, useRef, useCallback, useEffect } from "react";
import * as mammoth from "mammoth";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false, theme: 'default', fontFamily: 'Inter, sans-serif' });

const MermaidChart = ({ chart }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (chart && ref.current) {
      mermaid.render(`mermaid-${Date.now()}`, chart).then((result) => {
        ref.current.innerHTML = result.svg;
      }).catch(e => console.error("Mermaid render error", e));
    }
  }, [chart]);
  return <div className="mermaid-box" ref={ref} />;
};

const G = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');`;

const CSS = `
${G}
*{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:6px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.12);border-radius:10px;}
::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,0.2);}
:root{
  --bg:#FAF9F6;
  --bg-warm:#F5F0EB;
  --surface:#FFFFFF;
  --surface-hover:#FDF8F4;
  --border:#E8E5E0;
  --border-hi:rgba(218,119,86,0.35);
  --accent:#DA7756;
  --accent-hover:#C4684A;
  --accent-light:rgba(218,119,86,0.08);
  --accent-medium:rgba(218,119,86,0.15);
  --accent-glow:rgba(218,119,86,0.12);
  --text:#2D2B28;
  --text-secondary:#6B6560;
  --text-muted:#9C9690;
  --text-dim:#C4BFB8;
  --serif:'Lora',Georgia,serif;
  --sans:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
  --mono:'JetBrains Mono',Consolas,monospace;
  --shadow-sm:0 1px 3px rgba(0,0,0,0.04),0 1px 2px rgba(0,0,0,0.03);
  --shadow-md:0 4px 16px rgba(0,0,0,0.06),0 2px 4px rgba(0,0,0,0.03);
  --shadow-lg:0 12px 40px rgba(0,0,0,0.08),0 4px 12px rgba(0,0,0,0.04);
  --shadow-accent:0 4px 20px rgba(218,119,86,0.18);
  --radius:14px;
  --radius-sm:10px;
  --radius-xs:6px;
}
html,body{background:var(--bg);min-height:100vh;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}

.root{position:relative;min-height:100vh;overflow-x:hidden;font-family:var(--sans);color:var(--text);}

/* Warm ambient background */
.root::before{content:'';position:fixed;top:0;left:0;right:0;height:400px;background:linear-gradient(180deg,rgba(218,119,86,0.04) 0%,rgba(245,240,235,0.5) 60%,transparent 100%);z-index:0;pointer-events:none;}
.root::after{content:'';position:fixed;bottom:0;left:0;right:0;height:300px;background:linear-gradient(0deg,rgba(218,119,86,0.02) 0%,transparent 100%);z-index:0;pointer-events:none;}

/* Subtle warm orbs */
.orb{position:fixed;border-radius:50%;filter:blur(100px);pointer-events:none;z-index:0;opacity:0.6;}
.orb-1{width:600px;height:600px;background:radial-gradient(circle,rgba(218,119,86,0.06) 0%,transparent 65%);top:-200px;right:-100px;animation:drift1 25s ease-in-out infinite alternate;}
.orb-2{width:500px;height:500px;background:radial-gradient(circle,rgba(180,140,100,0.05) 0%,transparent 65%);bottom:-150px;left:-100px;animation:drift2 30s ease-in-out infinite alternate;}
@keyframes drift1{from{transform:translate(0,0);}to{transform:translate(-60px,40px);}}
@keyframes drift2{from{transform:translate(0,0);}to{transform:translate(40px,-30px);}}

.page{position:relative;z-index:2;max-width:780px;margin:0 auto;padding:3rem 1.5rem 6rem;}

/* ── Header ── */
.header{text-align:center;margin-bottom:3.5rem;animation:fadeUp 0.8s ease both;}
.eyebrow{font-family:var(--mono);font-size:0.68rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;font-weight:500;}
.eyebrow::after{content:'';display:inline-block;width:4px;height:4px;background:var(--accent);border-radius:50%;margin-left:8px;vertical-align:middle;animation:pulse 2s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.7);}}
.h-title{font-family:var(--serif);font-size:clamp(2.5rem,6vw,3.8rem);font-weight:400;color:var(--text);line-height:1.12;letter-spacing:-0.02em;}
.h-title em{font-style:italic;color:var(--accent);}
.h-sub{margin-top:1rem;font-size:0.92rem;color:var(--text-secondary);line-height:1.7;max-width:420px;margin-left:auto;margin-right:auto;font-weight:400;}

/* ── Drop Zone ── */
.dz-wrap{animation:fadeUp 0.8s 0.1s ease both;}
.dz{border:2px dashed var(--border);border-radius:var(--radius);padding:3rem 2rem;text-align:center;cursor:pointer;transition:all 0.3s ease;background:var(--surface);position:relative;overflow:hidden;}
.dz::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 50% 50% at 50% 100%,rgba(218,119,86,0.04) 0%,transparent 70%);pointer-events:none;transition:opacity 0.3s;opacity:0;}
.dz:hover,.dz.drag{border-color:var(--accent);background:var(--surface-hover);box-shadow:var(--shadow-accent);}
.dz:hover::before,.dz.drag::before{opacity:1;}
.dz.drag{transform:scale(1.01);}
.dz-icon{width:52px;height:52px;margin:0 auto 1.2rem;border:1.5px solid var(--border);border-radius:12px;display:flex;align-items:center;justify-content:center;transition:all 0.3s;background:var(--bg-warm);}
.dz:hover .dz-icon,.dz.drag .dz-icon{border-color:var(--accent);background:var(--accent-light);box-shadow:0 0 0 4px rgba(218,119,86,0.06);}
.dz-icon svg{width:22px;height:22px;stroke:var(--accent);opacity:0.75;}
.dz-title{font-family:var(--serif);font-size:1.3rem;color:var(--text);margin-bottom:0.4rem;font-weight:500;}
.dz-sub{font-size:0.82rem;color:var(--text-muted);}
.dz-types{display:flex;gap:6px;justify-content:center;margin-top:1.2rem;flex-wrap:wrap;}
.type-pill{font-family:var(--mono);font-size:0.66rem;padding:3px 10px;border:1px solid var(--border);border-radius:20px;color:var(--text-muted);letter-spacing:0.03em;transition:all 0.2s;font-weight:500;}
.dz:hover .type-pill{border-color:rgba(218,119,86,0.25);color:var(--accent);}
input[type=file]{display:none;}

/* ── File Card ── */
.file-card{border:1px solid rgba(218,119,86,0.2);border-radius:var(--radius-sm);padding:1rem 1.2rem;background:rgba(218,119,86,0.03);display:flex;align-items:center;gap:1rem;}
.file-ic{width:40px;height:40px;background:var(--accent-light);border:1px solid rgba(218,119,86,0.15);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.file-ic svg{width:18px;height:18px;stroke:var(--accent);}
.f-name{font-size:0.88rem;color:var(--text);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;}
.f-size{font-family:var(--mono);font-size:0.68rem;color:var(--text-muted);margin-top:2px;}
.f-rm{background:none;border:none;cursor:pointer;color:var(--text-dim);padding:6px;border-radius:6px;transition:all 0.2s;display:flex;align-items:center;}
.f-rm:hover{color:#c0544a;background:rgba(192,84,74,0.06);}

/* ── Text Input ── */
.or-row{display:flex;align-items:center;gap:12px;margin:1.2rem 0;color:var(--text-dim);font-family:var(--mono);font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;font-weight:500;}
.or-row::before,.or-row::after{content:'';flex:1;height:1px;background:var(--border);}
textarea{width:100%;min-height:140px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-family:var(--sans);font-size:0.88rem;line-height:1.7;padding:1rem 1.15rem;resize:vertical;outline:none;transition:border-color 0.2s,box-shadow 0.2s;}
textarea::placeholder{color:var(--text-dim);}
textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(218,119,86,0.08);}

/* ── Controls ── */
.controls{display:flex;align-items:center;gap:10px;margin-top:1.2rem;flex-wrap:wrap;}
.btn-main{background:var(--accent);color:#fff;border:none;border-radius:8px;padding:0.65rem 1.5rem;font-family:var(--sans);font-size:0.85rem;font-weight:600;cursor:pointer;transition:all 0.25s;display:flex;align-items:center;gap:8px;letter-spacing:0.01em;}
.btn-main:hover{background:var(--accent-hover);transform:translateY(-1px);box-shadow:var(--shadow-accent);}
.btn-main:active{transform:translateY(0);box-shadow:none;}
.btn-main:disabled{background:var(--text-dim);color:#fff;cursor:not-allowed;transform:none;box-shadow:none;opacity:0.6;}
.btn-ghost{background:none;border:1px solid var(--border);border-radius:8px;padding:0.65rem 1rem;color:var(--text-secondary);font-family:var(--sans);font-size:0.82rem;cursor:pointer;transition:all 0.2s;font-weight:500;}
.btn-ghost:hover{border-color:var(--text-muted);color:var(--text);background:var(--bg-warm);}
.modes{display:flex;gap:2px;background:var(--bg-warm);border:1px solid var(--border);border-radius:8px;padding:3px;margin-left:auto;}
.m-btn{background:none;border:none;border-radius:6px;padding:0.3rem 0.7rem;font-family:var(--mono);font-size:0.68rem;color:var(--text-muted);cursor:pointer;transition:all 0.2s;letter-spacing:0.03em;font-weight:500;}
.m-btn.on{background:var(--surface);color:var(--accent);box-shadow:var(--shadow-sm);}

/* ── Loading Overlay ── */
.ls-overlay{
  position:fixed;inset:0;z-index:50;
  background:var(--bg);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  animation:lsFadeIn 0.35s ease;
}
@keyframes lsFadeIn{from{opacity:0;}to{opacity:1;}}
.ls-overlay.exit{animation:lsFadeOut 0.4s ease forwards;}
@keyframes lsFadeOut{from{opacity:1;}to{opacity:0;}}

/* Warm ambient during loading */
.ls-ambient{position:absolute;inset:0;overflow:hidden;pointer-events:none;}
.ls-ambient::before{content:'';position:absolute;top:-100px;right:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(218,119,86,0.08) 0%,transparent 65%);border-radius:50%;filter:blur(60px);animation:drift1 15s ease-in-out infinite alternate;}
.ls-ambient::after{content:'';position:absolute;bottom:-100px;left:-50px;width:400px;height:400px;background:radial-gradient(circle,rgba(180,140,100,0.06) 0%,transparent 65%);border-radius:50%;filter:blur(60px);animation:drift2 18s ease-in-out infinite alternate;}

/* Calm spinner */
.ls-spinner-wrap{position:relative;width:120px;height:120px;margin-bottom:2.5rem;}
.ls-ring{position:absolute;border-radius:50%;border-style:solid;}
.ls-ring-1{inset:0;border-width:2px;border-color:rgba(218,119,86,0.08) rgba(218,119,86,0.08) rgba(218,119,86,0.08) var(--accent);animation:spinCW 2.5s cubic-bezier(0.4,0,0.6,1) infinite;}
.ls-ring-2{inset:14px;border-width:1.5px;border-color:rgba(218,119,86,0.12) rgba(218,119,86,0.04) rgba(218,119,86,0.12) rgba(218,119,86,0.04);animation:spinCCW 1.8s cubic-bezier(0.4,0,0.6,1) infinite;}
@keyframes spinCW{to{transform:rotate(360deg);}}
@keyframes spinCCW{to{transform:rotate(-360deg);}}

.ls-center-icon{
  position:absolute;inset:32px;
  border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:var(--surface);
  border:1px solid var(--border);
  box-shadow:var(--shadow-md);
}
.ls-center-icon svg{width:24px;height:24px;stroke:var(--accent);opacity:0.7;}

.ls-text{text-align:center;position:relative;z-index:2;}
.ls-phase{font-family:var(--mono);font-size:0.65rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);margin-bottom:0.6rem;font-weight:500;}
.ls-msg{font-family:var(--serif);font-size:1.4rem;color:var(--text);height:2rem;overflow:hidden;position:relative;}
.ls-msg-inner{display:flex;flex-direction:column;transition:transform 0.5s cubic-bezier(0.4,0,0.2,1);}
.ls-msg-item{height:2rem;line-height:2rem;white-space:nowrap;}

.ls-prog-wrap{margin-top:2rem;width:220px;position:relative;z-index:2;}
.ls-prog-label{display:flex;justify-content:space-between;margin-bottom:5px;}
.ls-prog-l{font-family:var(--mono);font-size:0.6rem;letter-spacing:0.08em;color:var(--text-muted);text-transform:uppercase;font-weight:500;}
.ls-prog-track{height:3px;background:rgba(218,119,86,0.08);border-radius:4px;overflow:hidden;}
.ls-prog-fill{height:100%;background:linear-gradient(90deg,transparent,var(--accent),rgba(218,119,86,0.3));width:40%;animation:sweep 2s ease-in-out infinite;border-radius:4px;}
@keyframes sweep{0%{transform:translateX(-150%);}100%{transform:translateX(350%);}}

/* ── Results ── */
.results{animation:fadeUp 0.6s ease;}
.r-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2rem;padding-bottom:1.2rem;border-bottom:1px solid var(--border);gap:1rem;flex-wrap:wrap;}
.r-label{font-family:var(--mono);font-size:0.63rem;letter-spacing:0.16em;text-transform:uppercase;color:var(--accent);margin-bottom:0.3rem;font-weight:500;}
.r-name{font-family:var(--serif);font-size:1.5rem;font-style:italic;color:var(--text);font-weight:500;}
.chips{display:flex;gap:6px;flex-wrap:wrap;}
.chip{font-family:var(--mono);font-size:0.65rem;padding:4px 10px;border:1px solid var(--border);border-radius:20px;color:var(--text-muted);letter-spacing:0.03em;font-weight:500;background:var(--surface);}
.chip.hi{border-color:rgba(218,119,86,0.3);color:var(--accent);background:var(--accent-light);}

.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.4rem 1.6rem;margin-bottom:1rem;position:relative;overflow:hidden;transition:border-color 0.25s,box-shadow 0.25s;}
.card:hover{border-color:rgba(218,119,86,0.18);box-shadow:var(--shadow-md);}
.c-label{font-family:var(--mono);font-size:0.62rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.8rem;display:flex;align-items:center;gap:8px;font-weight:500;}
.c-label::before{content:'';display:inline-block;width:12px;height:2px;background:var(--accent);opacity:0.5;border-radius:2px;}
.sum-body{font-family:var(--serif);font-size:1.08rem;line-height:1.85;color:var(--text-secondary);}

/* ── Key Points ── */
.pts{list-style:none;display:flex;flex-direction:column;gap:0.5rem;}
.pt{display:flex;gap:10px;align-items:flex-start;padding:0.65rem 0.9rem;border-radius:8px;background:var(--bg-warm);border:1px solid transparent;font-size:0.85rem;color:var(--text-secondary);line-height:1.6;transition:all 0.2s;animation:slideIn 0.4s ease both;}
.pt:hover{background:var(--accent-light);border-color:rgba(218,119,86,0.12);}
.pt-n{font-family:var(--mono);font-size:0.6rem;color:var(--accent);opacity:0.65;margin-top:3px;flex-shrink:0;min-width:16px;font-weight:600;}

/* ── Action Items ── */
.acts{display:flex;flex-direction:column;gap:0.5rem;}
.act{display:flex;gap:10px;align-items:flex-start;padding:0.6rem 0.9rem;background:var(--accent-light);border:1px solid rgba(218,119,86,0.1);border-radius:8px;font-size:0.85rem;color:var(--text-secondary);line-height:1.55;animation:slideIn 0.4s ease both;}
.act-box{width:14px;height:14px;border:1.5px solid rgba(218,119,86,0.35);border-radius:3px;flex-shrink:0;margin-top:2px;}

/* ── Tags ── */
.tags{display:flex;flex-wrap:wrap;gap:6px;}
.tag{padding:4px 12px;background:var(--bg-warm);border:1px solid var(--border);border-radius:20px;font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);transition:all 0.2s;cursor:default;font-weight:500;}
.tag:hover{border-color:rgba(218,119,86,0.3);color:var(--accent);background:var(--accent-light);}

.grid2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;}
@media(max-width:580px){.grid2{grid-template-columns:1fr;}}

.tone-row{display:flex;align-items:center;gap:10px;}
.tone-dot{width:9px;height:9px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 0 rgba(218,119,86,0.3);animation:toneRing 2.5s ease-out infinite;}
@keyframes toneRing{0%{box-shadow:0 0 0 0 rgba(218,119,86,0.3);}70%{box-shadow:0 0 0 8px rgba(218,119,86,0);}100%{box-shadow:0 0 0 0 rgba(218,119,86,0);}}
.tone-val{font-family:var(--serif);font-size:1.05rem;color:var(--text);font-weight:500;}

.err{background:rgba(192,84,74,0.06);border:1px solid rgba(192,84,74,0.15);border-radius:var(--radius-sm);padding:1rem 1.2rem;color:#9c4040;font-size:0.85rem;margin-bottom:1.5rem;}

@keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes slideIn{from{opacity:0;transform:translateX(-6px);}to{opacity:1;transform:translateX(0);}}

/* ── History Panel ── */
.hist-panel{position:fixed;top:0;right:0;bottom:0;width:340px;background:rgba(250,249,246,0.97);backdrop-filter:blur(20px);border-left:1px solid var(--border);transform:translateX(100%);transition:transform 0.4s cubic-bezier(0.16,1,0.3,1);z-index:9000;display:flex;flex-direction:column;}
.hist-panel.open{transform:translateX(0);box-shadow:-12px 0 40px rgba(0,0,0,0.08);}
.hist-head{padding:1.5rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.hist-title{font-family:var(--sans);font-size:0.95rem;font-weight:600;color:var(--text);}
.hist-close{background:none;border:none;color:var(--text-muted);cursor:pointer;padding:4px;border-radius:6px;transition:all 0.2s;}
.hist-close:hover{background:var(--bg-warm);color:var(--text);}
.hist-list{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:0.7rem;}
.hist-item{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:0.9rem;cursor:pointer;transition:all 0.2s;position:relative;}
.hist-item:hover{border-color:rgba(218,119,86,0.25);background:var(--surface-hover);box-shadow:var(--shadow-sm);}
.hist-name{font-size:0.82rem;font-weight:500;color:var(--text);margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:20px;}
.hist-time{font-family:var(--mono);font-size:0.62rem;color:var(--text-dim);}
.hist-del{position:absolute;right:8px;top:8px;background:none;border:none;color:var(--text-dim);cursor:pointer;opacity:0;transition:opacity 0.2s,color 0.2s;}
.hist-item:hover .hist-del{opacity:1;}
.hist-del:hover{color:#c0544a;}

/* ── Mermaid ── */
.mermaid-box{width:100%;background:var(--bg-warm);border:1px solid var(--border);border-radius:var(--radius-sm);padding:1.5rem;overflow-x:auto;display:flex;justify-content:center;margin-top:0.5rem;}

/* ── Startup Splash ── */
.startup-splash{position:fixed;inset:0;background:var(--bg);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 0.8s ease,visibility 0.8s ease;}
.startup-splash.exit{opacity:0;visibility:hidden;}
.su-logo{width:64px;height:64px;margin-bottom:2rem;position:relative;}
.su-logo::before{content:'';position:absolute;inset:-16px;border:1.5px solid rgba(218,119,86,0.2);border-radius:50%;animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;}
@keyframes ping{75%,100%{transform:scale(1.8);opacity:0;}}
.su-logo svg{width:100%;height:100%;stroke:var(--accent);stroke-width:1.2;opacity:0.8;}
.su-text{font-family:var(--mono);font-size:0.72rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--accent);font-weight:500;overflow:hidden;border-right:2px solid var(--accent);white-space:nowrap;animation:typing 1.5s steps(30,end),blink 0.75s step-end infinite;}
@keyframes typing{from{width:0}to{width:100%}}
@keyframes blink{from,to{border-color:transparent}50%{border-color:var(--accent);}}

/* ── Top Nav ── */
.top-nav{position:absolute;top:1.5rem;right:1.5rem;z-index:20;}
.btn-hist{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:0.5rem 0.9rem;color:var(--text-secondary);font-family:var(--mono);font-size:0.68rem;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:6px;letter-spacing:0.04em;text-transform:uppercase;font-weight:500;box-shadow:var(--shadow-sm);}
.btn-hist:hover{background:var(--surface-hover);border-color:rgba(218,119,86,0.25);color:var(--accent);box-shadow:var(--shadow-md);}

/* ── Detailed Explanation Panel ── */
.explain-section{margin-top:1.5rem;animation:fadeUp 0.5s ease;}
.explain-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.2rem;}
.explain-trigger{display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--accent),var(--accent-hover));color:#fff;border:none;border-radius:8px;padding:0.7rem 1.4rem;font-family:var(--sans);font-size:0.85rem;font-weight:600;cursor:pointer;transition:all 0.25s;box-shadow:var(--shadow-accent);}
.explain-trigger:hover{transform:translateY(-2px);box-shadow:0 6px 28px rgba(218,119,86,0.25);}
.explain-trigger:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none;}
.explain-trigger svg{width:16px;height:16px;stroke:currentColor;}

.view-toggle{display:flex;gap:2px;background:var(--bg-warm);border:1px solid var(--border);border-radius:8px;padding:3px;}
.vt-btn{background:none;border:none;border-radius:6px;padding:0.32rem 0.85rem;font-family:var(--sans);font-size:0.75rem;color:var(--text-muted);cursor:pointer;transition:all 0.2s;font-weight:500;}
.vt-btn.active{background:var(--surface);color:var(--accent);box-shadow:var(--shadow-sm);}

.explain-content{animation:fadeUp 0.4s ease;}
.explain-overview{font-family:var(--serif);font-size:1.05rem;line-height:1.85;color:var(--text-secondary);margin-bottom:1.2rem;padding:1.2rem 1.4rem;background:var(--accent-light);border-radius:var(--radius-sm);border-left:3px solid var(--accent);}

.explain-sections{display:flex;flex-direction:column;gap:1rem;}
.explain-sec{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.3rem 1.5rem;transition:all 0.25s;}
.explain-sec:hover{border-color:rgba(218,119,86,0.2);box-shadow:var(--shadow-md);}
.explain-sec-head{display:flex;align-items:center;gap:10px;margin-bottom:0.7rem;}
.explain-sec-num{font-family:var(--mono);font-size:0.58rem;font-weight:600;color:var(--accent);background:var(--accent-light);padding:3px 8px;border-radius:4px;letter-spacing:0.08em;}
.explain-sec-title{font-family:var(--serif);font-size:1.08rem;font-weight:600;color:var(--text);}
.explain-sec-body{font-size:0.88rem;line-height:1.8;color:var(--text-secondary);}
.explain-sec-importance{display:inline-flex;align-items:center;gap:5px;margin-top:0.7rem;font-family:var(--mono);font-size:0.62rem;color:var(--accent);letter-spacing:0.06em;font-weight:500;padding:3px 10px;background:var(--accent-light);border-radius:20px;}

.explain-conclusions{margin-top:1rem;}
.explain-conclusions .card{border-left:3px solid var(--accent);}

.explain-terms{display:flex;flex-direction:column;gap:0.5rem;margin-top:0.3rem;}
.explain-term{display:flex;gap:10px;padding:0.6rem 0.85rem;background:var(--bg-warm);border-radius:8px;font-size:0.84rem;line-height:1.55;transition:all 0.2s;}
.explain-term:hover{background:var(--accent-light);}
.explain-term-word{font-weight:600;color:var(--text);min-width:90px;flex-shrink:0;font-family:var(--sans);}
.explain-term-def{color:var(--text-secondary);}

/* ── Explain Loading Inline ── */
.explain-loading{display:flex;align-items:center;gap:12px;padding:1.2rem 1.4rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);animation:fadeUp 0.3s ease;}
.explain-loading-dots{display:flex;gap:4px;}
.explain-loading-dots span{width:6px;height:6px;background:var(--accent);border-radius:50%;animation:dotPulse 1.2s ease-in-out infinite;}
.explain-loading-dots span:nth-child(2){animation-delay:0.15s;}
.explain-loading-dots span:nth-child(3){animation-delay:0.3s;}
@keyframes dotPulse{0%,100%{opacity:0.3;transform:scale(0.8);}50%{opacity:1;transform:scale(1.1);}}
.explain-loading-text{font-size:0.85rem;color:var(--text-muted);font-weight:500;}

@keyframes spin{to{transform:rotate(360deg);}}
`;

const MODES = [
  { id: "standard", label: "Standard" },
  { id: "bullets", label: "Bullets" },
  { id: "academic", label: "Academic" },
  { id: "diagram", label: "Diagram" },
];

const SYS = `You are an expert notes analyst. Return ONLY a valid JSON object with NO markdown fences or preamble:
{
  "summary": "2-4 sentence paragraph capturing core essence",
  "keyPoints": ["insight 1","insight 2","insight 3","insight 4"],
  "actionItems": ["action 1","action 2"],
  "keywords": ["term1","term2","term3","term4","term5","term6"],
  "tone": "Technical | Casual | Academic | Professional | Creative | Journalistic",
  "wordCount": 123,
  "diagram": "Valid Mermaid markdown strictly without enclosing backticks. Flowchart or Mindmap summarizing the structure. Leave empty string if diagram mode not requested."
}
keyPoints = 3-6 insights; actionItems = tasks found (empty array if none, max 5); keywords = 5-8 topics; wordCount = approximate count.`;

const EXPLAIN_SYS = `You are an expert document analyst. Provide a comprehensive, detailed explanation of the document. Return ONLY a valid JSON object with NO markdown fences or preamble:
{
  "overview": "A thorough 3-5 sentence overview of what the document covers, its purpose, and significance.",
  "sections": [
    {
      "title": "Section heading describing the topic",
      "content": "Detailed multi-sentence explanation of this section. Be thorough and educational. Explain concepts, provide context, and clarify complex ideas. Minimum 3-4 sentences per section.",
      "importance": "High | Medium | Low"
    }
  ],
  "conclusions": "A comprehensive paragraph summarizing the key takeaways, implications, and what the reader should understand after reading the document.",
  "terminology": [
    {
      "term": "Technical term or concept",
      "definition": "Clear, concise definition accessible to a general audience"
    }
  ]
}
sections = 4-8 detailed sections covering all major topics; terminology = 3-8 key terms found in the document. Be thorough, educational, and insightful. Write as if explaining to someone who wants to deeply understand the document.`;

function modeHint(m) {
  if (m === "bullets") return "Keep summary to 1 sentence. Bullet points under 10 words each.";
  if (m === "academic") return "Use formal academic register. Emphasize methodology, findings, theoretical significance.";
  if (m === "diagram") return "Focus on structural mapping. Provide a highly detailed Mermaid.js flowchart or mindmap in the 'diagram' JSON field illustrating the core concepts.";
  return "Balanced professional summary for general use.";
}

function fmtSize(b) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

async function readFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext === "txt" || ext === "md") return { type: "text", content: await file.text() };
  if (ext === "pdf") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ type: "pdf", content: reader.result.split(',')[1] });
      reader.onerror = () => reject(new Error("Failed to read PDF file"));
      reader.readAsDataURL(file);
    });
  }
  if (ext === "docx" || ext === "doc") {
    const buf = await file.arrayBuffer();
    const res = await mammoth.extractRawText({ arrayBuffer: buf });
    return { type: "text", content: res.value };
  }
  throw new Error(`Unsupported type: .${ext}`);
}

async function callAPI(systemPrompt, fileData, file, notes, mode, isExplain = false) {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const groqKey = import.meta.env.VITE_GROQ_API_KEY;
  const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  const isGemini = !!geminiKey;
  const isGroq = !isGemini && !!groqKey;
  const apiKey = geminiKey || groqKey || anthropicKey;

  if (!apiKey) throw new Error("API key missing. Please add VITE_GEMINI_API_KEY, VITE_GROQ_API_KEY, or VITE_ANTHROPIC_API_KEY to your .env file.");

  const modeText = isExplain ? "Provide a thorough, detailed explanation of the entire document." : `Mode: ${modeHint(mode)}`;

  let userContent;
  let geminiParts = [];

  if (fileData?.type === "pdf") {
    if (isGroq) {
      throw new Error("Groq does not support direct PDF upload. Please use Gemini or Anthropic for PDFs instead.");
    }
    if (isGemini) {
      geminiParts = [
        { inlineData: { mimeType: "application/pdf", data: fileData.content } },
        { text: `${modeText}\n\n${isExplain ? 'Explain the document above in comprehensive detail.' : 'Summarize the document above.'}` }
      ];
    } else {
      userContent = [
        { type: "document", source: { type: "base64", media_type: "application/pdf", data: fileData.content } },
        { type: "text", text: `${modeText}\n\n${isExplain ? 'Explain the document above in comprehensive detail.' : 'Summarize the document above.'}` },
      ];
    }
  } else {
    const text = fileData?.content || notes.trim();
    if (isGemini) {
      geminiParts = [{ text: `${modeText}\n\nNotes:\n\n${text}` }];
    } else {
      userContent = `${modeText}\n\nNotes:\n\n${text}`;
    }
  }

  let res;
  if (isGemini) {
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: geminiParts }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });
  } else if (isGroq) {
    res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: typeof userContent === 'string' ? userContent : JSON.stringify(userContent) }
        ],
        response_format: { type: "json_object" }
      }),
    });
  } else {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey.trim(),
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: isExplain ? 4000 : 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userContent }],
      }),
    });
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `API Error: ${res.status}`);
  }

  const data = await res.json();
  let raw;
  if (isGemini) {
    raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } else if (isGroq) {
    raw = data.choices[0].message.content;
  } else {
    raw = (data.content || []).map(b => b.text || "").join("");
  }

  return JSON.parse(raw.replace(/```json|```|```mermaid/g, "").trim());
}

export default function App() {
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [mode, setMode] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [drag, setDrag] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Detailed Explanation state
  const [explanation, setExplanation] = useState(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const [activeView, setActiveView] = useState("summary"); // "summary" | "detailed"

  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('smart_notes_history') || '[]');
    } catch {
      return [];
    }
  });
  const [histOpen, setHistOpen] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    const t = setTimeout(() => setInitialLoad(false), 2400);
    return () => clearTimeout(t);
  }, []);

  const saveToHistory = (res, fn) => {
    const item = { id: Date.now(), name: fn, date: new Date().toLocaleString(), result: res };
    setHistory(prev => {
      const next = [item, ...prev].slice(0, 15);
      localStorage.setItem('smart_notes_history', JSON.stringify(next));
      return next;
    });
  };

  const loadHistoryItem = (item) => {
    setResult(item.result);
    setExplanation(null);
    setActiveView("summary");
    setFile({ name: item.name, size: 0 });
    setNotes("");
    setHistOpen(false);
  };

  const deleteHistoryItem = (e, id) => {
    e.stopPropagation();
    setHistory(prev => {
      const next = prev.filter(i => i.id !== id);
      localStorage.setItem('smart_notes_history', JSON.stringify(next));
      return next;
    });
  };

  const handleFile = useCallback(async (f) => {
    setError(null);
    try {
      const data = await readFile(f);
      setFile(f); setFileData(data); setNotes(""); setResult(null); setExplanation(null); setActiveView("summary");
    } catch (e) { setError(e.message); }
  }, []);

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const removeFile = () => { setFile(null); setFileData(null); setResult(null); setExplanation(null); setActiveView("summary"); };

  const canGo = !loading && (file || notes.trim().length > 20);

  const summarize = async () => {
    setLoading(true); setResult(null); setError(null); setExplanation(null); setActiveView("summary");
    try {
      const parsed = await callAPI(SYS, fileData, file, notes, mode, false);
      setResult(parsed);
      saveToHistory(parsed, file?.name || "Pasted Text");
    } catch (err) { setError(err.message || "Analysis failed. Please try again."); }
    finally { setLoading(false); }
  };

  const explainDetailed = async () => {
    setExplainLoading(true); setError(null);
    try {
      const parsed = await callAPI(EXPLAIN_SYS, fileData, file, notes, mode, true);
      setExplanation(parsed);
      setActiveView("detailed");
    } catch (err) { setError(err.message || "Explanation failed. Please try again."); }
    finally { setExplainLoading(false); }
  };

  const clear = () => { setNotes(""); removeFile(); setResult(null); setError(null); setExplanation(null); setActiveView("summary"); };

  const [msgIdx, setMsgIdx] = useState(0);
  const MSGS = ["Parsing structure", "Reading document", "Extracting key ideas", "Identifying themes", "Spotting action items", "Distilling insights", "Composing summary", "Almost there"];
  useEffect(() => {
    if (!loading) {
      const st = setTimeout(() => setMsgIdx(0), 0);
      return () => clearTimeout(st);
    }
    const t = setInterval(() => setMsgIdx(i => (i + 1) % 8), 1800);
    return () => clearInterval(t);
  }, [loading]);

  return (
    <>
      <style>{CSS}</style>
      <div className="root">
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="page">

          <div className="top-nav">
            <button className="btn-hist" onClick={() => setHistOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              History
            </button>
          </div>

          <header className="header">
            <div className="eyebrow">Intelligence Layer · AI Powered</div>
            <h1 className="h-title">Notes, <em>distilled.</em></h1>
            <p className="h-sub">Upload a document or paste text — get a precise summary, detailed explanations, and action items instantly.</p>
          </header>

          <div className="dz-wrap">
            {!file ? (
              <div
                className={`dz${drag ? " drag" : ""}`}
                onClick={() => inputRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
              >
                <div className="dz-icon">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 16V8m0 0-3 3m3-3 3 3M20 16.7A5 5 0 0 0 18 7h-1.26A7 7 0 1 0 4 14.7" />
                  </svg>
                </div>
                <div className="dz-title">Drop your document here</div>
                <div className="dz-sub">or click to browse files</div>
                <div className="dz-types">
                  {[".pdf",".docx",".txt",".md"].map(t => <span key={t} className="type-pill">{t}</span>)}
                </div>
              </div>
            ) : (
              <div className="file-card">
                <div className="file-ic">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="f-name">{file.name}</div>
                  <div className="f-size">{fmtSize(file.size)} · {file.name.split(".").pop().toUpperCase()}</div>
                </div>
                <button className="f-rm" onClick={removeFile} title="Remove">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            )}
            <input ref={inputRef} type="file" accept=".pdf,.docx,.doc,.txt,.md" onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
          </div>

          {!file && (
            <>
              <div className="or-row">or paste text</div>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Paste meeting notes, research, articles, lecture transcripts, anything…" />
            </>
          )}

          <div className="controls">
            <button className="btn-main" onClick={summarize} disabled={!canGo}>
              {loading
                ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{animation:"spin 1s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Analyzing</>
                : "Summarize →"}
            </button>
            {(file || notes || result) && <button className="btn-ghost" onClick={clear}>Clear all</button>}
            <div className="modes">
              {MODES.map(m => (
                <button key={m.id} className={`m-btn${mode === m.id ? " on" : ""}`} onClick={() => setMode(m.id)}>{m.label}</button>
              ))}
            </div>
          </div>

          {error && <div className="err" style={{marginTop:'1rem'}}>{error}</div>}

          {result && !loading && (
            <div className="results">
              <div className="r-header">
                <div>
                  <div className="r-label">Analysis complete</div>
                  <div className="r-name">{file?.name || "Your notes"}</div>
                </div>
                <div className="chips">
                  <span className="chip">{result.wordCount || "~"} words</span>
                  {result.tone && <span className="chip hi">{result.tone}</span>}
                  <span className="chip" style={{textTransform:"capitalize"}}>{mode}</span>
                </div>
              </div>

              {/* View Toggle — only shown when explanation is available */}
              {explanation && (
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.2rem'}}>
                  <div className="view-toggle">
                    <button className={`vt-btn${activeView === 'summary' ? ' active' : ''}`} onClick={() => setActiveView('summary')}>
                      Summary
                    </button>
                    <button className={`vt-btn${activeView === 'detailed' ? ' active' : ''}`} onClick={() => setActiveView('detailed')}>
                      Detailed
                    </button>
                  </div>
                </div>
              )}

              {/* ── Summary View ── */}
              {activeView === "summary" && (
                <>
                  <div className="card">
                    <div className="c-label">Summary</div>
                    <p className="sum-body">{result.summary}</p>
                  </div>

                  {result.diagram && (
                    <div className="card">
                      <div className="c-label">Diagrammatic Representation</div>
                      <MermaidChart chart={result.diagram} />
                    </div>
                  )}

                  <div className="grid2">
                    {result.keyPoints?.length > 0 && (
                      <div className="card">
                        <div className="c-label">Key Points</div>
                        <ul className="pts">
                          {result.keyPoints.map((p, i) => (
                            <li key={i} className="pt" style={{animationDelay:`${i*0.07}s`}}>
                              <span className="pt-n">0{i+1}</span>{p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                      {result.actionItems?.length > 0 && (
                        <div className="card">
                          <div className="c-label">Action Items</div>
                          <div className="acts">
                            {result.actionItems.map((a, i) => (
                              <div key={i} className="act" style={{animationDelay:`${i*0.07}s`}}>
                                <div className="act-box" />{a}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.tone && (
                        <div className="card">
                          <div className="c-label">Detected Tone</div>
                          <div className="tone-row">
                            <div className="tone-dot" />
                            <div className="tone-val">{result.tone}</div>
                          </div>
                        </div>
                      )}

                      {result.keywords?.length > 0 && (
                        <div className="card">
                          <div className="c-label">Keywords</div>
                          <div className="tags">
                            {result.keywords.map((k, i) => <span key={i} className="tag">{k}</span>)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ── Detailed Explanation View ── */}
              {activeView === "detailed" && explanation && (
                <div className="explain-content">
                  <div className="explain-overview">{explanation.overview}</div>

                  <div className="explain-sections">
                    {explanation.sections?.map((sec, i) => (
                      <div key={i} className="explain-sec" style={{animationDelay:`${i*0.08}s`,animation:'fadeUp 0.4s ease both'}}>
                        <div className="explain-sec-head">
                          <span className="explain-sec-num">§{i+1}</span>
                          <span className="explain-sec-title">{sec.title}</span>
                        </div>
                        <div className="explain-sec-body">{sec.content}</div>
                        {sec.importance && (
                          <div className="explain-sec-importance">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v10m0 4v2"/><circle cx="12" cy="12" r="10"/></svg>
                            {sec.importance} importance
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {explanation.conclusions && (
                    <div className="explain-conclusions" style={{marginTop:'1rem'}}>
                      <div className="card">
                        <div className="c-label">Conclusions & Takeaways</div>
                        <p className="sum-body">{explanation.conclusions}</p>
                      </div>
                    </div>
                  )}

                  {explanation.terminology?.length > 0 && (
                    <div className="card" style={{marginTop:'0.5rem'}}>
                      <div className="c-label">Key Terminology</div>
                      <div className="explain-terms">
                        {explanation.terminology.map((t, i) => (
                          <div key={i} className="explain-term" style={{animationDelay:`${i*0.06}s`,animation:'slideIn 0.35s ease both'}}>
                            <span className="explain-term-word">{t.term}</span>
                            <span className="explain-term-def">{t.definition}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Explain Button & Loading ── */}
              <div className="explain-section">
                {!explanation && !explainLoading && (
                  <button className="explain-trigger" onClick={explainDetailed} disabled={explainLoading}>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
                      <line x1="9" y1="21" x2="15" y2="21"/>
                    </svg>
                    Explain in Detail →
                  </button>
                )}

                {explainLoading && (
                  <div className="explain-loading">
                    <div className="explain-loading-dots">
                      <span></span><span></span><span></span>
                    </div>
                    <span className="explain-loading-text">Generating detailed explanation…</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Startup Splash */}
        <div className={`startup-splash ${!initialLoad ? 'exit' : ''}`}>
          <div className="su-logo">
            <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="su-text" style={{width: initialLoad ? 'auto' : '100%'}}>INITIALIZING INTELLIGENCE LAYER</div>
        </div>

        {/* History Panel */}
        <div className={`hist-panel ${histOpen ? 'open' : ''}`}>
          <div className="hist-head">
            <div className="hist-title">Past Analyses</div>
            <button className="hist-close" onClick={() => setHistOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="hist-list">
            {history.length === 0 ? <div style={{color:'var(--text-dim)',fontSize:'0.8rem',textAlign:'center',marginTop:'2rem'}}>No history yet.</div> : null}
            {history.map(item => (
              <div key={item.id} className="hist-item" onClick={() => loadHistoryItem(item)}>
                <div className="hist-name">{item.name}</div>
                <div className="hist-time">{item.date}</div>
                <button className="hist-del" onClick={(e) => deleteHistoryItem(e, item.id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Full-screen Loading Overlay */}
        {loading && (
          <div className="ls-overlay">
            <div className="ls-ambient" />

            <div className="ls-spinner-wrap">
              <div className="ls-ring ls-ring-1" />
              <div className="ls-ring ls-ring-2" />
              <div className="ls-center-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="8" y1="13" x2="16" y2="13"/>
                  <line x1="8" y1="17" x2="13" y2="17"/>
                </svg>
              </div>
            </div>

            <div className="ls-text">
              <div className="ls-phase">Analyzing Document</div>
              <div className="ls-msg">
                <div className="ls-msg-inner" style={{transform:`translateY(-${msgIdx * 2}rem)`}}>
                  {MSGS.map((m,i) => (
                    <div key={i} className="ls-msg-item">{m}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ls-prog-wrap">
              <div className="ls-prog-label">
                <span className="ls-prog-l">Processing</span>
                <span className="ls-prog-l" style={{color:"var(--accent)"}}>{file?.name?.split(".").pop().toUpperCase() || "TEXT"}</span>
              </div>
              <div className="ls-prog-track"><div className="ls-prog-fill" /></div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </>
  );
}
