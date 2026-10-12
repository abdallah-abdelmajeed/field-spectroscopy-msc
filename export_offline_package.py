#!/usr/bin/env python3
"""
Packages the complete standalone offline bundle into a single ready-to-distribute ZIP file:
    field-spectroscopy-msc-offline.zip
Includes:
    - Entire built web app (dist/ including index.html and assets)
    - All 8 Module PowerPoint Decks (.pptx) + Master 240-slide Course Deck
    - Standalone Python 3 SPA server (server.py)
    - Production Flask web app (app_flask.py)
    - One-click launchers for Windows (.bat) and Mac/Linux (.sh)
    - Requirements, environment config, and full offline hosting manual
"""

import os
import sys
import zipfile
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
DIST_DIR = ROOT_DIR / "dist"
PUBLIC_DIR = ROOT_DIR / "public"
OUTPUT_ZIP = PUBLIC_DIR / "field-spectroscopy-msc-offline.zip"
LOCAL_ZIP = ROOT_DIR / "field-spectroscopy-msc-offline.zip"
SLIDES_PPTX_DIR = ROOT_DIR / "slides_pptx"

def create_bundle():
    if not (DIST_DIR / "index.html").exists():
        print("❌ Error: dist/index.html does not exist. Please run 'npm run build' first.")
        sys.exit(1)

    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    files_to_pack = [
        "server.py",
        "app_flask.py",
        "requirements.txt",
        "run_offline.bat",
        "run_offline.sh",
        ".env.example",
        "OFFLINE_HOSTING_GUIDE.md"
    ]

    print("📦 Packing complete standalone offline package (including all PPTX slide decks)...")
    
    # We write first to a temporary target then copy to guarantee no partial file state
    temp_zip = ROOT_DIR / "temp_package.zip"
    with zipfile.ZipFile(temp_zip, "w", zipfile.ZIP_DEFLATED) as zf:
        # 1. Add dist directory recursively (excluding any recursive zip copies)
        for root, _, files in os.walk(DIST_DIR):
            for f in files:
                if f.endswith(".zip"):
                    continue
                file_path = Path(root) / f
                arcname = Path("dist") / file_path.relative_to(DIST_DIR)
                zf.write(file_path, arcname)

        # 2. Add all PowerPoint presentation decks (.pptx) into a dedicated slides_pptx folder
        if SLIDES_PPTX_DIR.exists():
            for root, _, files in os.walk(SLIDES_PPTX_DIR):
                for f in files:
                    if f.endswith(".pptx"):
                        file_path = Path(root) / f
                        arcname = Path("slides_pptx") / f
                        zf.write(file_path, arcname)

        # 3. Add root launcher and server scripts
        for fname in files_to_pack:
            src_path = ROOT_DIR / fname
            if src_path.exists():
                zf.write(src_path, fname)

    # Move temp_zip to both destinations atomically
    import shutil
    shutil.copyfile(temp_zip, OUTPUT_ZIP)
    shutil.copyfile(temp_zip, LOCAL_ZIP)
    # Also copy into dist so if production dist is served statically it is there
    shutil.copyfile(temp_zip, DIST_DIR / "field-spectroscopy-msc-offline.zip")
    temp_zip.unlink()

    size_mb = OUTPUT_ZIP.stat().st_size / (1024 * 1024)
    print(f"✅ Successfully created comprehensive offline package: {OUTPUT_ZIP.name} ({size_mb:.2f} MB)")
    print(f"   Available at: {OUTPUT_ZIP}")

if __name__ == "__main__":
    create_bundle()
