import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import katex from 'katex';
import type { CourseModule } from '../types';

export interface PDFExportOptions {
  includeSlides: boolean;
  includeProtocol: boolean;
  includeSpeakerNotes: boolean;
  onProgress?: (step: string, percent: number) => void;
}

/**
 * Safely renders LaTeX string into KaTeX HTML
 */
export function renderFormulaToHtml(formula: string): string {
  if (!formula) return '';
  let clean = formula.trim();
  if (clean.startsWith('1302') && clean.endsWith('1302') && clean.length > 4) {
    clean = clean.slice(2, -2).trim();
  } else if (clean.startsWith('\[') && clean.endsWith('\]') && clean.length > 4) {
    clean = clean.slice(2, -2).trim();
  } else if (clean.startsWith('$') && clean.endsWith('$') && clean.length > 2) {
    clean = clean.slice(1, -1).trim();
  }

  try {
    return katex.renderToString(clean, {
      displayMode: true,
      throwOnError: false,
      output: 'htmlAndMathml',
      trust: true
    });
  } catch {
    return `<code style="font-family: monospace; color: #1e293b;">${clean}</code>`;
  }
}

/**
 * Generate and download formatted PDF using html2canvas-pro (with full oklch / Tailwind v4 support) and jsPDF
 */
export async function generateModulePDF(
  element: HTMLElement,
  module: CourseModule,
  options: PDFExportOptions
): Promise<void> {
  const { onProgress } = options;

  onProgress?.('Preparing document for high-resolution capture...', 15);

  // High-DPI canvas capture using html2canvas-pro which natively supports modern CSS color spaces (oklch, oklab, lab)
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    allowTaint: true,
    backgroundColor: '#ffffff',
    windowWidth: 1200,
    scrollX: 0,
    scrollY: 0,
    onclone: (_clonedDoc, clonedElement) => {
      // Ensure cloned element has explicit dimensions and visible overflow for full page rendering
      clonedElement.style.overflow = 'visible';
      clonedElement.style.maxHeight = 'none';
      clonedElement.style.height = 'auto';
      clonedElement.style.transform = 'none';
      clonedElement.style.backgroundColor = '#ffffff';
    }
  });

  onProgress?.('Processing PDF pages and vector typography...', 50);

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // Add first page
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pageHeight;

  let pageNum = 1;
  while (heightLeft > 0) {
    position = -(pageNum * pageHeight);
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;
    pageNum++;
    onProgress?.(`Compiling page ${pageNum}...`, Math.min(95, 50 + pageNum * 10));
  }

  onProgress?.('Finalizing and downloading PDF file...', 100);

  const cleanTitle = module.title.replace(/[^a-zA-Z0-9_-]/g, '_');
  pdf.save(`Module_${module.moduleNumber}_${cleanTitle}_Study_Dossier.pdf`);
}

/**
 * Direct print-to-PDF trigger utilizing browser native print engine
 */
export function printModuleDocument(): void {
  window.print();
}
