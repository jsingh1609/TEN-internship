# ⚡ Smart Code Complexity Analyzer

A full-stack web tool that analyzes source code and estimates its **Big-O time complexity** using Python AST parsing and regex-based pattern matching. Paste your code and get instant complexity estimates with clear explanations.

![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-3.0-green?logo=flask)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- **Automatic Complexity Detection** – Detects loops, nested loops, recursion, divide-and-conquer, and logarithmic patterns
- **7 Language Support** – Python, Java, C++, JavaScript, Go, Ruby, Rust
- **Visual Complexity Scale** – Animated bar chart showing O(1) through O(2ⁿ)
- **Code Comparison** – Compare two code snippets side-by-side
- **Analysis History** – Track and review past analyses
- **Sample Code Snippets** – Try pre-built examples for each complexity class
- **Premium Dark UI** – Glassmorphism design with CodeMirror editor

## 🛠 Technology Stack

| Layer     | Technology           |
|-----------|---------------------|
| Frontend  | HTML, CSS, JavaScript |
| Editor    | CodeMirror 5         |
| Backend   | Python Flask         |
| Analysis  | Python AST + Regex   |

## 🚀 Setup & Run

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/task-1-complexity-analyzer.git
cd task-1-complexity-analyzer

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the server
python app.py
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

## 📖 How It Works

### Python Analysis (AST-based)
- Parses code into an Abstract Syntax Tree
- Walks the tree to detect `for`, `while` loops and nesting depth
- Identifies recursive function calls
- Detects divide-and-conquer patterns (e.g., merge sort)
- Recognizes logarithmic patterns (halving/doubling in while loops)

### Java / C++ / JavaScript / Go / Ruby / Rust (Regex-based)
- Removes comments based on language syntax
- Uses regex to find loop constructs (`for`, `while`, iterators)
- Detects function definitions and self-calls (recursion)
- Identifies sorting function calls
- Estimates nesting depth via bracket/keyword tracking

## 📊 Supported Complexity Classes

| Complexity | Example Pattern                |
|-----------|-------------------------------|
| O(1)      | No loops, no recursion         |
| O(log n)  | Binary search                  |
| O(n)      | Single loop / linear recursion |
| O(n log n)| Merge sort / sort calls        |
| O(n²)     | Nested loops (2 levels)        |
| O(n³)     | Nested loops (3 levels)        |
| O(2ⁿ)     | Naive Fibonacci recursion      |

## 🗂 Project Structure

```
task-1-complexity-analyzer/
├── app.py              # Flask server & API endpoints
├── analyzer.py         # Complexity analysis engine
├── requirements.txt    # Python dependencies
├── README.md           # Project documentation
└── static/
    ├── index.html      # Single-page application
    ├── styles.css      # Dark glassmorphism theme
    └── app.js          # Frontend logic & API integration
```

## 📡 API Endpoints

| Method | Endpoint            | Description                       |
|--------|--------------------|------------------------------------|
| POST   | `/api/analyze`     | Analyze code complexity            |
| GET    | `/api/history`     | Get analysis history               |
| POST   | `/api/history/clear` | Clear analysis history           |
| POST   | `/api/compare`     | Compare two code snippets          |

### Example Request

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"code": "for i in range(n):\n    for j in range(n):\n        print(i, j)", "language": "python"}'
```

### Example Response

```json
{
  "complexity": "O(n²)",
  "explanation": "The code contains two levels of nested loops...",
  "details": {
    "loops_found": 2,
    "max_nesting_depth": 2,
    "recursions_found": 0
  }
}
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
