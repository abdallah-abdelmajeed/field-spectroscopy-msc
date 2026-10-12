#!/usr/bin/env bash
# Principles of Field Spectroscopy - Offline Launcher for macOS & Linux

echo "======================================================================"
echo "   Principles of Field Spectroscopy - MSc Course & Laboratory"
echo "   Launching Offline Platform on your Local PC..."
echo "======================================================================"
echo ""

# Find python3 or python
if command -v python3 &>/dev/null; then
    PY_CMD="python3"
elif command -v python &>/dev/null; then
    PY_CMD="python"
else
    echo "[ERROR] Python 3 was not found on your system!"
    echo "Please install Python 3 from https://www.python.org/ or via your package manager."
    exit 1
fi

echo "Starting standalone Python server using $PY_CMD..."
$PY_CMD server.py --port 8000
