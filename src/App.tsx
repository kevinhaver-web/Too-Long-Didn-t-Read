/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { CHOSEN_BOOKS } from './data/initialBooks';
import { generateDailyDrops, getRealWorldDayOffset } from './utils/dropsEngine';
import { getTimeUntilMidnight } from './utils/time';

const OFFSET_STORAGE_KEY = 'tldr_simulated_day_offset_v1';

export default function App() {
  // Day offset from launch date (0 = Oct 21, 1 = Oct 22, etc.)
  const [dayOffset, setDayOffset] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(OFFSET_STORAGE_KEY);
      if (saved !== null) {
        return parseInt(saved, 10);
      }
    } catch {
      // fallback
    }
    return getRealWorldDayOffset();
  });

  const allDrops = useMemo(() => generateDailyDrops(dayOffset), [dayOffset]);
  const todayDrop = allDrops[0];

  const [selectedDateId, setSelectedDateId] = useState<string>(todayDrop.dateId);
  const [selectedBookId, setSelectedBookId] = useState<string>(CHOSEN_BOOKS[0].id);
  const [showArchive, setShowArchive] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(getTimeUntilMidnight());

  // Keep selectedDateId in sync when day offset advances
  useEffect(() => {
    setSelectedDateId(todayDrop.dateId);
  }, [todayDrop.dateId]);

  // Live countdown ticker & midnight rollover check
  useEffect(() => {
    let lastDate = new Date().getDate();
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMidnight());

      // If midnight passed in real time, advance offset
      const currentDate = new Date().getDate();
      if (currentDate !== lastDate) {
        lastDate = currentDate;
        setDayOffset((prev) => {
          const next = prev + 1;
          localStorage.setItem(OFFSET_STORAGE_KEY, String(next));
          return next;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentDrop = allDrops.find((d) => d.dateId === selectedDateId) || todayDrop;
  const isViewingToday = currentDrop.dateId === todayDrop.dateId;

  // Selected quote for currently active date
  const currentQuote =
    currentDrop.quotes.find((q) => q.bookId === selectedBookId) || currentDrop.quotes[0];

  // Total quotes in archive: 5 per date
  const totalArchiveQuotes = allDrops.length * 5;

  const handleSimulateNextDay = () => {
    setDayOffset((prev) => {
      const next = prev + 1;
      localStorage.setItem(OFFSET_STORAGE_KEY, String(next));
      return next;
    });
  };

  const handleResetToDay1 = () => {
    setDayOffset(0);
    localStorage.setItem(OFFSET_STORAGE_KEY, '0');
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111111] px-6 py-8 md:px-12 md:py-16 selection:bg-[#111111] selection:text-[#ffffff]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-start">
        {/* Left Column: Narrow column for wordmark, 5 book titles, archive by date, and bio */}
        <aside className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col justify-between min-h-[calc(100vh-8rem)]">
          <div>
            {/* Wordmark (24-32px, regular weight) */}
            <h1 className="text-[26px] md:text-[28px] tracking-tight font-normal text-[#111111] leading-none mb-2">
              Too Long Didn't Read
            </h1>

            {/* Muted time till next update (10-12px) */}
            <div className="text-[11px] text-[#777777] mb-8 font-normal space-y-1">
              <div className="flex items-center gap-2">
                <span>next update in {countdown.hours}:{countdown.minutes}:{countdown.seconds}</span>
                <span className="text-[#cccccc]">·</span>
                <button
                  onClick={handleSimulateNextDay}
                  title="Test daily rollover"
                  className="text-[#999999] hover:text-[#111111] transition-colors"
                >
                  +1 day
                </button>
                {dayOffset > 0 && (
                  <button
                    onClick={handleResetToDay1}
                    title="Reset to day 1 (Oct 21)"
                    className="text-[#999999] hover:text-[#111111] transition-colors"
                  >
                    reset
                  </button>
                )}
              </div>
              {!isViewingToday && (
                <button
                  onClick={() => setSelectedDateId(todayDrop.dateId)}
                  className="text-[#111111] underline underline-offset-2 hover:opacity-75 transition-opacity block pt-1"
                >
                  ← back to today ({todayDrop.dateLabel.toLowerCase()})
                </button>
              )}
            </div>

            {/* Simple vertical list of the 5 chosen books with authors */}
            <nav className="space-y-3.5">
              {CHOSEN_BOOKS.map((book) => {
                const isSelected = book.id === selectedBookId;
                return (
                  <div key={book.id}>
                    <button
                      onClick={() => setSelectedBookId(book.id)}
                      className={`text-left text-[14px] md:text-[15px] leading-snug transition-colors block w-full ${
                        isSelected
                          ? 'text-[#111111] font-medium'
                          : 'text-[#777777] hover:text-[#111111]'
                      }`}
                    >
                      <span className={isSelected ? 'underline underline-offset-4 decoration-1' : ''}>
                        {book.title}
                      </span>
                      <span className="text-[#888888] font-normal ml-1.5">
                        — {book.author}
                      </span>
                    </button>
                  </div>
                );
              })}

              {/* Archive separated by date, not by quote or book */}
              <div className="pt-5">
                <button
                  onClick={() => setShowArchive(!showArchive)}
                  className={`text-left text-[11px] md:text-[12px] leading-snug transition-colors block uppercase tracking-wider ${
                    showArchive ? 'text-[#111111] font-medium mb-3' : 'text-[#777777] hover:text-[#111111]'
                  }`}
                >
                  archive ({totalArchiveQuotes}) {showArchive ? '—' : '+'}
                </button>

                {showArchive && (
                  <div className="space-y-2.5 pl-3 border-l border-[#eeeeee]">
                    {allDrops.map((drop) => {
                      const isDateSelected = drop.dateId === selectedDateId;
                      const isToday = drop.dateId === todayDrop.dateId;
                      return (
                        <div key={drop.dateId}>
                          <button
                            onClick={() => setSelectedDateId(drop.dateId)}
                            className={`text-left text-[13px] md:text-[14px] leading-snug transition-colors block w-full ${
                              isDateSelected
                                ? 'text-[#111111] underline underline-offset-4 decoration-1 font-medium'
                                : 'text-[#777777] hover:text-[#111111]'
                            }`}
                          >
                            <span>{drop.dateLabel.toLowerCase()}</span>
                            {isToday && (
                              <span className="text-[10px] text-[#999999] ml-2">today</span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Short bio at the very bottom of the left column in small muted text */}
          <div className="mt-16 md:mt-24 pt-6 text-[11px] leading-relaxed text-[#777777] max-w-[260px]">
            Kevin Haver. Content and Comms Strategist at DEPT®, studying communication science at UVA.
          </div>
        </aside>

        {/* Right Column: Left-aligned, narrow reading column for the selected book of the selected date */}
        <main className="w-full max-w-[560px] pt-1">
          {/* Date (10-12px, muted grey #777) */}
          <div className="text-[11px] text-[#777777] tracking-wider mb-2 font-normal">
            {currentDrop.dateLabel}
          </div>

          {/* Book Title (22-26px, near-black #111) */}
          <h2 className="text-[24px] md:text-[26px] font-normal text-[#111111] leading-tight mb-1">
            {currentQuote.title}
          </h2>

          {/* Author (14-15px, muted grey #777) */}
          <p className="text-[14px] text-[#777777] font-normal mb-10">
            {currentQuote.author} {currentQuote.year && `(${currentQuote.year})`}
          </p>

          {/* The Quote (18-20px, near-black #111) */}
          <div className="mb-10">
            <p className="text-[18px] md:text-[20px] text-[#111111] leading-relaxed font-normal">
              “{currentQuote.quote}”
            </p>
            {currentQuote.page && (
              <p className="text-[11px] text-[#777777] font-normal mt-2">
                p. {currentQuote.page}
              </p>
            )}
          </div>

          {/* Real World Context (clean, no brackets, less is more) */}
          <div className="mb-8">
            <div className="text-[11px] uppercase tracking-wider text-[#777777] mb-1.5 font-normal">
              real world context
            </div>
            <p className="text-[13px] md:text-[14px] leading-relaxed text-[#444444] font-normal">
              {currentQuote.realWorldContext}
            </p>
          </div>

          {/* Strategic Direction (short, terse) */}
          <div className="mb-12">
            <div className="text-[11px] uppercase tracking-wider text-[#777777] mb-1.5 font-normal">
              strategic direction
            </div>
            <p className="text-[14px] md:text-[15px] leading-relaxed text-[#222222] font-normal">
              {currentQuote.strategicDirection}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
