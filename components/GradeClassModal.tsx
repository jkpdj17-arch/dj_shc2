'use client';

import React, { useState } from 'react';
import { UserProfile, StudentProfile } from '@/types/schedule';
import { X, GraduationCap, Check } from 'lucide-react';

interface GradeClassModalProps {
  isOpen: boolean;
  user: UserProfile | null;
  currentProfile: StudentProfile | null;
  onClose: () => void;
  onSave: (grade: string, classNum: string, dept: string) => void;
}

export function GradeClassModal({
  isOpen,
  user,
  currentProfile,
  onClose,
  onSave,
}: GradeClassModalProps) {
  const [grade, setGrade] = useState(() => currentProfile?.grade || '2');
  const [classNum, setClassNum] = useState(() => currentProfile?.classNum || '3');
  const [dept, setDept] = useState(() => currentProfile?.dept || 'AI소프트웨어과');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(grade, classNum, dept);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-white/15 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                소속 학년 및 반 설정
              </h3>
              <p className="text-xs text-slate-400">
                맞춤 학사일정과 시간표 필터링에 적용됩니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User preview banner */}
        {user && (
          <div className="flex items-center gap-3 p-3.5 mx-6 mt-5 rounded-xl bg-white/[0.04] border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500"
            />
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">
                {user.name} (@{user.login})
              </div>
              <div className="text-[11px] text-slate-400">
                계정 인증 완료 · 학적 맞춤 설정 단계
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs md:text-sm">
          <div>
            <label className="block font-semibold text-white mb-1.5">
              학년 선택
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-white mb-1.5">
              반 선택
            </label>
            <select
              value={classNum}
              onChange={(e) => setClassNum(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  {i + 1}반
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-white mb-1.5">
              학과 / 전공 (대진전자통신고)
            </label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="AI소프트웨어과">AI소프트웨어과</option>
              <option value="전기전자과">전기전자과</option>
              <option value="스마트콘텐츠과">스마트콘텐츠과</option>
              <option value="산업디자인과">산업디자인과</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-200 leading-relaxed">
            💡 <strong>자동 기억 & Supabase 저장:</strong> 설정하신 학년과 반은 계정과
            Supabase 클라우드 데이터베이스에 실시간으로 영구 저장됩니다. 로그아웃 후 다시
            로그인하셔도 별도의 입력 없이 자동으로 복원되어 맞춤 일정을 바로 확인하실 수 있습니다.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>저장하고 적용하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
