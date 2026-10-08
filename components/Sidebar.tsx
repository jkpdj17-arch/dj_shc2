'use client';

import React from 'react';
import {
  ScheduleEvent,
  CustomDday,
  BookmarkedEvent,
  EventCategory,
} from '@/types/schedule';
import {
  CURATED_HIGHLIGHTS_2026,
  calculateDDay,
} from '@/lib/neis-data';
import { Hourglass, Sparkles, CalendarDays, Plus, Trash2 } from 'lucide-react';

interface SidebarProps {
  selectedDate: string;
  events: ScheduleEvent[];
  bookmarks: BookmarkedEvent[];
  customDdays: CustomDday[];
  isSupabaseReady?: boolean;
  onOpenCustomDdayModal: () => void;
  onSelectEvent: (event: ScheduleEvent) => void;
  onDeleteCustomDday?: (title: string, date: string) => void;
}

export function Sidebar({
  selectedDate,
  events,
  bookmarks,
  customDdays,
  isSupabaseReady = false,
  onOpenCustomDdayModal,
  onSelectEvent,
  onDeleteCustomDday,
}: SidebarProps) {
  // Combine all D-Day candidates
  const allDdays: Array<{
    title: string;
    date: string;
    category: string;
    isCustom?: boolean;
    isBookmark?: boolean;
  }> = [
    { title: '2학기 중간고사 (1·2학년)', date: '2026-10-20', category: 'exam' },
    { title: '대진 솔빛 축제 & 학예제', date: '2026-11-06', category: 'festival' },
    { title: '대학수학능력시험 (수능일)', date: '2026-11-19', category: 'exam' },
    { title: '2학기 기말고사', date: '2026-12-14', category: 'exam' },
    { title: '겨울방학식 & 종업식', date: '2027-01-08', category: 'vacation' },
  ];

  // Merge bookmarks
  bookmarks.forEach((b) => {
    if (!allDdays.some((x) => x.title === b.title && x.date === b.date)) {
      allDdays.push({
        title: `⭐ ${b.title}`,
        date: b.date,
        category: b.category,
        isBookmark: true,
      });
    }
  });

  // Merge custom D-Days
  customDdays.forEach((c) => {
    allDdays.push({
      title: `📌 ${c.title}`,
      date: c.date,
      category: c.category,
      isCustom: true,
    });
  });

  // Sort by target date
  allDdays.sort((a, b) => a.date.localeCompare(b.date));

  // Filter selected date events
  const selectedDayEvents = events.filter((e) => e.date === selectedDate);

  const getDDayBadgeClass = (cls: string) => {
    switch (cls) {
      case 'today':
        return 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30 font-black';
      case 'urgent':
        return 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold';
      case 'upcoming':
        return 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/40 font-bold';
      default:
        return 'bg-white/5 text-slate-400 font-semibold';
    }
  };

  return (
    <aside className="flex flex-col gap-5">
      {/* 1. D-Day Countdown Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Hourglass className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">주요 일정 D-Day</h3>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  isSupabaseReady
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSupabaseReady ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                {isSupabaseReady ? 'Supabase 클라우드 동기화' : '로컬 모드 (Supabase 연동 가능)'}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenCustomDdayModal}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
            title="나만의 D-Day 직접 추가하고 Supabase에 저장"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>직접 추가</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {allDdays.slice(0, 8).map((item, idx) => {
            const dday = calculateDDay(item.date);
            return (
              <div
                key={`${item.date}-${item.title}-${idx}`}
                onClick={() => {
                  const match = events.find((e) => e.date === item.date) || {
                    id: `dday_${item.date}_${item.title}`,
                    title: item.title.replace(/^[⭐📌]\s*/, ''),
                    date: item.date,
                    category: (item.category as EventCategory) || 'regular',
                    content: '주요 D-Day 등록 일정입니다.',
                    tip: '일정에 맞춰 준비 계획을 점검하세요.',
                    gradeStr: '전체',
                    deduct: '해당없음',
                  };
                  onSelectEvent(match);
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group"
              >
                <div className="flex flex-col gap-0.5 overflow-hidden pr-2">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-white truncate">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.date}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs tracking-tight ${getDDayBadgeClass(
                      dday.class
                    )}`}
                  >
                    {dday.text}
                  </span>

                  {/* Delete button for custom D-Days */}
                  {item.isCustom && onDeleteCustomDday && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCustomDday(
                          item.title.replace(/^[📌]\s*/, ''),
                          item.date
                        );
                      }}
                      className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/20 opacity-70 group-hover:opacity-100 transition-all"
                      title="이 D-Day 삭제 (Supabase에서도 삭제됨)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Student Expectation Event Highlights */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">학생 기대 행사</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-rose-500 to-pink-500 text-white tracking-wider">
            PICK
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {CURATED_HIGHLIGHTS_2026.map((item) => {
            const dday = calculateDDay(item.date);
            return (
              <div
                key={item.name}
                onClick={() => {
                  onSelectEvent({
                    id: `highlight_${item.date}`,
                    title: item.name,
                    date: item.date,
                    category: item.category,
                    content: item.desc,
                    tip: '대진전자통신고 학생 인기 행사 하이라이트입니다.',
                    gradeStr: '전체 학년',
                    deduct: '해당없음',
                  });
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-pink-500/30 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {item.date} ·{' '}
                    <strong className="text-cyan-400 font-semibold">
                      {dday.text}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Selected Day Events Quick Panel */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/10">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <CalendarDays className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white">
            {selectedDate} 일정
          </h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {selectedDayEvents.length === 0 ? (
            <div className="text-center text-xs text-slate-400 py-6">
              해당 날짜에 등록된 공식 학사일정이 없습니다.
            </div>
          ) : (
            selectedDayEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => onSelectEvent(ev)}
                className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border-l-4 border-l-indigo-500 border border-white/5 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-white truncate">
                    {ev.title}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-cyan-300">
                    {ev.gradeStr}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {ev.content || '세부 설명 정보가 없습니다.'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
