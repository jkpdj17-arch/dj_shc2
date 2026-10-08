'use client';

import React, { useState } from 'react';
import { NotificationConfig } from '@/types/schedule';
import { X, Bell, Send, Check } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  config: NotificationConfig;
  schoolName: string;
  onClose: () => void;
  onSave: (config: NotificationConfig) => void;
  onTestNotification: () => void;
}

export function NotificationModal({
  isOpen,
  config,
  schoolName,
  onClose,
  onSave,
  onTestNotification,
}: NotificationModalProps) {
  const [time, setTime] = useState(config.time);
  const [enabled, setEnabled] = useState(config.enabled);
  const [permStatus, setPermStatus] = useState<string>('권한 확인 필요');

  if (!isOpen) return null;

  const handleRequestPermission = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then((perm) => {
        setPermStatus(
          perm === 'granted'
            ? '허용됨 (정상 작동)'
            : perm === 'denied'
            ? '차단됨'
            : '대기 중'
        );
      });
    }
  };

  const handleSave = () => {
    onSave({
      ...config,
      time,
      enabled,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-white/15 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              맞춤 브리핑 & 알림 설정
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
        <div className="p-6 space-y-5 text-xs md:text-sm">
          <p className="text-slate-300 leading-relaxed">
            설정한 시간에 당일 학사일정과 남은 주요 D-Day를 요약하여 브라우저
            푸시 알림으로 전달합니다.
          </p>

          {/* Time Picker */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <span className="font-semibold text-white">일일 브리핑 시간</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/20 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Browser Permission */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div>
              <div className="font-semibold text-white">브라우저 알림 권한</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                상태: {permStatus}
              </div>
            </div>
            <button
              onClick={handleRequestPermission}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-cyan-300 border border-white/15 transition-all"
            >
              권한 요청
            </button>
          </div>

          {/* Auto Notification Toggle */}
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div>
              <div className="font-semibold text-white">알림 자동 활성화</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                지정한 시간에 자동으로 데스크톱/모바일 푸시
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          {/* Preview Card */}
          <div className="p-3.5 rounded-xl bg-black/50 border border-white/10">
            <div className="text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
              <span>🔔 알림 미리보기</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              &quot;좋은 아침입니다! {schoolName}의 오늘 일정: 2학기 중간고사 D-14
              외 1건이 진행됩니다.&quot;
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-black/30">
          <button
            onClick={onTestNotification}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>테스트 알림 발송</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
          >
            <Check className="w-4 h-4" />
            <span>설정 저장</span>
          </button>
        </div>
      </div>
    </div>
  );
}
