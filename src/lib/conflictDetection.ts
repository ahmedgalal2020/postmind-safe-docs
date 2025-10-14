/**
 * Conflict detection and alternative slot suggestion
 */

import { supabase } from '@/integrations/supabase/client';
import { parseISO, addMinutes, isWithinInterval, addDays, startOfDay, setHours } from 'date-fns';

interface Event {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
}

/**
 * Check for overlapping events and mark conflicts
 */
export async function detectConflicts(events: Event[]): Promise<void> {
  const conflicts: string[] = [];

  for (let i = 0; i < events.length; i++) {
    const event1 = events[i];
    const start1 = parseISO(event1.start_time);
    const end1 = parseISO(event1.end_time);

    for (let j = i + 1; j < events.length; j++) {
      const event2 = events[j];
      const start2 = parseISO(event2.start_time);
      const end2 = parseISO(event2.end_time);

      // Check if events overlap
      const overlaps =
        (start1 >= start2 && start1 < end2) ||
        (end1 > start2 && end1 <= end2) ||
        (start1 <= start2 && end1 >= end2);

      if (overlaps) {
        conflicts.push(event1.id, event2.id);
      }
    }
  }

  // Update conflict status
  if (conflicts.length > 0) {
    const uniqueConflicts = [...new Set(conflicts)];
    await supabase
      .from('events')
      .update({ status: 'conflict' })
      .in('id', uniqueConflicts);
  }
}

/**
 * Suggest next 3 free time slots
 */
export async function suggestAlternatives(
  originalStart: Date,
  originalEnd: Date,
  existingEvents: Event[]
): Promise<Array<{ start: Date; end: Date }>> {
  const duration = originalEnd.getTime() - originalStart.getTime();
  const suggestions: Array<{ start: Date; end: Date }> = [];
  
  // Check slots today and tomorrow
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  
  const timeSlots = [
    setHours(today, 9),
    setHours(today, 10),
    setHours(today, 11),
    setHours(today, 14),
    setHours(today, 15),
    setHours(today, 16),
    setHours(tomorrow, 9),
    setHours(tomorrow, 10),
    setHours(tomorrow, 11),
    setHours(tomorrow, 14),
    setHours(tomorrow, 15),
    setHours(tomorrow, 16),
  ];

  for (const slot of timeSlots) {
    if (suggestions.length >= 3) break;

    const slotEnd = addMinutes(slot, duration / 60000);
    
    // Check if this slot conflicts with any existing events
    const hasConflict = existingEvents.some((event) => {
      const eventStart = parseISO(event.start_time);
      const eventEnd = parseISO(event.end_time);
      
      return (
        isWithinInterval(slot, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(slotEnd, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(eventStart, { start: slot, end: slotEnd })
      );
    });

    if (!hasConflict) {
      suggestions.push({ start: slot, end: slotEnd });
    }
  }

  return suggestions;
}
