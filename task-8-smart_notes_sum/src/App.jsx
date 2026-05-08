import { useState, useRef, useCallback, useEffect } from "react";
import * as mammoth from "mammoth";

const G = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Syne:wght@400;500;600&family=Syne+Mono&display=swap');`;

const CSS = `
${G}
*{box-sizing:border-box;margin:0;padding:0; -ms-overflow-style: none; scrollbar-width: none;}
::-webkit-scrollbar { display: none; }
:root{
  --bg:#07090d;
  --surface:rgba(255,255,255,0.03);
  --border:rgba(255,255,255,0.07);
  --border-hi:rgba(0,210,170,0.3);
  --teal:#00d2aa;
  --teal-dim:rgba(0,210,170,0.08);
  --text:#dce8e4;
  --text-muted:rgba(220,232,228,0.4);
  --text-dim:rgba(220,232,228,0.18);
  --serif:'Cormorant Garamond',serif;
  --sans:'Syne',sans-serif;
  --mono:'Syne Mono',monospace;
}
html,body{background:var(--bg);min-height:100vh;}
.root{position:relative;min-height:100vh;overflow-x:hidden;font-family:var(--sans);}
.root::before{content:'';position:fixed;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 0%,rgba(0,210,170,0.0) 15%,rgba(0,210,170,0.45) 50%,rgba(0,210,170,0.0) 85%,transparent 100%);z-index:10;pointer-events:none;}
.root::after{content:'';position:fixed;top:0;left:0;right:0;height:60px;background:linear-gradient(to bottom,rgba(0,210,170,0.03) 0%,transparent 100%);z-index:0;pointer-events:none;}
.orb{position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;}
.orb-1{width:750px;height:750px;background:radial-gradient(circle,rgba(0,190,148,0.16) 0%,transparent 65%);top:-260px;left:-160px;animation:drift1 20s ease-in-out infinite alternate;}
.orb-2{width:600px;height:600px;background:radial-gradient(circle,rgba(0,80,170,0.12) 0%,transparent 65%);bottom:-200px;right:-100px;animation:drift2 25s ease-in-out infinite alternate;}
.orb-3{width:380px;height:380px;background:radial-gradient(circle,rgba(0,210,170,0.08) 0%,transparent 65%);top:40%;left:52%;animation:pulse3 14s ease-in-out infinite;}
@keyframes drift1{from{transform:translate(0,0);}to{transform:translate(80px,50px);}}
@keyframes drift2{from{transform:translate(0,0);}to{transform:translate(-50px,-40px);}}
@keyframes pulse3{0%,100%{opacity:0.5;transform:translate(-50%,-50%) scale(1);}50%{opacity:1;transform:translate(-50%,-50%) scale(1.2);}}
.grain{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0.035;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:180px;}
.page{position:relative;z-index:2;max-width:860px;margin:0 auto;padding:3.5rem 1.5rem 6rem;}

.header{text-align:center;margin-bottom:4rem;animation:fadeUp 0.9s ease both;}
.eyebrow{font-family:var(--mono);font-size:0.65rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--teal);margin-bottom:1.4rem;opacity:0.75;}
.eyebrow::after{content:'_';animation:cursorBlink 1.2s step-end infinite;margin-left:1px;}
@keyframes cursorBlink{0%,100%{opacity:1;}50%{opacity:0;}}
.h-title{font-family:var(--serif);font-size:clamp(3rem,7vw,5rem);font-weight:400;color:var(--text);line-height:1.05;letter-spacing:-0.01em;}
.h-title em{font-style:italic;color:var(--teal);text-shadow:0 0 40px rgba(0,210,170,0.25);}
.h-sub{margin-top:1.1rem;font-size:0.88rem;color:var(--text-muted);line-height:1.75;max-width:400px;margin-left:auto;margin-right:auto;}

.dz-wrap{animation:fadeUp 0.9s 0.12s ease both;}
.dz{border:1px dashed rgba(0,210,170,0.18);border-radius:18px;padding:3.5rem 2rem;text-align:center;cursor:pointer;transition:all 0.35s;background:var(--surface);backdrop-filter:blur(12px);position:relative;overflow:hidden;}
.dz::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 55% at 50% 100%,rgba(0,210,170,0.06) 0%,transparent 70%);pointer-events:none;transition:opacity 0.3s;}
.dz::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 120%,rgba(0,210,170,0.04) 0%,transparent 70%);pointer-events:none;}
.dz:hover,.dz.drag{border-color:rgba(0,210,170,0.5);background:var(--teal-dim);box-shadow:0 0 60px rgba(0,210,170,0.06) inset;}
.dz:hover::before{opacity:2;}
.dz.drag{transform:scale(1.015);}
.dz-icon{width:56px;height:56px;margin:0 auto 1.4rem;border:1px solid rgba(0,210,170,0.2);border-radius:14px;display:flex;align-items:center;justify-content:center;transition:all 0.3s;background:rgba(0,210,170,0.04);}
.dz:hover .dz-icon,.dz.drag .dz-icon{border-color:var(--teal);background:rgba(0,210,170,0.12);box-shadow:0 0 20px rgba(0,210,170,0.12);}
.dz-icon svg{width:24px;height:24px;stroke:var(--teal);opacity:0.8;}
.dz-title{font-family:var(--serif);font-size:1.5rem;color:var(--text);margin-bottom:0.5rem;}
.dz-sub{font-size:0.82rem;color:var(--text-muted);}
.dz-types{display:flex;gap:7px;justify-content:center;margin-top:1.3rem;flex-wrap:wrap;}
.type-pill{font-family:var(--mono);font-size:0.68rem;padding:3px 10px;border:0.5px solid var(--border);border-radius:20px;color:var(--text-dim);letter-spacing:0.04em;transition:all 0.2s;}
.dz:hover .type-pill{border-color:rgba(0,210,170,0.15);color:rgba(0,210,170,0.5);}
input[type=file]{display:none;}

.file-card{border:0.5px solid rgba(0,210,170,0.2);border-radius:14px;padding:1.1rem 1.4rem;background:rgba(0,210,170,0.05);display:flex;align-items:center;gap:1rem;}
.file-ic{width:42px;height:42px;background:rgba(0,210,170,0.1);border:0.5px solid rgba(0,210,170,0.18);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.file-ic svg{width:18px;height:18px;stroke:var(--teal);}
.f-name{font-size:0.9rem;color:var(--text);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;}
.f-size{font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);margin-top:2px;}
.f-rm{background:none;border:none;cursor:pointer;color:var(--text-dim);padding:6px;border-radius:6px;transition:color 0.2s;display:flex;align-items:center;}
.f-rm:hover{color:rgba(230,100,90,0.8);}

.or-row{display:flex;align-items:center;gap:12px;margin:1.25rem 0;color:var(--text-dim);font-family:var(--mono);font-size:0.7rem;letter-spacing:0.1em;}
.or-row::before,.or-row::after{content:'';flex:1;height:0.5px;background:var(--border);}
textarea{width:100%;min-height:155px;background:rgba(255,255,255,0.025);border:0.5px solid var(--border);border-radius:12px;color:var(--text);font-family:var(--sans);font-size:0.9rem;line-height:1.7;padding:1.1rem 1.25rem;resize:vertical;outline:none;transition:border-color 0.2s,background 0.2s;}
textarea::placeholder{color:var(--text-dim);}
textarea:focus{border-color:rgba(0,210,170,0.28);background:rgba(0,210,170,0.015);}

.controls{display:flex;align-items:center;gap:10px;margin-top:1.25rem;flex-wrap:wrap;}
.btn-main{background:var(--teal);color:#031a14;border:none;border-radius:8px;padding:0.7rem 1.7rem;font-family:var(--sans);font-size:0.88rem;font-weight:600;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:8px;position:relative;overflow:hidden;}
.btn-main::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 120%,rgba(255,255,255,0.15) 0%,transparent 60%);opacity:0;transition:opacity 0.3s;}
.btn-main:hover::after{opacity:1;}
.btn-main:hover{background:#00e8bc;transform:translateY(-1px);box-shadow:0 8px 28px rgba(0,210,170,0.3),0 0 0 1px rgba(0,210,170,0.2);}
.btn-main:active{transform:translateY(0);box-shadow:none;}
.btn-main:disabled{background:rgba(0,210,170,0.18);color:rgba(0,210,170,0.35);cursor:not-allowed;transform:none;box-shadow:none;}
.btn-ghost{background:none;border:0.5px solid var(--border);border-radius:8px;padding:0.7rem 1.1rem;color:var(--text-muted);font-family:var(--sans);font-size:0.85rem;cursor:pointer;transition:all 0.2s;}
.btn-ghost:hover{border-color:rgba(255,255,255,0.14);color:var(--text);}
.modes{display:flex;gap:3px;background:rgba(255,255,255,0.025);border:0.5px solid var(--border);border-radius:8px;padding:3px;margin-left:auto;}
.m-btn{background:none;border:none;border-radius:5px;padding:0.32rem 0.8rem;font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);cursor:pointer;transition:all 0.2s;letter-spacing:0.04em;}
.m-btn.on{background:rgba(0,210,170,0.12);color:var(--teal);}

/* ── Full-screen loading overlay ── */
.ls-overlay{
  position:fixed;inset:0;z-index:50;
  background:#07090d;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  animation:lsFadeIn 0.35s ease;
  overflow:hidden;
}
@keyframes lsFadeIn{from{opacity:0;}to{opacity:1;}}
.ls-overlay.exit{animation:lsFadeOut 0.4s ease forwards;}
@keyframes lsFadeOut{from{opacity:1;}to{opacity:0;}}

/* Intensified orbs during loading */
.ls-orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;}
.ls-orb-1{width:600px;height:600px;background:radial-gradient(circle,rgba(0,210,170,0.14) 0%,transparent 65%);top:-180px;left:-160px;animation:drift1 16s ease-in-out infinite alternate;}
.ls-orb-2{width:500px;height:500px;background:radial-gradient(circle,rgba(0,100,200,0.1) 0%,transparent 65%);bottom:-160px;right:-120px;animation:drift2 20s ease-in-out infinite alternate;}
.ls-orb-3{width:400px;height:400px;background:radial-gradient(circle,rgba(0,210,170,0.08) 0%,transparent 65%);top:50%;left:50%;transform:translate(-50%,-50%);animation:lsPulse 5s ease-in-out infinite;}
@keyframes lsPulse{0%,100%{opacity:0.5;transform:translate(-50%,-50%) scale(0.9);}50%{opacity:1;transform:translate(-50%,-50%) scale(1.15);}}

/* Grid dots */
.ls-grid{position:absolute;inset:0;pointer-events:none;opacity:0.04;
  background-image:radial-gradient(circle,rgba(0,210,170,0.8) 1px,transparent 1px);
  background-size:40px 40px;}

/* Scan line moving across grid */
.ls-scanline{
  position:absolute;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent 0%,rgba(0,210,170,0.0) 10%,rgba(0,210,170,0.6) 50%,rgba(0,210,170,0.0) 90%,transparent 100%);
  animation:scanDown 3s ease-in-out infinite;
  pointer-events:none;
}
@keyframes scanDown{0%{top:10%;opacity:0;}10%{opacity:1;}90%{opacity:1;}100%{top:90%;opacity:0;}}

/* Ring system */
.ls-rings{position:relative;width:200px;height:200px;margin-bottom:3rem;flex-shrink:0;}
.ls-ring{position:absolute;border-radius:50%;border-style:solid;}
.ls-ring-1{
  inset:0;border-width:1px;
  border-color:rgba(0,210,170,0.08) rgba(0,210,170,0.08) rgba(0,210,170,0.08) rgba(0,210,170,0.5);
  animation:spinCW 2.8s linear infinite;
}
.ls-ring-2{
  inset:20px;border-width:1px;
  border-color:rgba(0,210,170,0.15) rgba(0,210,170,0.04) rgba(0,210,170,0.15) rgba(0,210,170,0.04);
  animation:spinCCW 2s linear infinite;
}
.ls-ring-3{
  inset:40px;border-width:0.5px;
  border-color:rgba(0,210,170,0.06) rgba(0,210,170,0.06) rgba(0,210,170,0.06) rgba(0,210,170,0.35);
  animation:spinCW 1.4s linear infinite;
}
@keyframes spinCW{to{transform:rotate(360deg);}}
@keyframes spinCCW{to{transform:rotate(-360deg);}}

/* Doc icon in center */
.ls-center{
  position:absolute;inset:60px;
  border-radius:12px;
  display:flex;align-items:center;justify-content:center;
  background:rgba(0,210,170,0.04);
  border:0.5px solid rgba(0,210,170,0.12);
  overflow:hidden;
}
.ls-center svg{width:30px;height:30px;stroke:var(--teal);opacity:0.7;}
.ls-doc-scan{
  position:absolute;left:0;right:0;height:1.5px;top:20%;
  background:linear-gradient(90deg,transparent,rgba(0,210,170,0.7),transparent);
  animation:docScan 1.8s ease-in-out infinite;
}
@keyframes docScan{0%{top:15%;opacity:0;}15%{opacity:1;}85%{opacity:1;}100%{top:85%;opacity:0;}}

/* Text section */
.ls-text{text-align:center;position:relative;z-index:2;}
.ls-phase{
  font-family:var(--mono);font-size:0.68rem;letter-spacing:0.18em;
  text-transform:uppercase;color:var(--teal);opacity:0.7;
  margin-bottom:0.7rem;
}
.ls-msg{
  font-family:var(--serif);font-size:1.75rem;color:var(--text);
  height:2.2rem;overflow:hidden;position:relative;
}
.ls-msg-inner{
  display:flex;flex-direction:column;
  transition:transform 0.55s cubic-bezier(0.4,0,0.2,1);
}
.ls-msg-item{height:2.2rem;line-height:2.2rem;white-space:nowrap;}

/* Progress bar */
.ls-prog-wrap{margin-top:2.5rem;width:260px;position:relative;z-index:2;}
.ls-prog-label{display:flex;justify-content:space-between;margin-bottom:6px;}
.ls-prog-l{font-family:var(--mono);font-size:0.62rem;letter-spacing:0.1em;color:var(--text-dim);text-transform:uppercase;}
.ls-prog-track{height:1.5px;background:rgba(255,255,255,0.05);border-radius:2px;overflow:hidden;}
.ls-prog-fill{height:100%;background:linear-gradient(90deg,transparent,var(--teal),rgba(0,210,170,0.4));width:40%;animation:sweep 2.2s ease-in-out infinite;}
@keyframes sweep{0%{transform:translateX(-150%);}100%{transform:translateX(350%);}}

/* Particles */
.ls-particle{position:absolute;width:2px;height:2px;border-radius:50%;background:rgba(0,210,170,0.5);animation:floatUp linear infinite;}
@keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:0.6;}100%{transform:translateY(-120px) scale(0);opacity:0;}}

@keyframes spin{to{transform:rotate(360deg);}}

.results{animation:fadeUp 0.6s ease;}
.r-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2.5rem;padding-bottom:1.2rem;border-bottom:0.5px solid var(--border);gap:1rem;flex-wrap:wrap;}
.r-label{font-family:var(--mono);font-size:0.65rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--teal);margin-bottom:0.35rem;opacity:0.7;}
.r-name{font-family:var(--serif);font-size:1.65rem;font-style:italic;color:var(--text);}
.chips{display:flex;gap:7px;flex-wrap:wrap;}
.chip{font-family:var(--mono);font-size:0.67rem;padding:4px 10px;border:0.5px solid var(--border);border-radius:20px;color:var(--text-muted);letter-spacing:0.04em;}
.chip.hi{border-color:rgba(0,210,170,0.28);color:var(--teal);}

.card{background:var(--surface);border:0.5px solid var(--border);border-radius:14px;padding:1.5rem 1.75rem;margin-bottom:1.2rem;position:relative;overflow:hidden;transition:border-color 0.3s,box-shadow 0.3s;}
.card:hover{border-color:rgba(0,210,170,0.14);box-shadow:0 0 40px rgba(0,210,170,0.04) inset, 0 4px 32px rgba(0,0,0,0.3);}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,210,170,0.15),transparent);}
.c-label{font-family:var(--mono);font-size:0.63rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-dim);margin-bottom:0.9rem;display:flex;align-items:center;gap:8px;}
.c-label::before{content:'';display:inline-block;width:14px;height:1px;background:var(--teal);opacity:0.35;}
.sum-body{font-family:var(--serif);font-size:1.12rem;line-height:1.88;color:rgba(220,232,228,0.82);}

.pts{list-style:none;display:flex;flex-direction:column;gap:0.55rem;}
.pt{display:flex;gap:11px;align-items:flex-start;padding:0.75rem 1rem;border-radius:8px;background:rgba(255,255,255,0.015);border:0.5px solid rgba(255,255,255,0.04);font-size:0.87rem;color:rgba(220,232,228,0.72);line-height:1.6;transition:border-color 0.2s,background 0.2s;animation:slideIn 0.4s ease both;}
.pt:hover{background:rgba(0,210,170,0.04);border-color:rgba(0,210,170,0.14);}
.pt-n{font-family:var(--mono);font-size:0.62rem;color:var(--teal);opacity:0.55;margin-top:3px;flex-shrink:0;min-width:16px;}

.acts{display:flex;flex-direction:column;gap:0.55rem;}
.act{display:flex;gap:12px;align-items:flex-start;padding:0.7rem 1rem;background:rgba(0,210,170,0.04);border:0.5px solid rgba(0,210,170,0.11);border-radius:8px;font-size:0.87rem;color:rgba(220,232,228,0.72);line-height:1.55;animation:slideIn 0.4s ease both;}
.act-box{width:14px;height:14px;border:1.5px solid rgba(0,210,170,0.3);border-radius:3px;flex-shrink:0;margin-top:2px;}

.tags{display:flex;flex-wrap:wrap;gap:7px;}
.tag{padding:5px 13px;background:rgba(255,255,255,0.025);border:0.5px solid rgba(255,255,255,0.06);border-radius:20px;font-family:var(--mono);font-size:0.72rem;color:rgba(220,232,228,0.42);transition:all 0.2s;cursor:default;}
.tag:hover{border-color:rgba(0,210,170,0.28);color:var(--teal);}

.grid2{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;margin-bottom:1.2rem;}
@media(max-width:580px){.grid2{grid-template-columns:1fr;}}

.tone-row{display:flex;align-items:center;gap:10px;}
.tone-dot{width:9px;height:9px;border-radius:50%;background:var(--teal);box-shadow:0 0 0 0 rgba(0,210,170,0.4);animation:toneRing 2s ease-out infinite;}
@keyframes toneRing{0%{box-shadow:0 0 0 0 rgba(0,210,170,0.4);}70%{box-shadow:0 0 0 8px rgba(0,210,170,0);}100%{box-shadow:0 0 0 0 rgba(0,210,170,0);}}
.tone-val{font-family:var(--serif);font-size:1.1rem;color:var(--text);}

.err{background:rgba(200,60,60,0.06);border:0.5px solid rgba(200,60,60,0.18);border-radius:10px;padding:1rem 1.25rem;color:rgba(255,155,145,0.85);font-size:0.88rem;margin-bottom:1.5rem;}

@keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
@keyframes slideIn{from{opacity:0;transform:translateX(-8px);}to{opacity:1;transform:translateX(0);}}
`;

const MODES = [
  { id: "standard", label: "Standard" },
  { id: "bullets", label: "Bullets" },
  { id: "academic", label: "Academic" },
];

const SYS = `You are an expert notes analyst. Return ONLY a valid JSON object with NO markdown fences or preamble:
{
  "summary": "2-4 sentence paragraph capturing core essence",
  "keyPoints": ["insight 1","insight 2","insight 3","insight 4"],
  "actionItems": ["action 1","action 2"],
  "keywords": ["term1","term2","term3","term4","term5","term6"],
  "tone": "Technical | Casual | Academic | Professional | Creative | Journalistic",
  "wordCount": 123
}
keyPoints = 3-6 insights; actionItems = tasks found (empty array if none, max 5); keywords = 5-8 topics; wordCount = approximate count.`;

function modeHint(m) {
  if (m === "bullets") return "Keep summary to 1 sentence. Bullet points under 10 words each.";
  if (m === "academic") return "Use formal academic register. Emphasize methodology, findings, theoretical significance.";
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

export default function App() {
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [mode, setMode] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  const handleFile = useCallback(async (f) => {
    setError(null);
    try {
      const data = await readFile(f);
      setFile(f); setFileData(data); setNotes(""); setResult(null);
    } catch (e) { setError(e.message); }
  }, []);

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const removeFile = () => { setFile(null); setFileData(null); setResult(null); };

  const canGo = !loading && (file || notes.trim().length > 20);

  const summarize = async () => {
    setLoading(true); setResult(null); setError(null);
    try {
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const groqKey = import.meta.env.VITE_GROQ_API_KEY;
      const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      
      const isGemini = !!geminiKey;
      const isGroq = !isGemini && !!groqKey;
      const apiKey = geminiKey || groqKey || anthropicKey;

      if (!apiKey) throw new Error("API key missing. Please add VITE_GEMINI_API_KEY, VITE_GROQ_API_KEY, or VITE_ANTHROPIC_API_KEY to your .env file.");

      let userContent;
      let geminiParts = [];

      if (fileData?.type === "pdf") {
        if (isGroq) {
          throw new Error("Groq does not support direct PDF upload. Please use Gemini or Anthropic for PDFs instead.");
        }
        if (isGemini) {
          geminiParts = [
            { inlineData: { mimeType: "application/pdf", data: fileData.content } },
            { text: `Mode: ${modeHint(mode)}\n\nSummarize the document above.` }
          ];
        } else {
          userContent = [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: fileData.content } },
            { type: "text", text: `Mode: ${modeHint(mode)}\n\nSummarize the document above.` },
          ];
        }
      } else {
        const text = fileData?.content || notes.trim();
        if (isGemini) {
          geminiParts = [{ text: `Mode: ${modeHint(mode)}\n\nNotes:\n\n${text}` }];
        } else {
          userContent = `Mode: ${modeHint(mode)}\n\nNotes:\n\n${text}`;
        }
      }

      let res;
      if (isGemini) {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYS }] },
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
              { role: "system", content: SYS },
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
            max_tokens: 1000,
            system: SYS,
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

      setResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch (err) { setError(err.message || "Analysis failed. Please try again."); }
    finally { setLoading(false); }
  };

  const clear = () => { setNotes(""); removeFile(); setResult(null); setError(null); };

  const [msgIdx, setMsgIdx] = useState(0);
  const MSGS = ["Parsing structure","Reading document","Extracting key ideas","Identifying themes","Spotting action items","Distilling insights","Composing summary","Almost there"];
  useEffect(() => {
    if (!loading) { setMsgIdx(0); return; }
    const t = setInterval(() => setMsgIdx(i => (i + 1) % MSGS.length), 1800);
    return () => clearInterval(t);
  }, [loading]);
  const PARTICLES = Array.from({length:14},(_,i)=>({
    left:`${4+i*6.8}%`, bottom:`${5+(i%5)*8}%`,
    dur:`${2.5+(i%4)*0.9}s`, del:`${i*0.38}s`,
  }));

  return (
    <>
      <style>{CSS}</style>
      <div className="root">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        <div className="grain" />
        <div className="page">

          <header className="header">
            <div className="eyebrow">Intelligence Layer · AI Powered</div>
            <h1 className="h-title">Notes, <em>distilled.</em></h1>
            <p className="h-sub">Upload a document or paste text — get a precise summary, key insights, and action items instantly.</p>
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

          {error && <div className="err">{error}</div>}

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

              <div className="card">
                <div className="c-label">Summary</div>
                <p className="sum-body">{result.summary}</p>
              </div>

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

                <div style={{display:"flex",flexDirection:"column",gap:"1.2rem"}}>
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
            </div>
          )}
        </div>

        {/* Full-screen loading overlay */}
        {loading && (
          <div className="ls-overlay">
            <div className="ls-orb ls-orb-1" />
            <div className="ls-orb ls-orb-2" />
            <div className="ls-orb ls-orb-3" />
            <div className="ls-grid" />
            <div className="ls-scanline" />

            {PARTICLES.map((p,i) => (
              <div key={i} className="ls-particle" style={{
                left:p.left, bottom:p.bottom,
                animation:`floatUp ${p.dur} ${p.del} ease-out infinite`,
              }} />
            ))}

            <div className="ls-rings">
              <div className="ls-ring ls-ring-1" />
              <div className="ls-ring ls-ring-2" />
              <div className="ls-ring ls-ring-3" />
              <div className="ls-center">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="8" y1="13" x2="16" y2="13"/>
                  <line x1="8" y1="17" x2="13" y2="17"/>
                </svg>
                <div className="ls-doc-scan" />
              </div>
            </div>

            <div className="ls-text">
              <div className="ls-phase">AI · Intelligence Layer</div>
              <div className="ls-msg">
                <div className="ls-msg-inner" style={{transform:`translateY(-${msgIdx * 2.2}rem)`}}>
                  {MSGS.map((m,i) => (
                    <div key={i} className="ls-msg-item">{m}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ls-prog-wrap">
              <div className="ls-prog-label">
                <span className="ls-prog-l">Processing</span>
                <span className="ls-prog-l" style={{color:"var(--teal)",opacity:0.6}}>{file?.name?.split(".").pop().toUpperCase() || "TEXT"}</span>
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
