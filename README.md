# Field Spectroscopy MSc: Optical Physics & Radiative Transfer Modeling

[![Deploy to GitHub Pages](https://github.com/actions/workflows/deploy.yml/badge.svg)](https://github.com)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A graduate-level interactive learning and laboratory platform for **Field Spectroscopy, Radiometry, and Canopy Radiative Transfer Modeling (PROSAIL)**. 

Designed for MSc remote sensing courses, research stations, field validation campaigns, and offline university lab environments.

---

## 🌟 Key Features

- **8 Rigorous Academic Modules**: Covering optical physics, radiometry, point spectroradiometers (ASD, Spectral Evolution, SVC), dark current & stray light calibration, field QA/QC protocols, UAV imaging spectroscopy, spectral preprocessing (continuum removal, derivatives), and PROSAIL radiative transfer inversion.
- **240 Master Lecture Slides**: Full curriculum with mathematical derivations, LaTeX formulas, and field protocols.
- **Ready-to-Use PowerPoint Decks (`.pptx`)**: All 8 individual module presentations plus the master 240-slide course deck in `/slides_pptx`.
- **4 Interactive Scientific Laboratories**:
  - **PROSAIL RTM Simulator**: Real-time canopy reflectance modeling with chlorophyll ($C_{ab}$), leaf area index ($LAI$), leaf angle distribution ($LIDF$), and soil moisture variations.
  - **Sensor Calibration & Noise Simulator**: Dark current subtraction, stray light deconvolution, temperature drift, and SNR trade-offs.
  - **Spectra Explorer & Library**: Ingestion and visualization of ASD spectral files, vegetation, soils, and reference panels.
  - **Field Protocol QA/QC & Solar Geometry Engine**: Sun angle calculation, panel contamination detection, and cloud transit warnings.
- **Export & Offline Features**:
  - Complete client-side and server-side PDF generator (with support for modern color standards).
  - Standalone offline deployment bundle with zero internet dependencies.
  - Native Python WSGI/Flask integration ready for PythonAnywhere, Ubuntu VPS, or local LAN hubs.

---

## 🚀 How to Put This Project on GitHub

### Option A: Push This Repository to Your GitHub Account

1. Create a new repository on [GitHub](https://github.com/new) (e.g. named `field-spectroscopy-msc`). Do **not** initialize it with a README or .gitignore (this project already includes them).
2. Open your terminal in this project directory and run:

```bash
# Add your GitHub repository as the remote
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/field-spectroscopy-msc.git

# Ensure the main branch is selected
git branch -M main

# Push the entire codebase, slide decks, and offline package
git push -u origin main
```

### Option B: Deploy Free 24/7 on GitHub Pages

This repository includes an automated GitHub Actions deployment workflow (`.github/workflows/deploy.yml`):

1. Push your code to GitHub following the steps above.
2. In your GitHub repository, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The workflow will automatically run, build the MSc platform, and publish it to:
   `https://<YOUR-GITHUB-USERNAME>.github.io/field-spectroscopy-msc/`

---

## 🐍 Deploying to PythonAnywhere via GitHub

Instead of uploading files manually, you can clone this repository directly in PythonAnywhere:

1. Open your **Bash Console** in [PythonAnywhere](https://www.pythonanywhere.com/user/Abdelmajeed/consoles/).
2. Clone your repository:
   ```bash
   git clone https://github.com/<YOUR-GITHUB-USERNAME>/field-spectroscopy-msc.git
   cd field-spectroscopy-msc
   ```
3. Install the lightweight Python dependencies:
   ```bash
   pip install --user -r requirements.txt
   ```
4. In the PythonAnywhere **Web** tab (`abdelmajeed.pythonanywhere.com`):
   - Set **Source code**: `/home/Abdelmajeed/field-spectroscopy-msc`
   - Set **Working directory**: `/home/Abdelmajeed/field-spectroscopy-msc`
   - Edit the **WSGI configuration file** to point to Flask:
     ```python
     import sys
     path = '/home/Abdelmajeed/field-spectroscopy-msc'
     if path not in sys.path:
         sys.path.append(path)

     from app_flask import app as application
     ```
5. Click **Reload abdelmajeed.pythonanywhere.com** — your site is now live!

---

## 💻 Local & Offline Usage (Zero Internet Required)

### On Windows
Double-click `run_offline.bat` or run:
```cmd
run_offline.bat
```

### On macOS / Linux
```bash
chmod +x run_offline.sh
./run_offline.sh
```

### Using Python Standard Library
No external pip packages required:
```bash
python3 server.py
```
Open your browser at `http://localhost:8000`.

---

## 📊 Presentation Decks Included

All PowerPoint presentations are pre-generated with 16:9 widescreen layout and high-contrast styling in the `slides_pptx/` folder:

1. `Module_1_Optical_Physics___Radiometry.pptx`
2. `Module_2_Point_Spectroradiometers.pptx`
3. `Module_3_Calibration___Radiometric_Validation.pptx`
4. `Module_4_Field_Protocols___Sampling_Geometry.pptx`
5. `Module_5_UAV_Imaging_Spectroscopy.pptx`
6. `Module_6_Spectral_Preprocessing___Feature_Extraction.pptx`
7. `Module_7_Radiative_Transfer_Modeling___PROSAIL.pptx`
8. `Module_8_Spectral_Databases___Capstone.pptx`
9. `Principles_of_Field_Spectroscopy_All_Modules_1_to_8.pptx` *(Complete 240-slide Master Deck)*

---

## 🛠️ Development

To develop or modify the web application:

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Lint and typecheck
npm run lint

# Build for production
npm run build
```

---

## 📄 License

This educational platform and associated course materials are provided under the MIT License.
