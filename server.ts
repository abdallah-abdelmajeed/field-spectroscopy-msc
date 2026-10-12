import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Gemini client initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Direct offline bundle download endpoint with forced binary attachment headers
app.get("/api/download/offline-package", (_req, res) => {
  const zipPath = path.join(process.cwd(), "public", "field-spectroscopy-msc-offline.zip");
  if (!fs.existsSync(zipPath)) {
    return res.status(404).send("Package is still building. Please try again in 5 seconds.");
  }
  const stat = fs.statSync(zipPath);
  res.setHeader("Content-Disposition", 'attachment; filename="field-spectroscopy-msc-offline.zip"');
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Length", stat.size.toString());
  res.setHeader("Cache-Control", "no-cache");
  return res.sendFile(zipPath);
});

// Direct PowerPoint download route for any module
app.get("/api/download/pptx/:filename", (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(process.cwd(), "public", "slides_pptx", filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("PowerPoint file not found.");
  }
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
  return res.sendFile(filePath);
});

// Advanced Field Spectroscopy Academic AI Tutor with High Thinking Mode
app.post("/api/ai-tutor", async (req, res) => {
  try {
    const { prompt, moduleTitle, topic } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "A prompt string is required." });
    }

    const ai = getGeminiClient();
    const systemInstruction = `You are a distinguished Senior Professor and Lead Research Scientist in Optical Field Spectroscopy and Earth Observation for MSc students in Geo-information and Spatial Management.
Course: "Principles of Field Spectroscopy"
Current Module: ${moduleTitle || "Principles of Field Spectroscopy"} (Topic: ${topic || "General Field Radiometry"})
Audience: Master of Science students specializing in geomatics, remote sensing, and environmental spatial monitoring.
Tone: Academically rigorous, physically precise, pedagogical, citing recognized equations (Planck, Beer-Lambert, Cosine law, BRDF/BRF), standards (NERC FSF, Coblentz Society, CEOS WGCV, ISO 19115-2), and instruments (ASD FieldSpec 4, SVC HR-1024i, Spectral Evolution PSR+). Provide clear step-by-step mathematical reasoning, calibration corrections, or Python/R code blocks when helpful.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Tutor error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to communicate with the academic reasoning engine.",
    });
  }
});

async function startServer() {
  // Always mount public directory for static asset delivery (including zip and pptx)
  const publicDir = path.join(process.cwd(), "public");
  app.use(express.static(publicDir));

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Course server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
