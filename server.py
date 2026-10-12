#!/usr/bin/env python3
"""
Principles of Field Spectroscopy - MSc Course Platform
Standalone Python Offline & Web Server

Zero-dependency Python 3 HTTP server with Single Page Application (SPA) routing,
static asset streaming, and optional Gemini AI Tutor proxy.

Usage:
    python server.py
    python server.py --port 8080
    python server.py --host 0.0.0.0 --port 5000
"""

import os
import sys
import json
import socket
import argparse
import webbrowser
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.request
import urllib.error

# Resolve directory where dist/ exists
CURRENT_DIR = Path(__file__).resolve().parent
DIST_DIR = CURRENT_DIR / "dist" if (CURRENT_DIR / "dist").exists() else CURRENT_DIR

# Read environment variables from .env file if available (without external libraries)
def load_dotenv():
    env_file = CURRENT_DIR / ".env"
    if env_file.exists():
        try:
            with open(env_file, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, val = line.split("=", 1)
                        key = key.strip()
                        val = val.strip().strip("'\"")
                        if key not in os.environ:
                            os.environ[key] = val
        except Exception:
            pass

load_dotenv()

class SpectroscopySPARequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST_DIR), **kwargs)

    def end_headers(self):
        # Enable CORS and disable aggressive caching for local dev
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        # API Health Check Endpoint
        if self.path == "/api/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            response = {
                "status": "ok",
                "server": "Python Standalone SPA Server",
                "offline_ready": True,
                "has_gemini_key": bool(os.environ.get("GEMINI_API_KEY"))
            }
            self.wfile.write(json.dumps(response).encode("utf-8"))
            return

        # Check if the requested file actually exists in DIST_DIR
        clean_path = self.path.split("?")[0].lstrip("/")
        requested_file = DIST_DIR / clean_path

        # If it's a specific static file (like .js, .css, .svg, .png), let SimpleHTTPRequestHandler serve it
        if clean_path and requested_file.is_file():
            return super().do_GET()

        # For SPA client-side routes (or index), serve index.html
        index_file = DIST_DIR / "index.html"
        if index_file.is_file():
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            content = index_file.read_bytes()
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        else:
            self.send_error(404, f"Could not find index.html in {DIST_DIR}. Please run 'npm run build' first.")

    def do_POST(self):
        # API AI Tutor Endpoint
        if self.path == "/api/ai-tutor":
            content_length = int(self.headers.get("Content-Length", 0))
            body_bytes = self.rfile.read(content_length)
            
            try:
                body = json.loads(body_bytes.decode("utf-8"))
            except Exception:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Invalid JSON body"}).encode("utf-8"))
                return

            prompt = body.get("prompt", "")
            module_title = body.get("moduleTitle", "Principles of Field Spectroscopy")
            topic = body.get("topic", "General Field Radiometry")

            api_key = os.environ.get("GEMINI_API_KEY")
            
            # If no API key or offline, return an academically rigorous offline fallback
            if not api_key:
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                fallback_msg = (
                    f"### [Offline Academic Field Spectroscopy Assistant]\n\n"
                    f"**Context**: {module_title} — {topic}\n\n"
                    f"You are currently running the platform in **Offline Local Mode**. All 8 course modules, "
                    f"PROSPECT-D + 4SAIL Radiative Transfer Model simulations, empirical spectral libraries (USGS/CEOS), "
                    f"radiometric calibrations, sensor simulators, and field labs run **100% locally on your machine without internet**!\n\n"
                    f"To enable live Gemini AI reasoning for dynamic tutor questions:\n"
                    f"1. Set your Gemini API key in an environment variable: `export GEMINI_API_KEY=your_key` or in `.env`\n"
                    f"2. Restart this server (`python server.py`)\n\n"
                    f"**Quick Physics Reference for {topic}**:\n"
                    f"- **Radiative Transfer**: Canopy reflectance is governed by turbid medium scattering (4SAIL) and foliar absorption (PROSPECT-D).\n"
                    f"- **Reference Standard**: Calibrate using a 99% diffuse Spectralon (PTFE) panel under clear-sky conditions (solar zenith < 60°).\n"
                    f"- **Sensor Calibration**: Dark current subtraction and white reference optimization are mandatory before every target scan."
                )
                self.wfile.write(json.dumps({"text": fallback_msg}).encode("utf-8"))
                return

            # If API key is present, query Google Gemini REST API directly using standard urllib
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
                
                system_instruction = (
                    "You are a distinguished Senior Professor and Lead Research Scientist in Optical Field Spectroscopy "
                    "and Earth Observation for MSc students in Geo-information and Spatial Management. "
                    f"Course: 'Principles of Field Spectroscopy'. Current Module: {module_title} (Topic: {topic}). "
                    "Tone: Academically rigorous, physically precise, citing recognized equations (Planck, Beer-Lambert, Cosine law, BRDF/BRF), "
                    "standards (NERC FSF, Coblentz Society, CEOS WGCV), and instruments (ASD FieldSpec 4, SVC HR-1024i, Spectral Evolution PSR+)."
                )

                payload = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "systemInstruction": {"parts": [{"text": system_instruction}]}
                }

                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"}
                )

                with urllib.request.urlopen(req, timeout=30) as resp:
                    resp_data = json.loads(resp.read().decode("utf-8"))
                    candidates = resp_data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        text = "".join(p.get("text", "") for p in parts)
                    else:
                        text = "No response generated by the model."

                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"text": text}).encode("utf-8"))
                    return

            except Exception as e:
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                err_text = f"Offline fallback (AI Tutor API query failed: {str(e)}). Please verify internet connection or API key."
                self.wfile.write(json.dumps({"text": err_text}).encode("utf-8"))
                return

        self.send_error(404, "API route not found")


def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def main():
    parser = argparse.ArgumentParser(description="Principles of Field Spectroscopy - Standalone Python Offline Server")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind (default: 8000)")
    parser.add_argument("--no-browser", action="store_true", help="Do not open web browser automatically")
    args = parser.parse_args()

    if not (DIST_DIR / "index.html").exists():
        print("=" * 70)
        print("⚠️  WARNING: Compiled 'dist/index.html' not found!")
        print("To compile the static production frontend, run:")
        print("    npm run build")
        print("=" * 70)

    server_address = (args.host, args.port)
    httpd = HTTPServer(server_address, SpectroscopySPARequestHandler)

    local_ip = get_local_ip()
    local_url = f"http://localhost:{args.port}"
    lan_url = f"http://{local_ip}:{args.port}"

    print("=" * 70)
    print("🎓 PRINCIPLES OF FIELD SPECTROSCOPY — MSC PLATFORM")
    print("   Course GEO-MSc-704 | Department of Geo-Information")
    print("=" * 70)
    print(f"📦 Serving Directory: {DIST_DIR}")
    print(f"💻 Local PC Access:  {local_url}")
    if local_ip != "127.0.0.1":
        print(f"🌐 Local LAN Access: {lan_url} (Accessible to students on same WiFi)")
    print(f"🤖 Gemini API Status: {'Configured (Online)' if os.environ.get('GEMINI_API_KEY') else 'Offline Mode (Standalone)'}")
    print("=" * 70)
    print("🚀 Press Ctrl+C to terminate the server.\n")

    if not args.no_browser:
        try:
            webbrowser.open(local_url)
        except Exception:
            pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped successfully.")
        httpd.server_close()
        sys.exit(0)


if __name__ == "__main__":
    main()
