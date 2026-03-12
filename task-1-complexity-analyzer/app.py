"""
Smart Code Complexity Analyzer – Flask Backend
Serves the frontend and provides API endpoints for code analysis.
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from analyzer import analyze_code, compare_code
from datetime import datetime
import os

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

# In-memory analysis history
analysis_history = []


# ─── Serve Frontend ───────────────────────────────────────────────────────────


@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(app.static_folder, path)


# ─── API Endpoints ────────────────────────────────────────────────────────────


@app.route("/api/analyze", methods=["POST"])
def api_analyze():
    """Analyze code complexity."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    code = data.get("code", "")
    language = data.get("language", "python")

    result = analyze_code(code, language)
    result_dict = result.to_dict()

    # Save to history
    entry = {
        "id": len(analysis_history) + 1,
        "code": code[:200] + ("..." if len(code) > 200 else ""),
        "language": language,
        "complexity": result_dict["complexity"],
        "explanation": result_dict["explanation"],
        "timestamp": datetime.now().isoformat(),
    }
    analysis_history.insert(0, entry)

    # Keep only last 50 entries
    if len(analysis_history) > 50:
        analysis_history.pop()

    return jsonify(result_dict)


@app.route("/api/history", methods=["GET"])
def api_history():
    """Return analysis history."""
    return jsonify(analysis_history)


@app.route("/api/history/clear", methods=["POST"])
def api_clear_history():
    """Clear analysis history."""
    analysis_history.clear()
    return jsonify({"message": "History cleared"})


@app.route("/api/compare", methods=["POST"])
def api_compare():
    """Compare complexity of two code snippets."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400

    code1 = data.get("code1", "")
    lang1 = data.get("language1", "python")
    code2 = data.get("code2", "")
    lang2 = data.get("language2", "python")

    result = compare_code(code1, lang1, code2, lang2)
    return jsonify(result)


# ─── Run Server ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("\n  Smart Code Complexity Analyzer")
    print("  --------------------------------")
    print("  Server running at: http://localhost:5000")
    print("  Press Ctrl+C to stop\n")
    app.run(debug=True, host="0.0.0.0", port=5000)
