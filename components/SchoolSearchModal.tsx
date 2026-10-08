'use client';

import React, { useState } from 'react';
import { SchoolInfo } from '@/types/schedule';
import { X, Search, School } from 'lucide-react';

interface SchoolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSchool: (school: SchoolInfo) => void;
}

export function SchoolSearchModal({
  isOpen,
  onClose,
  onSelectSchool,
}: SchoolSearchModalProps) {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SchoolInfo[]>([]);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!keyword.trim() || keyword.trim().length < 2) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `/api/neis/search?keyword=${encodeURIComponent(keyword.trim())}`
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.schools)) {
        setResults(data.schools);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.warn('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const presets: SchoolInfo[] = [
    {
      officeCode: 'C10',
      officeName: '부산광역시교육청',
      schoolCode: '7150597',
      schoolName: '대진전자통신고등학교',
      address: '부산광역시 금정구 수림로 92',
    },
    {
      officeCode: 'C10',
      officeName: '부산광역시교육청',
      schoolCode: '7150658',
      schoolName: '부산소프트웨어마이스터고등학교',
      address: '부산광역시 강서구 가락대로',
    },
    {
      officeCode: 'C10',
      officeName: '부산광역시교육청',
      schoolCode: '7150106',
      schoolName: '부산전자공업고등학교',
      address: '부산광역시 동래구',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              학교 변경 및 타 학교 조회
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs md:text-sm">
          <p className="text-slate-300 leading-relaxed">
            전국 초·중·고등학교 이름을 검색하거나 학교를 선택하여 NEIS 공식
            일정을 즉시 조회할 수 있습니다.
          </p>

          {/* Search Box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="학교명 검색 (예: 대진전자통신고, 부산소프트웨어...)"
              className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs md:text-sm"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 transition-all text-xs md:text-sm"
            >
              <Search className="w-4 h-4" />
              <span>검색</span>
            </button>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] text-slate-400 font-semibold">
              추천 학교:
            </span>
            {presets.map((p) => (
              <button
                key={p.schoolCode}
                onClick={() => {
                  onSelectSchool(p);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
              >
                {p.schoolName}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="space-y-2 mt-4 max-h-60 overflow-y-auto pr-1">
            {loading ? (
              <div className="text-center text-slate-400 py-8">
                NEIS 전국 학교 정보 검색 중...
              </div>
            ) : searched && results.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                검색 결과가 없습니다. 다른 학교명으로 시도해주세요.
              </div>
            ) : (
              results.map((sch) => (
                <div
                  key={sch.schoolCode}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-all group"
                >
                  <div className="overflow-hidden pr-2">
                    <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {sch.schoolName}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 truncate">
                      {sch.officeName} · 코드 {sch.schoolCode} ·{' '}
                      {sch.address || ''}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onSelectSchool(sch);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex-shrink-0"
                  >
                    선택
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
