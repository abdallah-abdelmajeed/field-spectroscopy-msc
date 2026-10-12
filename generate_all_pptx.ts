import pptxgen from 'pptxgenjs';
import * as fs from 'fs';
import * as path from 'path';
import { COURSE_MODULES } from './src/data/courseData';
import type { CourseModule, Slide } from './src/types';

// Output directories
const pptxDir = path.join(process.cwd(), 'slides_pptx');
const publicPptxDir = path.join(process.cwd(), 'public', 'slides_pptx');

if (!fs.existsSync(pptxDir)) fs.mkdirSync(pptxDir, { recursive: true });
if (!fs.existsSync(publicPptxDir)) fs.mkdirSync(publicPptxDir, { recursive: true });

function createDeckForModule(mod: CourseModule): pptxgen {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Principles of Field Spectroscopy - MSc Curriculum';
  pptx.company = 'GEO-MSc-704 Earth Observation & Geo-Information';
  pptx.title = `Module ${mod.moduleNumber}: ${mod.title}`;

  // Title Slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: '0A192F' }; // Deep navy

  titleSlide.addText('PRINCIPLES OF FIELD SPECTROSCOPY • GEO-MSc-704', {
    x: 0.8,
    y: 1.0,
    w: 8.5,
    h: 0.4,
    fontSize: 13,
    color: '34D399', // Emerald accent
    bold: true,
    fontFace: 'Arial'
  });

  titleSlide.addText(`MODULE ${mod.moduleNumber}`, {
    x: 0.8,
    y: 1.5,
    w: 8.5,
    h: 0.5,
    fontSize: 16,
    color: '94A3B8',
    bold: true,
    fontFace: 'Arial'
  });

  titleSlide.addText(mod.title, {
    x: 0.8,
    y: 2.1,
    w: 8.5,
    h: 1.5,
    fontSize: 28,
    color: 'FFFFFF',
    bold: true,
    fontFace: 'Arial'
  });

  titleSlide.addText(`${mod.durationHours} Teaching Hours • ${mod.ectsCredits} ECTS Credits • ${mod.slides.length} Lecture Slides`, {
    x: 0.8,
    y: 3.8,
    w: 8.5,
    h: 0.4,
    fontSize: 12,
    color: 'CBD5E1',
    fontFace: 'Arial'
  });

  titleSlide.addText(mod.abstract, {
    x: 0.8,
    y: 4.4,
    w: 8.5,
    h: 1.8,
    fontSize: 11,
    color: '94A3B8',
    fontFace: 'Arial',
    italic: true
  });

  // Individual Content Slides
  mod.slides.forEach((slide: Slide, sIdx: number) => {
    const s = pptx.addSlide();
    s.background = { color: 'F8FAFC' }; // Clean off-white slate

    // Header bar
    s.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 10,
      h: 0.9,
      fill: { color: '0F172A' }
    });

    // Category badge
    s.addText(`MOD ${mod.moduleNumber} • [${slide.category.toUpperCase()}] • SLIDE ${slide.slideNumber}/${mod.slides.length}`, {
      x: 0.6,
      y: 0.12,
      w: 8.8,
      h: 0.25,
      fontSize: 9,
      color: '34D399',
      bold: true,
      fontFace: 'Arial'
    });

    // Slide Title
    s.addText(slide.title, {
      x: 0.6,
      y: 0.38,
      w: 8.8,
      h: 0.45,
      fontSize: 16,
      color: 'FFFFFF',
      bold: true,
      fontFace: 'Arial'
    });

    // Key Takeaway banner
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.6,
      y: 1.05,
      w: 8.8,
      h: 0.7,
      fill: { color: 'ECFDF5' },
      line: { color: '10B981', width: 1 },
      rectRadius: 0.05
    });

    s.addText(`CORE TAKEAWAY: ${slide.keyTakeaway}`, {
      x: 0.8,
      y: 1.1,
      w: 8.4,
      h: 0.6,
      fontSize: 11,
      color: '065F46',
      bold: true,
      fontFace: 'Arial'
    });

    // Left Column: Bullet Points
    const hasRightPanel = Boolean(slide.mathFormula || slide.diagramDescription || slide.practicalFieldNote);
    const leftWidth = hasRightPanel ? 5.2 : 8.8;

    const bulletItems = slide.bullets.map((b) => ({
      text: b,
      options: {
        fontSize: 11,
        color: '1E293B',
        bullet: true,
        breakLine: true,
        fontFace: 'Arial'
      }
    }));

    s.addText(bulletItems, {
      x: 0.6,
      y: 1.9,
      w: leftWidth,
      h: 3.8,
      valign: 'top',
      lineSpacing: 18
    });

    // Right Column: Formula / Technical diagram / Field practical note
    if (hasRightPanel) {
      let currentY = 1.9;

      if (slide.mathFormula) {
        s.addShape(pptx.ShapeType.roundRect, {
          x: 6.0,
          y: currentY,
          w: 3.4,
          h: 1.1,
          fill: { color: 'EFF6FF' },
          line: { color: '3B82F6', width: 1 },
          rectRadius: 0.05
        });
        s.addText('MATHEMATICAL FORMULATION', {
          x: 6.1,
          y: currentY + 0.05,
          w: 3.2,
          h: 0.2,
          fontSize: 8.5,
          color: '1E40AF',
          bold: true
        });
        s.addText(slide.mathFormula, {
          x: 6.1,
          y: currentY + 0.28,
          w: 3.2,
          h: 0.45,
          fontSize: 11,
          color: '1E3A8A',
          bold: true,
          fontFace: 'Courier New'
        });
        if (slide.formulaExplanation) {
          s.addText(slide.formulaExplanation, {
            x: 6.1,
            y: currentY + 0.75,
            w: 3.2,
            h: 0.3,
            fontSize: 8.5,
            color: '475569',
            fontFace: 'Arial'
          });
        }
        currentY += 1.25;
      }

      if (slide.practicalFieldNote) {
        s.addShape(pptx.ShapeType.roundRect, {
          x: 6.0,
          y: currentY,
          w: 3.4,
          h: 1.1,
          fill: { color: 'FFFBEB' },
          line: { color: 'F59E0B', width: 1 },
          rectRadius: 0.05
        });
        s.addText('FIELD PROTOCOL NOTE', {
          x: 6.1,
          y: currentY + 0.05,
          w: 3.2,
          h: 0.2,
          fontSize: 8.5,
          color: '92400E',
          bold: true
        });
        s.addText(slide.practicalFieldNote, {
          x: 6.1,
          y: currentY + 0.28,
          w: 3.2,
          h: 0.75,
          fontSize: 9,
          color: '78350F',
          fontFace: 'Arial'
        });
        currentY += 1.25;
      }

      if (slide.diagramDescription) {
        const remH = Math.max(0.8, 5.2 - currentY);
        s.addShape(pptx.ShapeType.roundRect, {
          x: 6.0,
          y: currentY,
          w: 3.4,
          h: remH,
          fill: { color: 'F1F5F9' },
          line: { color: '94A3B8', width: 1 },
          rectRadius: 0.05
        });
        s.addText('PHYSICS & INSTRUMENTATION ARCHITECTURE', {
          x: 6.1,
          y: currentY + 0.05,
          w: 3.2,
          h: 0.2,
          fontSize: 8,
          color: '334155',
          bold: true
        });
        s.addText(slide.diagramDescription, {
          x: 6.1,
          y: currentY + 0.28,
          w: 3.2,
          h: remH - 0.35,
          fontSize: 8.5,
          color: '475569',
          fontFace: 'Arial'
        });
      }
    }

    // Footer references
    if (slide.references && slide.references.length > 0) {
      s.addText(`References: ${slide.references.join(' | ')}`, {
        x: 0.6,
        y: 5.35,
        w: 8.8,
        h: 0.22,
        fontSize: 7.5,
        color: '64748B',
        fontFace: 'Arial'
      });
    }

    // Speaker notes
    if (slide.speakerNotes) {
      s.addNotes(slide.speakerNotes);
    }
  });

  return pptx;
}

async function run() {
  console.log('Generating PowerPoint presentations for all 8 course modules (240 total slides)...');
  
  for (const mod of COURSE_MODULES) {
    const filename = `Module_${mod.moduleNumber}_${mod.shortTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pptx`;
    const pptx = createDeckForModule(mod);
    
    const outPath1 = path.join(pptxDir, filename);
    const outPath2 = path.join(publicPptxDir, filename);
    
    await pptx.writeFile({ fileName: outPath1 });
    fs.copyFileSync(outPath1, outPath2);
    console.log(`Generated: ${filename} (${mod.slides.length} slides)`);
  }

  // Also create a master 240-slide complete course deck!
  console.log('Generating Master Course Deck (all 8 modules combined, 240 slides)...');
  const masterPptx = new pptxgen();
  masterPptx.layout = 'LAYOUT_16x9';
  masterPptx.title = 'Principles of Field Spectroscopy - Complete MSc Course (Modules 1-8)';
  masterPptx.author = 'Principles of Field Spectroscopy - Master Curriculum';

  // Master Title Slide
  const mTitle = masterPptx.addSlide();
  mTitle.background = { color: '0A192F' };
  mTitle.addText('GEO-MSc-704 MASTER CURRICULUM', {
    x: 0.8, y: 1.2, w: 8.5, h: 0.4, fontSize: 14, color: '34D399', bold: true
  });
  mTitle.addText('Principles of Field Spectroscopy', {
    x: 0.8, y: 1.8, w: 8.5, h: 1.2, fontSize: 32, color: 'FFFFFF', bold: true
  });
  mTitle.addText('Complete Lecture Series • All 8 Modules • 240 Rigorous Technical Slides', {
    x: 0.8, y: 3.2, w: 8.5, h: 0.5, fontSize: 16, color: 'CBD5E1'
  });
  mTitle.addText('Optical Physics • Radiometry • Calibration • Protocols • UAV Imaging • Preprocessing • PROSAIL • Spectral Libraries', {
    x: 0.8, y: 4.0, w: 8.5, h: 0.6, fontSize: 12, color: '94A3B8', italic: true
  });

  for (const mod of COURSE_MODULES) {
    // Module Separator Slide
    const sep = masterPptx.addSlide();
    sep.background = { color: '0F172A' };
    sep.addText(`MODULE ${mod.moduleNumber}`, {
      x: 0.8, y: 1.8, w: 8.5, h: 0.4, fontSize: 16, color: '34D399', bold: true
    });
    sep.addText(mod.title, {
      x: 0.8, y: 2.4, w: 8.5, h: 1.2, fontSize: 26, color: 'FFFFFF', bold: true
    });
    sep.addText(`${mod.durationHours} Teaching Hours • ${mod.ectsCredits} ECTS Credits • ${mod.abstract}`, {
      x: 0.8, y: 3.8, w: 8.5, h: 1.5, fontSize: 11, color: '94A3B8'
    });

    // Slides
    mod.slides.forEach((slide) => {
      const s = masterPptx.addSlide();
      s.background = { color: 'F8FAFC' };

      s.addShape(masterPptx.ShapeType.rect, {
        x: 0, y: 0, w: 10, h: 0.9, fill: { color: '0F172A' }
      });
      s.addText(`MOD ${mod.moduleNumber}: ${mod.shortTitle} • [${slide.category}] • SLIDE ${slide.slideNumber}`, {
        x: 0.6, y: 0.12, w: 8.8, h: 0.25, fontSize: 9, color: '34D399', bold: true
      });
      s.addText(slide.title, {
        x: 0.6, y: 0.38, w: 8.8, h: 0.45, fontSize: 16, color: 'FFFFFF', bold: true
      });

      s.addShape(masterPptx.ShapeType.roundRect, {
        x: 0.6, y: 1.05, w: 8.8, h: 0.7, fill: { color: 'ECFDF5' }, line: { color: '10B981', width: 1 }, rectRadius: 0.05
      });
      s.addText(`CORE TAKEAWAY: ${slide.keyTakeaway}`, {
        x: 0.8, y: 1.1, w: 8.4, h: 0.6, fontSize: 11, color: '065F46', bold: true
      });

      const hasRightPanel = Boolean(slide.mathFormula || slide.diagramDescription || slide.practicalFieldNote);
      const leftWidth = hasRightPanel ? 5.2 : 8.8;

      const bulletItems = slide.bullets.map((b) => ({
        text: b,
        options: { fontSize: 11, color: '1E293B', bullet: true, breakLine: true, fontFace: 'Arial' }
      }));
      s.addText(bulletItems, {
        x: 0.6, y: 1.9, w: leftWidth, h: 3.8, valign: 'top', lineSpacing: 18
      });

      if (hasRightPanel) {
        let currentY = 1.9;
        if (slide.mathFormula) {
          s.addShape(masterPptx.ShapeType.roundRect, {
            x: 6.0, y: currentY, w: 3.4, h: 1.1, fill: { color: 'EFF6FF' }, line: { color: '3B82F6', width: 1 }, rectRadius: 0.05
          });
          s.addText('MATHEMATICAL FORMULATION', {
            x: 6.1, y: currentY + 0.05, w: 3.2, h: 0.2, fontSize: 8.5, color: '1E40AF', bold: true
          });
          s.addText(slide.mathFormula, {
            x: 6.1, y: currentY + 0.28, w: 3.2, h: 0.45, fontSize: 11, color: '1E3A8A', bold: true, fontFace: 'Courier New'
          });
          currentY += 1.25;
        }
        if (slide.practicalFieldNote) {
          s.addShape(masterPptx.ShapeType.roundRect, {
            x: 6.0, y: currentY, w: 3.4, h: 1.1, fill: { color: 'FFFBEB' }, line: { color: 'F59E0B', width: 1 }, rectRadius: 0.05
          });
          s.addText('FIELD PROTOCOL NOTE', {
            x: 6.1, y: currentY + 0.05, w: 3.2, h: 0.2, fontSize: 8.5, color: '92400E', bold: true
          });
          s.addText(slide.practicalFieldNote, {
            x: 6.1, y: currentY + 0.28, w: 3.2, h: 0.75, fontSize: 9, color: '78350F'
          });
          currentY += 1.25;
        }
        if (slide.diagramDescription) {
          const remH = Math.max(0.8, 5.2 - currentY);
          s.addShape(masterPptx.ShapeType.roundRect, {
            x: 6.0, y: currentY, w: 3.4, h: remH, fill: { color: 'F1F5F9' }, line: { color: '94A3B8', width: 1 }, rectRadius: 0.05
          });
          s.addText('ARCHITECTURE & GEOMETRY', {
            x: 6.1, y: currentY + 0.05, w: 3.2, h: 0.2, fontSize: 8, color: '334155', bold: true
          });
          s.addText(slide.diagramDescription, {
            x: 6.1, y: currentY + 0.28, w: 3.2, h: remH - 0.35, fontSize: 8.5, color: '475569'
          });
        }
      }

      if (slide.references && slide.references.length > 0) {
        s.addText(`References: ${slide.references.join(' | ')}`, {
          x: 0.6, y: 5.35, w: 8.8, h: 0.22, fontSize: 7.5, color: '64748B'
        });
      }
      if (slide.speakerNotes) {
        s.addNotes(slide.speakerNotes);
      }
    });
  }

  const masterFilename = 'Principles_of_Field_Spectroscopy_All_Modules_1_to_8.pptx';
  const masterPath1 = path.join(pptxDir, masterFilename);
  const masterPath2 = path.join(publicPptxDir, masterFilename);
  await masterPptx.writeFile({ fileName: masterPath1 });
  fs.copyFileSync(masterPath1, masterPath2);
  console.log(`Generated Master Deck: ${masterFilename} (all 240 slides!)`);
}

run().catch(console.error);
