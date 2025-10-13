/**
 * AI extraction utilities
 * Supports both local mode (no AI) and EU LLM mode
 */

import { supabase } from '@/integrations/supabase/client';

export interface ExtractionResult {
  sender: {
    name: string;
    type: 'government' | 'company' | 'private';
  };
  letter_type: 'Invoice' | 'Mahnung' | 'Gericht' | 'Termin' | 'Werbung' | 'Contract' | 'Info';
  subject: string;
  summary: string;
  key_points: string[];
  detected_dates: string[];
  due_date: string | null;
  actions: string[];
  risk_level: 'high' | 'medium' | 'low';
  tags: string[];
}

/**
 * Extract structured data using rule-based approach (local mode)
 * This runs entirely in browser with no AI
 */
export function extractLocal(text: string): ExtractionResult {
  const textLower = text.toLowerCase();
  
  // Detect sender type
  let senderType: 'government' | 'company' | 'private' = 'private';
  if (
    textLower.includes('finanzamt') ||
    textLower.includes('gericht') ||
    textLower.includes('behörde') ||
    textLower.includes('amt')
  ) {
    senderType = 'government';
  } else if (
    textLower.includes('gmbh') ||
    textLower.includes('ag') ||
    textLower.includes('kg') ||
    textLower.includes('firma')
  ) {
    senderType = 'company';
  }

  // Detect letter type
  let letterType: ExtractionResult['letter_type'] = 'Info';
  if (textLower.includes('rechnung') || textLower.includes('invoice')) {
    letterType = 'Invoice';
  } else if (textLower.includes('mahnung') || textLower.includes('zahlungserinnerung')) {
    letterType = 'Mahnung';
  } else if (textLower.includes('gericht') || textLower.includes('klage')) {
    letterType = 'Gericht';
  } else if (textLower.includes('termin') || textLower.includes('appointment')) {
    letterType = 'Termin';
  } else if (textLower.includes('werbung') || textLower.includes('angebot')) {
    letterType = 'Werbung';
  } else if (textLower.includes('vertrag') || textLower.includes('contract')) {
    letterType = 'Contract';
  }

  // Detect dates (simple regex)
  const dateRegex = /\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b/g;
  const detectedDates: string[] = [];
  let match;
  while ((match = dateRegex.exec(text)) !== null) {
    const [, day, month, year] = match;
    detectedDates.push(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
  }

  // Basic risk assessment
  let riskLevel: 'high' | 'medium' | 'low' = 'low';
  if (
    textLower.includes('frist') ||
    textLower.includes('mahnung') ||
    textLower.includes('gericht')
  ) {
    riskLevel = 'high';
  } else if (
    textLower.includes('zahlung') ||
    textLower.includes('termin')
  ) {
    riskLevel = 'medium';
  }

  // Extract sender name (first line usually)
  const lines = text.split('\n').filter(l => l.trim());
  const senderName = lines[0]?.substring(0, 100) || 'Unknown';

  return {
    sender: {
      name: senderName,
      type: senderType,
    },
    letter_type: letterType,
    subject: lines[1]?.substring(0, 200) || 'No subject',
    summary: text.substring(0, 500),
    key_points: lines.slice(0, 5),
    detected_dates: detectedDates,
    due_date: detectedDates[0] || null,
    actions: [],
    risk_level: riskLevel,
    tags: [letterType.toLowerCase()],
  };
}

/**
 * Extract structured data using EU LLM (requires consent)
 * Calls edge function which uses Lovable AI (EU-compatible Gemini)
 */
export async function extractWithAI(text: string): Promise<ExtractionResult> {
  const { data, error } = await supabase.functions.invoke('extract-letter', {
    body: { text },
  });

  if (error) {
    console.error('AI extraction error:', error);
    throw error;
  }

  return data.extraction;
}
