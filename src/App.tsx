/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { CHOSEN_BOOKS } from './data/initialBooks';
import { generateDailyDrops, getRealWorldDayOffset } from './utils/dropsEngine';
import { getTimeUntilMidnight } from './utils/time';

const STORAGE_KEY = 'tldr_book_order_preference';

function getInitialBookOrder() {
  if (typeof window === 'undefined') return CHOSEN_BOOKS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const ids: string[] = JSON.parse(stored);
      if (Array.isArray(ids) && ids.length > 0) {
        const bookMap = new Map(CHOSEN_BOOKS.map((b) => [b.id, b]));
        const reordered: typeof CHOSEN_BOOKS = [];
        for (const id of ids) {
          const found = bookMap.get(id);
          if (found) {
            reordered.push(found);
            bookMap.delete(id);
          }
        }
        for (const remaining of bookMap.values()) {
          reordered.push(remaining);
        }
        return reordered;
      }
    }
  } catch {
    // fallback to default catalog order
  }
  return CHOSEN_BOOKS;
}

export default function App() {
  // Saved device order of books
  const [booksList, setBooksList] = useState<typeof CHOSEN_BOOKS>(getInitialBookOrder);
  const [isEditingOrder, setIsEditingOrder] = useState<boolean>(false);
  const [draftBooks, setDraftBooks] = useState<typeof CHOSEN_BOOKS>(booksList);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Naturally tracks elapsed days from real system time
  const [dayOffset, setDayOffset] = useState<number>(getRealWorldDayOffset);

  const allDrops = useMemo(() => generateDailyDrops(dayOffset), [dayOffset]);
  const todayDrop = allDrops[0];

  const [selectedDateId, setSelectedDateId] = useState<string>(todayDrop.dateId);
  const [selectedBookId, setSelectedBookId] = useState<string>(() => booksList[0]?.id || CHOSEN_BOOKS[0].id);
  const [showArchive, setShowArchive] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(getTimeUntilMidnight());

  // Keep selectedDateId updated if day advances naturally
  useEffect(() => {
    setSelectedDateId(todayDrop.dateId);
  }, [todayDrop.dateId]);

  // Live countdown ticker & natural midnight rollover
  useEffect(() => {
    let lastDate = new Date().getDate();
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMidnight());

      // Naturally roll over when midnight passes
      const currentDate = new Date().getDate();
      if (currentDate !== lastDate) {
        lastDate = currentDate;
        setDayOffset(getRealWorldDayOffset());
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStartEdit = () => {
    setDraftBooks([...booksList]);
    setIsEditingOrder(true);
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= draftBooks.length) return;
    setDraftBooks((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    setDraftBooks((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, removed);
      return updated;
    });
    setDraggedIndex(null);
  };

  const handleSaveOrder = () => {
    setBooksList(draftBooks);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draftBooks.map((b) => b.id)));
    } catch {
      // storage quota or private mode
    }
    setIsEditingOrder(false);
  };

  const handleCancelOrder = () => {
    setDraftBooks(booksList);
    setIsEditingOrder(false);
  };

  const currentDrop = allDrops.find((d) => d.dateId === selectedDateId) || todayDrop;
  const isViewingToday = currentDrop.dateId === todayDrop.dateId;

  // Selected quote for currently active date
  const currentQuote =
    currentDrop.quotes.find((q) => q.bookId === selectedBookId) || currentDrop.quotes[0];

  // Total quotes in archive across all dates
  const totalArchiveQuotes = allDrops.length * booksList.length;

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111111] px-6 py-8 md:px-12 md:py-16 selection:bg-[#111111] selection:text-[#ffffff]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-start">
        {/* Left Column: Narrow column for wordmark, reading list, archive by date, and bio */}
        <aside className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col justify-between min-h-[calc(100vh-8rem)]">
          <div>
            {/* Wordmark (24-32px, regular weight) */}
            <h1 className="text-[26px] md:text-[28px] tracking-tight font-normal text-[#111111] leading-none mb-2">
              Too Long Didn't Read
            </h1>

            {/* Muted time till next update (10-12px) */}
            <div className="text-[11px] text-[#777777] mb-8 font-normal space-y-1">
              <p>next update in {countdown.hours}:{countdown.minutes}:{countdown.seconds}</p>
              {!isViewingToday && (
                <button
                  onClick={() => setSelectedDateId(todayDrop.dateId)}
                  className="text-[#111111] underline underline-offset-2 hover:opacity-75 transition-opacity block pt-1"
                >
                  ← back to today ({todayDrop.dateLabel.toLowerCase()})
                </button>
              )}
            </div>

            {/* When editing order, show the header bar right above the list */}
            {isEditingOrder && (
              <div className="mb-3 flex items-baseline justify-between text-[11px] md:text-[12px] pb-1.5 border-b border-[#eeeeee]">
                <span className="text-[#888888] font-mono lowercase tracking-wide">
                  edit order
                </span>
                <div className="flex items-center space-x-3 text-[11px]">
                  <button
                    type="button"
                    onClick={handleSaveOrder}
                    className="text-[#111111] underline underline-offset-2 hover:opacity-70 cursor-pointer lowercase"
                  >
                    save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelOrder}
                    className="text-[#888888] hover:text-[#111111] cursor-pointer lowercase"
                  >
                    cancel
                  </button>
                </div>
              </div>
            )}

            <nav className="space-y-3.5">
              {/* Reading list */}
              {isEditingOrder ? (
                <div className="space-y-2">
                  {draftBooks.map((book, idx) => (
                    <div
                      key={book.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, idx)}
                      className="flex items-center justify-between text-[13px] md:text-[14px] leading-snug py-0.5 border-b border-transparent hover:border-[#f2f2f2]"
                    >
                      <div className="truncate pr-2 cursor-grab active:cursor-grabbing select-none">
                        <span className="text-[#222222]">{book.title}</span>
                        <span className="text-[#888888] text-[12px] ml-1.5">— {book.author}</span>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0 font-mono text-[11px] text-[#777777]">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, -1)}
                          className={`px-1 py-0.5 select-none ${
                            idx === 0 ? 'opacity-20 cursor-default' : 'hover:text-[#111111] cursor-pointer'
                          }`}
                          title="Move up"
                          aria-label={`Move ${book.title} up`}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={idx === draftBooks.length - 1}
                          onClick={() => handleMove(idx, 1)}
                          className={`px-1 py-0.5 select-none ${
                            idx === draftBooks.length - 1 ? 'opacity-20 cursor-default' : 'hover:text-[#111111] cursor-pointer'
                          }`}
                          title="Move down"
                          aria-label={`Move ${book.title} down`}
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3.5">
                  {booksList.map((book, idx) => {
                    const isSelected = book.id === selectedBookId;
                    return (
                      <div key={book.id} className="relative">
                        {idx === 0 && (
                          <button
                            type="button"
                            onClick={handleStartEdit}
                            className="absolute -left-5 md:-left-6 top-[2px] w-4 h-4 flex items-center justify-center text-[13px] text-[#777777] hover:text-[#111111] leading-none select-none cursor-pointer p-0 m-0 border-0 bg-transparent"
                            title="Edit reading list order"
                            aria-label="Edit order"
                          >
                            ↕
                          </button>
                        )}
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
                </div>
              )}

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

          {currentQuote.isCompleted ? (
            <div className="pt-2 pb-12">
              <p className="text-[15px] md:text-[16px] text-[#777777] font-normal leading-relaxed">
                all big ideas have been identified
              </p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
