# Principles of Field Spectroscopy (GEO-MSc-704)
## Offline Deployment & Python Web Hosting Guide

This guide explains how to run this full course and laboratory platform **100% offline on your PC** or **host it as a website using Python**.

---

## ⚡ Option 1: Run 100% Offline on your PC (Zero Dependencies)

The entire course platform—including the PROSPECT-D + 4SAIL Radiative Transfer simulation engine, ASD FieldSpec calibrations, 8 lecture decks (240+ slides), sensor simulators, spectral libraries, and student quizzes—executes completely client-side in the web browser. No internet connection is required.

### Requirements:
- Any standard computer (Windows, macOS, or Linux)
- Python 3.8+ installed ([Download Python](https://www.python.org/downloads/))

### Steps:
1. Extract the downloaded package.
2. Launch the server:
   - **On Windows**: Double-click `run_offline.bat`
   - **On macOS / Linux**: Open Terminal and run `./run_offline.sh` or `python3 server.py`
3. Your default web browser will automatically open to:
   ```text
   http://localhost:8000
   ```
4. Everything is ready! You can disconnect your WiFi / internet and explore all modules, run radiative transfer models, and complete field exercises offline.

---

## 🌐 Option 2: Host as a Local Classroom / Lab Website (LAN)

If you are teaching a field spectroscopy course or workshop and want all students in your computer lab or field tent to access the course from your laptop:

1. Connect your laptop and student devices to the same local WiFi network (or mobile hotspot—no internet required!).
2. Start the server on your computer:
   ```bash
   python server.py --host 0.0.0.0 --port 8000
   ```
3. The server terminal will print your Local Area Network (LAN) IP, for example:
   ```text
   Local LAN Access: http://192.168.1.45:8000
   ```
4. Any student on the same network can type `http://192.168.1.45:8000` into their tablet, laptop, or phone to access the full course platform simultaneously!

---

## 🚀 Option 3: Host as a Public Website with Python (Flask / Gunicorn)

To host the application on a public web server or cloud platform (PythonAnywhere, Render, Railway, Heroku, AWS, or your university server):

### 1. Install Python Dependencies:
```bash
pip install -r requirements.txt
```

### 2. Run locally with Flask:
```bash
python app_flask.py
```

### 3. Run in Production with Gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:8000 app_flask:app
```

---

## ☁️ Cloud Deployment Recipes

### A. Deploy to PythonAnywhere (Free / Low-Cost Python Hosting)
1. Sign up at [PythonAnywhere](https://www.pythonanywhere.com/).
2. Open a Bash console and upload your files (or `git clone`).
3. Under the **Web** tab:
   - Create a **Manual configuration (Python 3.10+)** app.
   - Set **Source code** to `/home/yourusername/field-spectroscopy`.
   - Set **Working directory** to `/home/yourusername/field-spectroscopy`.
   - In the **WSGI configuration file**, replace the contents with:
     ```python
     import sys
     path = '/home/yourusername/field-spectroscopy'
     if path not in sys.path:
         sys.path.append(path)
     from app_flask import app as application
     ```
4. Click **Reload yourusername.pythonanywhere.com** and your site is live!

### B. Deploy to Render / Railway
1. Push your repository to GitHub.
2. In Render or Railway, create a new **Web Service** connected to your repo.
3. Configure the build and start commands:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app_flask:app`
4. The service will build and provide a public HTTPS URL.

---

## 🤖 Optional: Enabling the Live AI Tutor

The AI Research Tutor can provide dynamic graduate-level explanations if an API key is supplied:

1. Obtain a free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/).
2. Add it to a `.env` file in the project folder:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Restart `server.py` or `app_flask.py`. The AI Tutor will automatically activate.
*(If no API key is supplied, the platform runs in complete offline mode with built-in physics references).*

---

## 🛠 Rebuilding Frontend Assets (For Developers)

If you modify any React components or data files in `src/`:
```bash
# Install node dependencies
npm install

# Build static production bundle into dist/
npm run build

# Package offline ZIP bundle
python export_offline_package.py
```

---

## 📋 Offline Feature Compatibility Matrix

| Feature | Offline Status | Notes |
| :--- | :--- | :--- |
| **8 Course Modules & 240+ Slides** | ✅ 100% Offline | Pre-compiled JSON data |
| **Interactive PROSPECT-D + 4SAIL Simulator** | ✅ 100% Offline | Real-time JS physics engine |
| **RTM Environmental Scenarios & Overlay** | ✅ 100% Offline | Real-time simulation & spline |
| **ASD FieldSpec Sensor Calibration** | ✅ 100% Offline | Client-side radiometric calibration |
| **Spectral Library (USGS / CEOS)** | ✅ 100% Offline | Embedded laboratory signatures |
| **Interactive MSc Quizzes & Scoring** | ✅ 100% Offline | Local evaluation engine |
| **Formula Calculator (KaTeX Math)** | ✅ 100% Offline | Bundled CSS & fonts |
| **CSV / PDF Data Export** | ✅ 100% Offline | Generated in-browser (Blob/jsPDF) |
| **AI Dynamic Research Tutor** | ⚠️ Needs API Key | Shows offline guide when disconnected |
