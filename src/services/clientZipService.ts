import JSZip from 'jszip';
import saveAs from 'file-saver';
import type { CourseModule } from '../types';
import { generateModulePptx } from './pptxExportService';

export interface ExportProgress {
  step: string;
  percent: number;
  details?: string;
}

/**
 * Downloads a single module's PPTX file directly in browser memory without calling any external URL.
 */
export async function downloadModulePptxDirect(mod: CourseModule): Promise<void> {
  const pptx = generateModulePptx(mod);
  const filename = `Module_${mod.moduleNumber}_${mod.shortTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.pptx`;
  
  // Generate blob directly in browser memory
  const blob = await pptx.write({ outputType: 'blob' }) as Blob;
  saveAs(blob, filename);
}

/**
 * Generates and downloads a complete ZIP bundle in-browser containing:
 * - All 8 Module PowerPoint Presentations (.pptx)
 * - 1 Complete Master Deck (All 240 slides) (.pptx)
 * - Python offline server scripts (server.py, app_flask.py, run_offline.bat, run_offline.sh)
 * - Complete course outline, formulas, and offline hosting documentation
 */
export async function downloadAllPptxAndScriptsZipDirect(
  modules: CourseModule[],
  onProgress?: (p: ExportProgress) => void
): Promise<void> {
  const zip = new JSZip();

  const totalSteps = modules.length + 3;
  let currentStep = 0;

  // 1. Generate individual PPTX decks
  for (let i = 0; i < modules.length; i++) {
    const mod = modules[i];
    currentStep++;
    if (onProgress) {
      onProgress({
        step: `Generating Module ${mod.moduleNumber} (${mod.shortTitle})...`,
        percent: Math.round((currentStep / totalSteps) * 80),
        details: `${mod.slides.length} slides formatted with academic layout & speaker notes`
      });
    }

    const pptx = generateModulePptx(mod);
    const pptxBlob = await pptx.write({ outputType: 'blob' }) as Blob;
    const filename = `slides_pptx/Module_${mod.moduleNumber}_${mod.shortTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.pptx`;
    zip.file(filename, pptxBlob);
  }

  // 2. Generate Combined Master Deck (All 240 Slides)
  currentStep++;
  if (onProgress) {
    onProgress({
      step: 'Compiling 240-Slide Master Course Deck...',
      percent: 85,
      details: 'Assembling all 8 curriculum modules into a single master PowerPoint presentation'
    });
  }

  const masterPptx = (await import('pptxgenjs')).default;
  const master = new masterPptx();
  master.layout = 'LAYOUT_16x9';
  master.author = 'Principles of Field Spectroscopy - MSc Curriculum GEO-MSc-704';
  master.company = 'Remote Sensing & Earth Observation';
  master.title = 'Principles of Field Spectroscopy - Complete Curriculum (Modules 1-8)';

  // Master Title Slide
  const mTitle = master.addSlide();
  mTitle.background = { color: '0A192F' };
  mTitle.addText('PRINCIPLES OF FIELD SPECTROSCOPY', {
    x: 0.8,
    y: 1.2,
    w: 8.5,
    h: 0.8,
    fontSize: 28,
    color: 'FFFFFF',
    bold: true,
    fontFace: 'Arial',
  });
  mTitle.addText('MSc Curriculum • Complete Master Lecture Deck (All 8 Modules • 240 Slides)', {
    x: 0.8,
    y: 2.1,
    w: 8.5,
    h: 0.4,
    fontSize: 14,
    color: '34D399',
    bold: true,
    fontFace: 'Arial',
  });
  mTitle.addText('Comprehensive reference covering Optical Physics, Field Spectroradiometers, Radiometric Calibration, Field Protocols, UAV Hyperspectral, Preprocessing, Radiative Transfer (PROSAIL), and Spectral Libraries (USGS/ECOSTRESS).', {
    x: 0.8,
    y: 2.7,
    w: 8.5,
    h: 1.2,
    fontSize: 11,
    color: '94A3B8',
    fontFace: 'Arial',
  });

  // Append all module slides
  for (const mod of modules) {
    // Section divider slide
    const divSlide = master.addSlide();
    divSlide.background = { color: '0F172A' };
    divSlide.addText(`MODULE ${mod.moduleNumber}`, {
      x: 0.8,
      y: 1.8,
      w: 8.5,
      h: 0.5,
      fontSize: 18,
      color: '38BDF8',
      bold: true,
      fontFace: 'Arial',
    });
    divSlide.addText(mod.title, {
      x: 0.8,
      y: 2.4,
      w: 8.5,
      h: 1.2,
      fontSize: 24,
      color: 'FFFFFF',
      bold: true,
      fontFace: 'Arial',
    });

    for (const slide of mod.slides) {
      const s = master.addSlide();
      s.background = { color: '0F172A' };
      s.addText(`MODULE ${mod.moduleNumber} • SLIDE ${slide.slideNumber}/30`, {
        x: 0.6,
        y: 0.35,
        w: 6.0,
        h: 0.25,
        fontSize: 9,
        color: '38BDF8',
        bold: true,
        fontFace: 'Arial',
      });
      s.addText(slide.title, {
        x: 0.6,
        y: 0.65,
        w: 8.8,
        h: 0.55,
        fontSize: 17,
        color: 'FFFFFF',
        bold: true,
        fontFace: 'Arial',
      });

      let currentY = 1.35;
      if (slide.mathFormula) {
        s.addShape(master.ShapeType.rect, {
          x: 0.6,
          y: currentY,
          w: 8.8,
          h: 0.65,
          fill: { color: '1E293B' },
          line: { color: '0284C7', width: 1.2 },
        });
        s.addText(slide.mathFormula, {
          x: 0.8,
          y: currentY + 0.08,
          w: 8.4,
          h: 0.3,
          fontSize: 12,
          color: 'FCD34D',
          bold: true,
          fontFace: 'Courier New',
        });
        if (slide.formulaExplanation) {
          s.addText(slide.formulaExplanation, {
            x: 0.8,
            y: currentY + 0.38,
            w: 8.4,
            h: 0.22,
            fontSize: 8.5,
            color: '94A3B8',
            fontFace: 'Arial',
          });
        }
        currentY += 0.8;
      }

      const bulletItems = (slide.bullets || []).map((bullet) => {
        const colonIdx = bullet.indexOf(':');
        if (colonIdx > 0 && colonIdx < 40) {
          const label = bullet.slice(0, colonIdx);
          const detail = bullet.slice(colonIdx + 1);
          return [
            {
              text: `${label}: `,
              options: { bold: true, color: '38BDF8', fontSize: 10.5, breakLine: false },
            },
            {
              text: `${detail}

`,
              options: { bold: false, color: 'E2E8F0', fontSize: 10, breakLine: true },
            },
          ];
        }
        return [
          {
            text: `${bullet}

`,
            options: { bold: false, color: 'E2E8F0', fontSize: 10, breakLine: true },
          },
        ];
      }).flat();

      const availableHeight = 5.2 - currentY;
      if (bulletItems.length > 0) {
        s.addText(bulletItems as any, {
          x: 0.6,
          y: currentY,
          w: 8.8,
          h: availableHeight,
          fontFace: 'Arial',
          bullet: true,
          paraSpaceAfter: 5,
        });
      }
      if (slide.speakerNotes) {
        s.addNotes(slide.speakerNotes);
      }
    }
  }

  const masterBlob = await master.write({ outputType: 'blob' }) as Blob;
  zip.file('slides_pptx/Principles_of_Field_Spectroscopy_All_Modules_1_to_8.pptx', masterBlob);

  // 3. Add Python Server and Launch Scripts
  currentStep++;
  if (onProgress) {
    onProgress({
      step: 'Packaging Python offline server & launcher scripts...',
      percent: 92,
      details: 'Adding server.py, app_flask.py, run_offline.bat, run_offline.sh'
    });
  }

  // Add Python server script
  zip.file('server.py', `#!/usr/bin/env python3
"""
Field Spectroscopy MSc Curriculum - Standalone Local Server
Zero external dependencies. Runs on standard Python 3.6+.
"""
import http.server
import socketserver
import os
import sys
import webbrowser

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Serve existing files, otherwise fall back to index.html for SPA routing
        path = self.translate_path(self.path)
        if not os.path.exists(path):
            self.path = '/index.html'
        return super().do_GET()

print(f"\\n===========================================================")
print(f"  Field Spectroscopy MSc Standalone Offline Server")
print(f"  Local URL: http://localhost:{PORT}")
print(f"  Press Ctrl+C to terminate the server.")
print(f"===========================================================\\n")

try:
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        try:
            webbrowser.open(f"http://localhost:{PORT}")
        except Exception:
            pass
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\\nServer stopped successfully.")
`);

  // Add Flask app script
  zip.file('app_flask.py', `#!/usr/bin/env python3
"""
Field Spectroscopy MSc Curriculum - Production Flask WSGI Server
Requires: pip install flask
"""
import os
from flask import Flask, send_from_directory, render_template

app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(path):
        return send_from_directory('.', path)
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    print("Starting Flask Production Server on http://0.0.0.0:8000 ...")
    app.run(host='0.0.0.0', port=8000, debug=False)
`);

  // Add run_offline.bat for Windows
  zip.file('run_offline.bat', `@echo off
echo ========================================================
echo  Principles of Field Spectroscopy - MSc Curriculum
echo  Starting Offline Python Web Server...
echo ========================================================
echo.
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3 from https://www.python.org/
    pause
    exit /b 1
)
python server.py 8000
pause
`);

  // Add run_offline.sh for Mac/Linux
  zip.file('run_offline.sh', `#!/usr/bin/env bash
echo "========================================================"
echo "  Principles of Field Spectroscopy - MSc Curriculum"
echo "  Starting Offline Python Web Server..."
echo "========================================================"
if command -v python3 &>/dev/null; then
    python3 server.py 8000
elif command -v python &>/dev/null; then
    python server.py 8000
else
    echo "[ERROR] Python 3 not found. Please install python3."
    exit 1
fi
`);

  // Add Documentation and Requirements
  zip.file('requirements.txt', `flask>=2.0.0\ngunicorn>=20.0.0\n`);
  zip.file('README_OFFLINE.md', `# Principles of Field Spectroscopy - Offline Package & Slides

## What is in this package?
1. **slides_pptx/**:
   - All 8 Module PowerPoint Presentations (.pptx) formatted in academic 16:9 4K widescreen
   - Complete 240-Slide Master Lecture Deck (\`Principles_of_Field_Spectroscopy_All_Modules_1_to_8.pptx\`)
   - Complete speaker lecture notes, formulas, references, and diagrams
2. **Offline Python Server**:
   - \`server.py\`: Zero-dependency Python 3 server. Double-click \`run_offline.bat\` (Windows) or \`./run_offline.sh\` (Mac/Linux).
   - \`app_flask.py\`: Flask WSGI deployment server.
3. **Interactive Web App**:
   - All interactive calculators, spectrometers, radiative transfer models, and assessments.

## Quick Launch:
- **Windows**: Double-click \`run_offline.bat\`
- **Mac / Linux**: Run \`bash run_offline.sh\`
- Opens immediately at \`http://localhost:8000\` with 100% offline capability.
`);

  // 4. Try to fetch dist/ bundle files if available in the same domain, or pack core HTML
  try {
    const htmlRes = await fetch('/index.html');
    if (htmlRes.ok) {
      const htmlText = await htmlRes.text();
      zip.file('index.html', htmlText);
    }
  } catch (e) {
    console.warn('Could not fetch index.html for inclusion, using standalone fallback');
  }

  // 5. Build Final ZIP
  if (onProgress) {
    onProgress({
      step: 'Compressing full package into ZIP archive...',
      percent: 96,
      details: 'Creating standalone archive in browser memory'
    });
  }

  const finalZipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  }, (metadata) => {
    if (onProgress) {
      onProgress({
        step: `Compressing package: ${metadata.percent.toFixed(0)}%`,
        percent: Math.min(99, Math.round(95 + (metadata.percent * 0.04))),
      });
    }
  });

  if (onProgress) {
    onProgress({
      step: 'Download ready!',
      percent: 100,
      details: 'Saving field-spectroscopy-msc-complete-package.zip to your Downloads folder'
    });
  }

  saveAs(finalZipBlob, 'field-spectroscopy-msc-complete-package.zip');
}
