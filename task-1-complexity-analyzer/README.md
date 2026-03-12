# ⚡ Smart Code Complexity Analyzer

An AI-powered tool that analyzes source code and estimates its **time complexity** automatically. Built as part of the **Ten Tech Vibe Coder Internship**.

![Complexity Analyzer](https://img.shields.io/badge/AI-Powered-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![Claude AI](https://img.shields.io/badge/Claude-Sonnet-8b5cf6?style=for-the-badge)

---

## 🚀 Features

- **AI-Powered Analysis** — Uses Claude Sonnet to detect loops, recursion, and nested patterns
- **10 Languages Supported** — Python, JavaScript, TypeScript, Java, C++, Rust, Go, Swift, Kotlin, Ruby
- **Complexity Detection** — Estimates O(1), O(log n), O(n), O(n log n), O(n²), O(n³), O(2ⁿ)
- **Detailed Breakdown** — Step-by-step explanation of why the complexity was assigned
- **Optimization Tips** — Suggests improvements for inefficient code
- **Sample Code Library** — Pre-loaded examples for every language
- **Analysis History** — Tracks your last 10 analyses
- **Clean Code Editor** — Line numbers, Tab indent support, character count

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (JSX) |
| Styling | Inline CSS + Google Fonts (Inter, IBM Plex Mono) |
| AI Backend | Anthropic Claude Sonnet API |
| Build Tool | Vite |

---

## 📦 Setup Instructions

### Prerequisites
- Node.js v18 or higher
- An Anthropic API key → [Get one here](https://console.anthropic.com)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/smart-complexity-analyzer.git
cd smart-complexity-analyzer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add your API key

Open `src/App.jsx` and find the fetch call to the Anthropic API. The project uses the API directly from the frontend for simplicity.

> ⚠️ For production, move the API call to a backend server to keep your key secure.

### 4. Run locally
```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
smart-complexity-analyzer/
├── src/
│   └── SmartComplexityAnalyzer.jsx   # Main app component
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎯 How to Use

1. **Select a language** from the left sidebar
2. **Paste your code** into the editor (or pick a sample from the Samples menu)
3. Click **Analyze Complexity**
4. View the **result panel** — complexity badge, explanation, breakdown, and tips
5. Check **History** tab to revisit past analyses

---

## 📊 Supported Complexities

| Complexity | Label | Performance |
|------------|-------|-------------|
| O(1) | Constant | 🚀 Best |
| O(log n) | Logarithmic | ✨ Excellent |
| O(n) | Linear | ⚡ Good |
| O(n log n) | Linearithmic | ⚠️ Fair |
| O(n²) | Quadratic | 🔥 Poor |
| O(n³) | Cubic | 💀 Very Poor |
| O(2ⁿ) | Exponential | ☠️ Worst |

---

## 🙌 Acknowledgements

- [Anthropic Claude](https://www.anthropic.com) — AI analysis engine
- [Ten Tech](https://tentech.in) — Internship project brief
- [Google Fonts](https://fonts.google.com) — Inter & IBM Plex Mono

---

## 📄 License

This project was built for educational purposes as part of an internship program.
