'use client';

import React, { useState } from 'react';
import { EventCategory } from '@/types/schedule';
import { X, CalendarPlus } from 'lucide-react';

interface CustomDdayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDday: (title: string, date: string, category: EventCategory) => void;
}

export function CustomDdayModal({
  isOpen,
  onClose,
  onAddDday,
}: CustomDdayModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<EventCategory>('exam');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    onAddDday(title.trim(), date, category);
    setTitle('');
    setDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-white/15 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <CalendarPlus className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">나만의 D-Day 추가</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs md:text-sm">
          <div>
            <label className="block font-semibold text-white mb-1.5">
              일정 / 목표 이름
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 정보처리기능사 실기, 캡스톤 프로젝트 마감"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-white mb-1.5">
              목표 날짜
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-white mb-1.5">
              카테고리 구분
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="exam">자격증 / 시험</option>
              <option value="festival">대회 / 축제</option>
              <option value="vacation">방학 / 여행</option>
              <option value="regular">개인 목표 / 과제</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-200 leading-relaxed">
            ☁️ <strong>Supabase 실시간 저장:</strong> 직접 추가하신 D-Day 목표는 Supabase 데이터베이스와 브라우저에 즉시 영구 저장되어 언제나 복원됩니다.
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md text-xs"
            >
              추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
