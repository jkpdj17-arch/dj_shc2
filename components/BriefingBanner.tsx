'use client';

import React from 'react';
import { Volume2, Play } from 'lucide-react';
import { ScheduleEvent } from '@/types/schedule';

interface BriefingBannerProps {
  schoolName: string;
  selectedDate: string;
  todayEvents: ScheduleEvent[];
  onTriggerTestNotif: () => void;
}

export function BriefingBanner({
  schoolName,
  selectedDate,
  todayEvents,
  onTriggerTestNotif,
}: BriefingBannerProps) {
  const dateFormatted = `${selectedDate} (화)`;

  let contentText = '';
  if (todayEvents.length === 0) {
    contentText =
      '오늘은 예정된 특별 학사일정이 없습니다. 정규 수업이 진행됩니다. (다음 주요 일정: 2학기 중간고사 D-14)';
  } else {
    const titles = todayEvents.map((e) => e.title).join(', ');
    contentText = `좋은 아침입니다! 오늘 ${schoolName}의 학사일정: ${titles} 이(가) 예정되어 있습니다.`;
  }

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-indigo-950/70 to-slate-900/90 border border-indigo-500/30 p-4 md:p-5 mb-6 backdrop-blur-xl shadow-lg">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-cyan-400" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pl-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 text-cyan-400">
            <Volume2 className="w-4 h-4 flex-shrink-0" />
            <div className="flex items-end gap-0.5 h-4 px-1">
              <span className="w-1 bg-cyan-400 rounded-full animate-wave-1" />
              <span className="w-1 bg-cyan-400 rounded-full animate-wave-2" />
              <span className="w-1 bg-cyan-400 rounded-full animate-wave-3" />
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            오늘의 학사 브리핑
          </span>
          <span className="text-xs text-slate-400 font-medium">
            · {dateFormatted}
          </span>
        </div>

        <div className="flex-1 text-sm text-slate-200">
          <p className="line-clamp-2 leading-relaxed">{contentText}</p>
        </div>

        <button
          onClick={onTriggerTestNotif}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all flex-shrink-0 self-start sm:self-center"
          title="즉시 일일 브리핑 알림 전송 테스트"
        >
          <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
          <span>즉시 알림 테스트</span>
        </button>
      </div>
    </section>
  );
}
