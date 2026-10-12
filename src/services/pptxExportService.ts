import pptxgen from 'pptxgenjs';
import saveAs from 'file-saver';
import type { CourseModule, Slide } from '../types';

export function generateModulePptx(mod: CourseModule): pptxgen {
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
    color: '34D399',
    bold: true,
    fontFace: 'Arial',
  });
  titleSlide.addText(`MODULE ${mod.moduleNumber}`, {
    x: 0.8,
    y: 1.5,
    w: 8.5,
    h: 0.5,
    fontSize: 16,
    color: '94A3B8',
    bold: true,
    fontFace: 'Arial',
  });
  titleSlide.addText(mod.title, {
    x: 0.8,
    y: 2.1,
    w: 8.5,
    h: 1.5,
    fontSize: 28,
    color: 'FFFFFF',
    bold: true,
    fontFace: 'Arial',
  });
  titleSlide.addText(`${mod.slides.length} Academic Slides • Graduate Lecture Series & Protocols`, {
    x: 0.8,
    y: 3.7,
    w: 8.5,
    h: 0.4,
    fontSize: 12,
    color: '38BDF8',
    fontFace: 'Arial',
  });

  // Slide loop
  mod.slides.forEach((slide: Slide) => {
    const s = pptx.addSlide();
    s.background = { color: '0F172A' };

    // Header Tag
    s.addText(`MODULE ${mod.moduleNumber} • SLIDE ${slide.slideNumber}/30 • ${slide.category.toUpperCase()}`, {
      x: 0.6,
      y: 0.35,
      w: 8.8,
      h: 0.25,
      fontSize: 9,
      color: '38BDF8',
      bold: true,
      fontFace: 'Arial',
    });

    // Title
    s.addText(slide.title, {
      x: 0.6,
      y: 0.65,
      w: 8.8,
      h: 0.55,
      fontSize: 18,
      color: 'FFFFFF',
      bold: true,
      fontFace: 'Arial',
    });

    let currentY = 1.35;

    // Formula Box
    if (slide.mathFormula) {
      s.addShape(pptx.ShapeType.rect, {
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

    // Bullet Points
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
            text: `${detail}\n\n`,
            options: { bold: false, color: 'E2E8F0', fontSize: 10, breakLine: true },
          },
        ];
      }
      return [
        {
          text: `${bullet}\n\n`,
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

    // References Footer
    if (slide.references && slide.references.length > 0) {
      s.addText(`References: ${slide.references.join(' | ')}`, {
        x: 0.6,
        y: 5.35,
        w: 8.8,
        h: 0.22,
        fontSize: 7.5,
        color: '64748B',
        fontFace: 'Arial',
      });
    }

    // Speaker Notes
    if (slide.speakerNotes) {
      s.addNotes(slide.speakerNotes);
    }
  });

  return pptx;
}

/**
 * Downloads a module's PowerPoint presentation directly in the user's browser.
 * Generates the .pptx file 100% client-side via pptxgenjs and saves it using file-saver.
 * Never redirects, never errors with 403, and works even without internet access.
 */
export async function downloadModulePptx(mod: CourseModule): Promise<void> {
  const filename = `Module_${mod.moduleNumber}_${(mod.shortTitle || mod.title).replace(/[^a-zA-Z0-9_-]/g, '_')}.pptx`;
  const pptx = generateModulePptx(mod);
  const blob = await pptx.write({ outputType: 'blob' }) as Blob;
  saveAs(blob, filename);
}
