#!/usr/bin/env python3
"""
Principles of Field Spectroscopy - MSc Course Platform
Production Flask Web Application & Hosting Wrapper

Use this for hosting on platforms like:
- PythonAnywhere
- Render / Railway / Heroku
- AWS Elastic Beanstalk / DigitalOcean
- Gunicorn / uWSGI behind Nginx

Run with:
    pip install -r requirements.txt
    python app_flask.py
Or with gunicorn:
    gunicorn -w 4 -b 0.0.0.0:8000 app_flask:app
"""

import os
from pathlib import Path
from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load .env file
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DIST_DIR = BASE_DIR / "dist" if (BASE_DIR / "dist").exists() else BASE_DIR

app = Flask(__name__, static_folder=str(DIST_DIR / "assets"), static_url_path="/assets")
CORS(app)

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ok",
        "framework": "Flask Python",
        "offline_ready": True,
        "has_gemini_key": bool(os.getenv("GEMINI_API_KEY"))
    })

@app.route("/api/ai-tutor", methods=["POST"])
def ai_tutor():
    data = request.get_json(silent=True) or {}
    prompt = data.get("prompt", "")
    module_title = data.get("moduleTitle", "Principles of Field Spectroscopy")
    topic = data.get("topic", "General Field Radiometry")

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return jsonify({
            "text": (
                f"### [Offline Academic Assistant]\n\n"
                f"**Module**: {module_title} — {topic}\n\n"
                f"All course slides, PROSPECT-D + 4SAIL radiative transfer simulations, sensor models, "
                f"and laboratory exercises run client-side without internet. "
                f"To enable live AI dynamic questions, configure `GEMINI_API_KEY` on your Python server."
            )
        })

    # Query Gemini if key is provided
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        system_instruction = (
            "You are a distinguished Senior Professor in Optical Field Spectroscopy and Earth Observation "
            f"for MSc students. Course: 'Principles of Field Spectroscopy'. Current Module: {module_title} ({topic}). "
            "Tone: Academically rigorous, physically precise, citing Planck, Beer-Lambert, ASD FieldSpec standards."
        )
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={"system_instruction": system_instruction}
        )
        return jsonify({"text": response.text})
    except Exception as e:
        # Fallback to direct REST if google-genai package is not installed
        try:
            import urllib.request
            import json
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "systemInstruction": {"parts": [{"text": f"Senior Professor in Field Spectroscopy: {module_title} - {topic}"}]}
            }
            req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                res_data = json.loads(resp.read().decode("utf-8"))
                text = res_data["candidates"][0]["content"]["parts"][0]["text"]
                return jsonify({"text": text})
        except Exception as inner_e:
            return jsonify({"text": f"AI Tutor query unavailable ({str(inner_e)}). Local course modules remain fully operational."})

# Serve root index.html
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_spa(path):
    if path and (DIST_DIR / path).is_file():
        return send_from_directory(str(DIST_DIR), path)
    return send_from_directory(str(DIST_DIR), "index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Serving Field Spectroscopy Course on http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
