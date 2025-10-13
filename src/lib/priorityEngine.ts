/**
 * Priority scoring engine
 * Computes priority based on keywords, sender type, due dates, and letter type
 */

import { supabase } from '@/integrations/supabase/client';

export interface Rule {
  id: string;
  keyword: string;
  weight_int: number;
  severity_int: number;
  tag: string;
}

/**
 * Compute priority score (0-100) based on rules and letter data
 */
export async function computePriority(
  text: string,
  senderType: 'government' | 'company' | 'private',
  letterType: string,
  dueDate: string | null
): Promise<{ score: number; riskLevel: 'high' | 'medium' | 'low' }> {
  let score = 0;

  // Fetch user's rules
  const { data: rules } = await supabase
    .from('rules')
    .select('*')
    .returns<Rule[]>();

  if (rules) {
    // Score based on keyword matches
    const textLower = text.toLowerCase();
    for (const rule of rules) {
      if (textLower.includes(rule.keyword.toLowerCase())) {
        score += rule.weight_int;
      }
    }
  }

  // Sender type boost
  if (senderType === 'government') {
    score += 5;
  } else if (senderType === 'company') {
    score += 2;
  }

  // Letter type boost
  const typeBoosts: Record<string, number> = {
    Mahnung: 7,
    Gericht: 10,
    Termin: 6,
    Invoice: 3,
  };
  score += typeBoosts[letterType] || 0;

  // Due date proximity boost
  if (dueDate) {
    const due = new Date(dueDate);
    const now = new Date();
    const daysUntil = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil <= 3) {
      score += 10;
    } else if (daysUntil <= 7) {
      score += 6;
    } else if (daysUntil <= 14) {
      score += 3;
    }
  }

  // Cap at 100
  score = Math.min(100, score);

  // Map to risk level
  let riskLevel: 'high' | 'medium' | 'low' = 'low';
  if (score >= 70) {
    riskLevel = 'high';
  } else if (score >= 40) {
    riskLevel = 'medium';
  }

  return { score, riskLevel };
}

/**
 * Recompute priority for a letter
 */
export async function recomputeLetterPriority(letterId: string): Promise<void> {
  const { data: letter } = await supabase
    .from('letters')
    .select('*')
    .eq('id', letterId)
    .single();

  if (!letter || !letter.raw_text_enc) {
    throw new Error('Letter not found or no OCR text available');
  }

  // For now, we'll need to decrypt the text client-side
  // This is a placeholder - actual implementation would decrypt first
  const text = letter.raw_text_enc; // Should be decrypted

  const { score, riskLevel } = await computePriority(
    text,
    letter.sender_enc ? JSON.parse(letter.sender_enc).type : 'private',
    letter.letter_type || 'Info',
    letter.due_date
  );

  await supabase
    .from('letters')
    .update({
      priority_int: score,
      risk_level: riskLevel,
    })
    .eq('id', letterId);
}
