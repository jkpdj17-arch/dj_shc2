'use client';

import React from 'react';
import {
  ScheduleEvent,
  EventCategory,
  BookmarkedEvent,
} from '@/types/schedule';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';

interface CalendarViewProps {
  year: number;
  month: number;
  selectedDate: string;
  viewMode: 'month' | 'week';
  filterCategory: string;
  filterGrade: string;
  events: ScheduleEvent[];
  bookmarks: BookmarkedEvent[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToday: () => void;
  onSelectDate: (date: string) => void;
  onSelectEvent: (event: ScheduleEvent) => void;
  onChangeViewMode: (mode: 'month' | 'week') => void;
  onChangeCategory: (cat: string) => void;
  onChangeGrade: (grade: string) => void;
}

export function CalendarView({
  year,
  month,
  selectedDate,
  viewMode,
  filterCategory,
  filterGrade,
  events,
  bookmarks,
  onPrevMonth,
  onNextMonth,
  onGoToday,
  onSelectDate,
  onSelectEvent,
  onChangeViewMode,
  onChangeCategory,
  onChangeGrade,
}: CalendarViewProps) {
  // Filter events based on active category and grade
  const filteredEvents = events.filter((ev) => {
    if (filterCategory !== 'all' && ev.category !== filterCategory) {
      return false;
    }
    if (filterGrade !== 'all') {
      if (filterGrade === '1' && ev.ONE_GRADE_EVENT_YN !== 'Y') return false;
      if (filterGrade === '2' && ev.TW_GRADE_EVENT_YN !== 'Y') return false;
      if (filterGrade === '3' && ev.THREE_GRADE_EVENT_YN !== 'Y') return false;
    }
    // Filter out regular Saturday off day unless holiday filter selected
    if (ev.title === '토요휴업일' && filterCategory !== 'holiday') {
      return false;
    }
    return true;
  });

  const getCategoryStyles = (cat: EventCategory) => {
    switch (cat) {
      case 'exam':
        return 'bg-rose-500/20 border-l-2 border-rose-500 text-rose-200 hover:bg-rose-500/30';
      case 'vacation':
        return 'bg-emerald-500/20 border-l-2 border-emerald-500 text-emerald-200 hover:bg-emerald-500/30';
      case 'festival':
        return 'bg-purple-500/20 border-l-2 border-purple-500 text-purple-200 hover:bg-purple-500/30';
      case 'holiday':
        return 'bg-amber-500/20 border-l-2 border-amber-500 text-amber-200 hover:bg-amber-500/30';
      default:
        return 'bg-blue-500/20 border-l-2 border-blue-500 text-blue-200 hover:bg-blue-500/30';
    }
  };

  // Month calculations
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0 = Sun
  const totalDaysInMonth = new Date(year, month, 0).getDate();
  const prevMonthTotalDays = new Date(year, month - 1, 0).getDate();

  // Week calculation from selectedDate (parsed safely by components to prevent UTC shift)
  const [selYear, selMonth, selDay] = selectedDate.split('-').map(Number);
  const currSelected = new Date(selYear, selMonth - 1, selDay);
  const selectedDayIndex = isNaN(currSelected.getTime())
    ? 0
    : currSelected.getDay();
  const weekStartDate = new Date(selYear, selMonth - 1, selDay - selectedDayIndex);

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <section className="p-4 md:p-6 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col">
      {/* Calendar Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
        {/* Navigation Cluster */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevMonth}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
            title="이전 달"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-xl md:text-2xl font-black text-white min-w-[140px] text-center tracking-tight">
            {year}년 {month}월
          </h2>

          <button
            onClick={onNextMonth}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
            title="다음 달"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={onGoToday}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition-all"
          >
            오늘
          </button>
        </div>

        {/* View Mode & Grade Filter Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* View Toggle */}
          <div className="flex p-0.5 rounded-xl bg-black/40 border border-white/10">
            <button
              onClick={() => onChangeViewMode('month')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'month'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              월간
            </button>
            <button
              onClick={() => onChangeViewMode('week')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'week'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              주간
            </button>
          </div>

          {/* Grade Select */}
          <div className="flex items-center gap-1.5">
            <select
              value={filterGrade}
              onChange={(e) => onChangeGrade(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-black/40 border border-white/15 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">전체 학년</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap pb-4 mb-4 border-b border-white/10 text-xs">
        <span className="text-slate-400 font-semibold mr-1">일정 구분:</span>

        {[
          { key: 'all', label: '전체' },
          { key: 'exam', label: '시험/평가', dot: 'bg-rose-500' },
          { key: 'vacation', label: '방학/개학', dot: 'bg-emerald-500' },
          { key: 'festival', label: '축제/행사', dot: 'bg-purple-500' },
          { key: 'holiday', label: '공휴/재량휴업', dot: 'bg-amber-500' },
          { key: 'regular', label: '일반일정', dot: 'bg-blue-500' },
        ].map((cat) => {
          const isActive = filterCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onChangeCategory(cat.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold border transition-all ${
                isActive
                  ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-sm'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.dot && <span className={`w-2 h-2 rounded-full ${cat.dot}`} />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Calendar Grid Container */}
      {viewMode === 'month' ? (
        /* Monthly View */
        <div className="grid grid-cols-7 gap-1.5 md:gap-2">
          {/* Weekday Labels */}
          {weekdays.map((w, idx) => (
            <div
              key={w}
              className={`text-center py-2 text-xs font-bold uppercase ${
                idx === 0
                  ? 'text-rose-400'
                  : idx === 6
                  ? 'text-blue-400'
                  : 'text-slate-400'
              }`}
            >
              {w}
            </div>
          ))}

          {/* Prev Month Days */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => {
            const dayNum = prevMonthTotalDays - firstDayOfWeek + idx + 1;
            const prevM = month === 1 ? 12 : month - 1;
            const prevY = month === 1 ? year - 1 : year;
            const dStr = `${prevY}-${String(prevM).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

            return (
              <div
                key={`prev-${idx}`}
                onClick={() => onSelectDate(dStr)}
                className="min-h-[90px] md:min-h-[110px] p-1.5 rounded-xl bg-white/[0.01] border border-white/5 opacity-35 hover:opacity-70 transition-all cursor-pointer flex flex-col justify-start"
              >
                <span className="text-xs font-semibold text-slate-500">
                  {dayNum}
                </span>
              </div>
            );
          })}

          {/* Current Month Days */}
          {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayOfWeek = (firstDayOfWeek + idx) % 7;
            const isToday = dateStr === '2026-10-06';
            const isSelected = dateStr === selectedDate;

            const dayEvents = filteredEvents.filter((e) => e.date === dateStr);
            const isBookmarked = bookmarks.some((b) => b.date === dateStr);

            return (
              <div
                key={`curr-${dayNum}`}
                onClick={() => onSelectDate(dateStr)}
                className={`min-h-[95px] md:min-h-[115px] p-2 rounded-xl border transition-all flex flex-col cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-cyan-400 bg-cyan-950/20 border-cyan-400/50'
                    : isToday
                    ? 'bg-indigo-950/30 border-indigo-500/60 shadow-sm'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                }`}
              >
                {/* Header (Day number + badges) */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isToday
                        ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                        : dayOfWeek === 0
                        ? 'text-rose-400'
                        : dayOfWeek === 6
                        ? 'text-blue-400'
                        : 'text-slate-200'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {isBookmarked && (
                    <span className="text-xs" title="중요 북마크 일정">
                      ⭐
                    </span>
                  )}
                </div>

                {/* Event Chips */}
                <div className="flex flex-col gap-1 overflow-hidden flex-1">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(ev);
                      }}
                      className={`text-[11px] font-semibold px-1.5 py-0.5 rounded truncate transition-all cursor-pointer ${getCategoryStyles(
                        ev.category
                      )}`}
                      title={`${ev.title} (${ev.gradeStr})`}
                    >
                      {ev.title}
                    </div>
                  ))}

                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-slate-400 font-semibold text-right">
                      +{dayEvents.length - 3}개 더보기
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Weekly View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, idx) => {
            const dateIter = new Date(weekStartDate);
            dateIter.setDate(weekStartDate.getDate() + idx);
            const y = dateIter.getFullYear();
            const m = dateIter.getMonth() + 1;
            const d = dateIter.getDate();
            const dStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isToday = dStr === '2026-10-06';
            const isSelected = dStr === selectedDate;
            const dayEvents = filteredEvents.filter((e) => e.date === dStr);

            return (
              <div
                key={`week-col-${idx}`}
                onClick={() => onSelectDate(dStr)}
                className={`p-3 rounded-xl border transition-all flex flex-col min-h-[360px] cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-cyan-400 bg-cyan-950/20 border-cyan-400/50'
                    : isToday
                    ? 'bg-indigo-950/30 border-indigo-500/60'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                }`}
              >
                <div className="text-center pb-2 mb-3 border-b border-white/10">
                  <div
                    className={`text-xs font-bold uppercase ${
                      idx === 0
                        ? 'text-rose-400'
                        : idx === 6
                        ? 'text-blue-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {weekdays[idx]}요일
                  </div>
                  <div className="text-base font-extrabold text-white mt-0.5">
                    {m}.{d}
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  {dayEvents.length === 0 ? (
                    <div className="text-center text-xs text-slate-500 py-6">
                      일정 없음
                    </div>
                  ) : (
                    dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(ev);
                        }}
                        className={`p-2 rounded-lg text-xs cursor-pointer ${getCategoryStyles(
                          ev.category
                        )}`}
                      >
                        <div className="font-bold">{ev.title}</div>
                        <div className="text-[10px] opacity-75 mt-0.5">
                          {ev.gradeStr}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
