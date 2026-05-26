import { JSDOM } from "jsdom";

function sanitizeNodeLabels(line) {
  const t = line.trim();
  if (!t || /^(graph\s|flowchart\s|%%|end$|style\s|classDef\s|click\s|linkStyle\s|direction\s)/i.test(t)) {
    return line;
  }

  let result = '';
  let i = 0;
  while (i < line.length) {
    const match = line.slice(i).match(/^([A-Za-z0-9_]+)(\(\(|\(|\[|\{)/);
    if (match) {
      const nodeId = match[1];
      const openDelim = match[2];
      i += nodeId.length + openDelim.length;

      let closeDelim = '';
      if (openDelim === '((') closeDelim = '))';
      else if (openDelim === '(') closeDelim = ')';
      else if (openDelim === '[') closeDelim = ']';
      else if (openDelim === '{') closeDelim = '}';

      let depth = 1;
      let labelStart = i;
      let labelEnd = i;
      while (i < line.length) {
        if (openDelim === '((' && line.startsWith('))', i)) {
          depth--;
          if (depth === 0) {
            labelEnd = i;
            i += 2;
            break;
          }
          i++;
        } else if (openDelim === '(' && line[i] === '(') {
          depth++;
          i++;
        } else if (openDelim === '(' && line[i] === ')') {
          depth--;
          if (depth === 0) {
            labelEnd = i;
            i++;
            break;
          }
          i++;
        } else if (openDelim === '[' && line[i] === '[') {
          depth++;
          i++;
        } else if (openDelim === '[' && line[i] === ']') {
          depth--;
          if (depth === 0) {
            labelEnd = i;
            i++;
            break;
          }
          i++;
        } else if (openDelim === '{' && line[i] === '{') {
          depth++;
          i++;
        } else if (openDelim === '{' && line[i] === '}') {
          depth--;
          if (depth === 0) {
            labelEnd = i;
            i++;
            break;
          }
          i++;
        } else {
          i++;
        }
      }

      let label = line.slice(labelStart, labelEnd);
      if (label.startsWith('"') && label.endsWith('"')) {
        label = label.slice(1, -1);
      }
      const cleanLabel = label.replace(/"/g, "'");
      result += `${nodeId}${openDelim}"${cleanLabel}"${closeDelim}`;
    } else {
      result += line[i];
      i++;
    }
  }
  return result;
}

function sanitizeMermaid(code) {
  return code.split('\n').map(sanitizeNodeLabels).join('\n');
}

async function run() {
  const dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>', {
    url: "http://localhost",
    pretendToBeVisual: true
  });
  
  global.window = dom.window;
  global.document = dom.window.document;
  try {
    Object.defineProperty(global, 'navigator', {
      value: dom.window.navigator,
      configurable: true,
      writable: true
    });
  } catch (e) {}
  global.location = dom.window.location;
  global.CustomEvent = dom.window.CustomEvent;
  
  dom.window.HTMLCanvasElement.prototype.getContext = () => {
    return {
      measureText: (text) => ({ width: text.length * 10 })
    };
  };

  dom.window.SVGElement.prototype.getBBox = function() {
    return { x: 0, y: 0, width: 100, height: 30 };
  };

  const mermaid = (await import("mermaid")).default;
  
  mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    suppressErrorRendering: true
  });

  const chart = `mindmap
  root((Internship Project Report: "Vibe Coding Internship"))
    "Jasjeet Singh Babra"
      "PRN: 23030124128"
      "Program: BCA"
      "Institute: Symbiosis Institute of Computer Studies & Research"
    "Report Structure"
      "Index"
      "Declaration"
      "Acknowledgement"
      "Internship Details"
      "Introduction"
      "Company Overview"
      "Objectives & Scope"
      "Pre-Internship Knowledge"
      "Technologies & Tools Learned"
      "Work Performed During Internship"
        "Phase 1: Learning & Setup"
        "Phase 2: Project Development"
          "Project 1: Complexity Analyzer Web App"
          "Project 2: Rapid Prototype Interactive Web App"
          "Project 3: AI Idea Generator"
          "Project 4: Smart Study Planner"
          "Project 5: Social Media Clone App"
          "Project 6: Skills Recommendation System"
          "Project 7: House Price Prediction System"
          "Project 8: Smart Notes Summarizer"
      "Learning Outcomes"
      "Challenges Faced"
      "Conclusion"
      "References"
    "Key Stakeholders"
      "Symbiosis Institute"
        "Dr. Aniket Nagane (BCA Programme Head)"
      "The Entrepreneurship Network (TEN)"
        "Mr Akash Bandi (Mentor)"
        "Role: Vibe Coder Intern"
        "Duration: 05/03/2026 – 5/06/2026"
        "Location: Remote (Work from Home)"
    "Learned Technologies & Tools"
      "AI Tools"
        "Loveable (AI design-to-code)"
        "Luma (Visual AI design)"
        "Kimi (AI coding assistant)"
        "Claude (Advanced AI assistant)"
      "Development & Deployment Tools"
        "Replit (Cloud-based IDE)"
        "Antigravity IDE (Local dev env)"
        "GitHub (Version control/Repo)"
        "Git (Version control system)"
        "Vercel (Frontend Deployment)"
        "Render (Backend Deployment)"
      "Web Concepts & Frameworks"
        "HTML, CSS, JS"
        "React, Vite (Frontend)"
        "API Integration"
        "Deployment Workflows"
        "Responsive Design"
        "Full-Stack Development"
        "Python Backend Development"
    "Key Outcomes"
      "Practical Web Development Skills"
      "Portfolio of Real Projects"
      "Proficiency in AI-Assisted Development"
      "Professional Work Habits (Remote)"
      "Enhanced Problem-Solving Skills"
      "Understanding of Full-Stack Complexity"`;

  const sanitized = sanitizeMermaid(chart);
  console.log("SANITIZED CHART:\n", sanitized);

  try {
    const { svg } = await mermaid.render("mermaid-test-id", sanitized);
    console.log("SUCCESS RENDERING SVG LENGTH:", svg.length);
  } catch (err) {
    console.error("RENDER ERROR:", err);
  }
}

run().catch(console.error);
