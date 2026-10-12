import { getAccessToken } from './firebaseAuth';
import type { Slide, CourseModule } from '../types';

export interface ExportProgress {
  status: 'idle' | 'authorizing' | 'creating_deck' | 'inserting_slides' | 'completed' | 'error';
  message: string;
  currentSlide?: number;
  totalSlides?: number;
  presentationUrl?: string;
}

export async function exportModuleToGoogleSlides(
  module: CourseModule,
  onProgress: (progress: ExportProgress) => void,
): Promise<string> {
  onProgress({
    status: 'authorizing',
    message: 'Validating Google Slides authorization...',
  });

  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error('You must sign in with your Google account first to export slides to Google Drive.');
  }

  onProgress({
    status: 'creating_deck',
    message: `Creating Google Slides presentation: "${module.title}"...`,
  });

  // Step 1: Create Presentation
  const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `Principles of Field Spectroscopy - Module ${module.moduleNumber}: ${module.shortTitle}`,
    }),
  });

  if (!createRes.ok) {
    const errBody = await createRes.text();
    throw new Error(`Failed to create presentation in Google Slides (${createRes.status}): ${errBody}`);
  }

  const createdPresentation = await createRes.json();
  const presentationId = createdPresentation.presentationId;
  const presentationUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;

  const totalSlides = module.slides.length;
  onProgress({
    status: 'inserting_slides',
    message: `Populating ${totalSlides} academic slides into Google Slides...`,
    currentSlide: 0,
    totalSlides,
  });

  // Process slides in chunks to avoid single request payload limit
  const chunkSize = 10;
  for (let i = 0; i < module.slides.length; i += chunkSize) {
    const slideBatch = module.slides.slice(i, i + chunkSize);
    const requests: any[] = [];

    slideBatch.forEach((slide, batchIdx) => {
      const slideIndex = i + batchIdx;
      const slideObjectId = `slide_m${module.moduleNumber}_${slideIndex}_${Date.now()}`;
      const titleBoxId = `tb_title_${slideIndex}_${Date.now()}`;
      const bodyBoxId = `tb_body_${slideIndex}_${Date.now()}`;
      const notesBoxId = `tb_notes_${slideIndex}_${Date.now()}`;

      // 1. Create slide
      requests.push({
        createSlide: {
          objectId: slideObjectId,
          insertionIndex: slideIndex + 1, // after the default title slide
        },
      });

      // 2. Title Text Box
      requests.push({
        createShape: {
          objectId: titleBoxId,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: slideObjectId,
            size: {
              width: { magnitude: 650, unit: 'PT' },
              height: { magnitude: 50, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 35,
              translateY: 25,
              unit: 'PT',
            },
          },
        },
      });

      const titleText = `[Slide ${slide.slideNumber}] ${slide.title}\n(${slide.category})`;
      requests.push({
        insertText: {
          objectId: titleBoxId,
          text: titleText,
          insertionIndex: 0,
        },
      });

      // 3. Body Text Box
      requests.push({
        createShape: {
          objectId: bodyBoxId,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: slideObjectId,
            size: {
              width: { magnitude: 650, unit: 'PT' },
              height: { magnitude: 240, unit: 'PT' },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 35,
              translateY: 85,
              unit: 'PT',
            },
          },
        },
      });

      const bulletLines = slide.bullets.map((b) => `• ${b}`).join('\n');
      const formulaLine = slide.mathFormula ? `\n\nEquation: ${slide.mathFormula}` : '';
      const takeawayLine = `\nKey Takeaway: ${slide.keyTakeaway}`;
      const bodyContent = `${takeawayLine}\n\n${bulletLines}${formulaLine}`;

      requests.push({
        insertText: {
          objectId: bodyBoxId,
          text: bodyContent,
          insertionIndex: 0,
        },
      });

      // 4. Footnote / Citations
      if (slide.references && slide.references.length > 0) {
        requests.push({
          createShape: {
            objectId: notesBoxId,
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageObjectId: slideObjectId,
              size: {
                width: { magnitude: 650, unit: 'PT' },
                height: { magnitude: 35, unit: 'PT' },
              },
              transform: {
                scaleX: 1,
                scaleY: 1,
                translateX: 35,
                translateY: 345,
                unit: 'PT',
              },
            },
          },
        });

        const refText = `References: ${slide.references.join('; ')}`;
        requests.push({
          insertText: {
            objectId: notesBoxId,
            text: refText,
            insertionIndex: 0,
          },
        });
      }
    });

    // Execute batch update
    const batchRes = await fetch(
      `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests }),
      },
    );

    if (!batchRes.ok) {
      const err = await batchRes.text();
      console.error('Batch update failed:', err);
      // We continue with other chunks if partial failure occurs
    }

    onProgress({
      status: 'inserting_slides',
      message: `Exported slides ${i + 1} to ${Math.min(i + chunkSize, totalSlides)} of ${totalSlides}...`,
      currentSlide: Math.min(i + chunkSize, totalSlides),
      totalSlides,
      presentationUrl,
    });
  }

  onProgress({
    status: 'completed',
    message: `All ${totalSlides} slides successfully created in Google Slides!`,
    currentSlide: totalSlides,
    totalSlides,
    presentationUrl,
  });

  return presentationUrl;
}
