'use client';

import React from 'react';
import { ScheduleEvent, BookmarkedEvent } from '@/types/schedule';
import { calculateDDay } from '@/lib/neis-data';
import { X, Star, Calendar, Users, FileCheck2, Lightbulb } from 'lucide-react';

interface EventDetailModalProps {
  event: ScheduleEvent | null;
  bookmarks: BookmarkedEvent[];
  onClose: () => void;
  onToggleBookmark: (event: ScheduleEvent) => void;
}

export function EventDetailModal({
  event,
  bookmarks,
  onClose,
  onToggleBookmark,
}: EventDetailModalProps) {
  if (!event) return null;

  const dday = calculateDDay(event.date);
  const isBookmarked = bookmarks.some(
    (b) => b.title === event.title && b.date === event.date
  );

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'exam':
        return { label: '시험 / 지필평가', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'vacation':
        return { label: '방학 / 학기전환', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'festival':
        return { label: '교내 축제 / 행사', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'holiday':
        return { label: '공휴일 / 휴업', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      default:
        return { label: '정규 학사일정', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    }
  };

  const badge = getCategoryBadge(event.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}
          >
            {badge.label}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{event.date}</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {event.title}
            </h2>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                <Users className="w-3 h-3" />
                <span>대상 학년</span>
              </div>
              <span className="text-xs font-bold text-white">
                {event.gradeStr || '전체 학년'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                <FileCheck2 className="w-3 h-3" />
                <span>수업 공제</span>
              </div>
              <span className="text-xs font-bold text-white">
                {event.deduct || '해당없음'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-[11px] text-slate-400 mb-0.5">D-Day</div>
              <span className="text-sm font-black text-rose-400">
                {dday.text}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              행사 설명 및 상세 안내
            </h4>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {event.content || '등록된 행사 세부 정보가 표시됩니다.'}
            </div>
          </div>

          {/* Tips Section */}
          {event.tip && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs leading-relaxed">
              <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-300 font-bold block mb-0.5">
                  대진 꿀팁 & 알림:
                </strong>
                {event.tip}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-black/30 gap-2">
          <button
            onClick={() => onToggleBookmark(event)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
            }`}
          >
            <Star
              className={`w-4 h-4 ${
                isBookmarked ? 'text-amber-400 fill-amber-400' : 'text-slate-400'
              }`}
            />
            <span>{isBookmarked ? 'D-Day 고정 해제' : 'D-Day 고정하기'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
