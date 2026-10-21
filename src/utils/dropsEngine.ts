import { BOOK_CATALOGS } from '../data/bookPools';
import { DailyDrop, BookQuote } from '../types';

const LAUNCH_DATE = new Date('2026-10-21T00:00:00');

export function getFormattedDateLabel(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase();
}

export function getDateId(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Computes all daily drops from launch date (Oct 21, 2026) up to current day offset.
 * dayOffset: 0 = Oct 21 (5 quotes, 1 date in archive)
 * dayOffset: 1 = Oct 22 (10 quotes across 2 dates in archive)
 */
export function generateDailyDrops(dayOffset: number = 0): DailyDrop[] {
  const safeOffset = Math.max(0, dayOffset);
  const drops: DailyDrop[] = [];

  for (let i = safeOffset; i >= 0; i--) {
    const dropDate = new Date(LAUNCH_DATE);
    dropDate.setDate(dropDate.getDate() + i);

    const quotes: BookQuote[] = BOOK_CATALOGS.map((catalog) => {
      // Loop quotes cyclically if offset exceeds available pool
      const quoteIndex = i % catalog.quotes.length;
      const q = catalog.quotes[quoteIndex];
      return {
        bookId: catalog.id,
        title: catalog.title,
        author: catalog.author,
        year: catalog.year,
        page: q.page,
        quote: q.quote,
        strategicDirection: q.strategicDirection,
        realWorldContext: q.realWorldContext,
      };
    });

    drops.push({
      dateId: getDateId(dropDate),
      dateLabel: getFormattedDateLabel(dropDate),
      isToday: i === safeOffset,
      quotes,
    });
  }

  return drops;
}

/**
 * Calculates current day offset based on the real system date relative to launch.
 */
export function getRealWorldDayOffset(): number {
  const now = new Date();
  const diffTime = now.getTime() - LAUNCH_DATE.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
