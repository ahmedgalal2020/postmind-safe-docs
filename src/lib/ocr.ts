/**
 * OCR utilities using Tesseract.js
 * Runs completely in browser - no data leaves the client
 */

import { createWorker } from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
}

/**
 * Extract text from an image or PDF using Tesseract.js
 * Runs locally in the browser using WASM
 */
export async function extractTextLocal(
  file: Blob,
  onProgress?: (progress: number) => void
): Promise<OCRResult> {
  const worker = await createWorker('deu+eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(m.progress);
      }
    },
  });

  try {
    const { data } = await worker.recognize(file);
    return {
      text: data.text,
      confidence: data.confidence,
    };
  } finally {
    await worker.terminate();
  }
}
