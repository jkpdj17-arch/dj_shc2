'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useRef, useEffect } from 'react';
import { SchoolInfo, UserProfile, StudentProfile } from '@/types/schedule';
import {
  GraduationCap,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  ExternalLink,
  RefreshCw,
  Edit2,
  BookOpen,
  Database,
} from 'lucide-react';

interface HeaderProps {
  school: SchoolInfo;
  isNeisLive: boolean;
  isSupabaseReady?: boolean;
  user: UserProfile | null;
  studentProfile: StudentProfile | null;
  isNotifEnabled: boolean;
  bookmarkCount: number;
  onOpenSchoolSearch: () => void;
  onOpenNotificationModal: () => void;
  onOpenAuthModal: () => void;
  onOpenGradeClassModal: () => void;
  onLogout: () => void;
  onSyncData: () => void;
}

export function Header({
  school,
  isNeisLive,
  isSupabaseReady = false,
  user,
  studentProfile,
  isNotifEnabled,
  bookmarkCount,
  onOpenSchoolSearch,
  onOpenNotificationModal,
  onOpenAuthModal,
  onOpenGradeClassModal,
  onLogout,
  onSyncData,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const gradeClassText = studentProfile
    ? `${studentProfile.grade}학년 ${studentProfile.classNum}반`
    : '학적 설정 필요';

  return (
    <header className="relative flex flex-wrap items-center justify-between gap-4 p-4 md:p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl mb-6">
      {/* School Badge & Info */}
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 flex-shrink-0">
          <GraduationCap className="w-7 h-7" />
        </div>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
              {school.schoolName}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isNeisLive
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isNeisLive ? 'bg-emerald-400 animate-pulse-glow' : 'bg-amber-400'
                }`}
              />
              {isNeisLive ? 'NEIS 실시간 연동' : '로컬 캐시 모드'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {school.officeName} · 학교코드 {school.schoolCode} · 학사일정 & 행사 알리미
          </p>
        </div>
      </div>

      {/* Header Actions & Auth */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* School Switcher */}
        <button
          onClick={onOpenSchoolSearch}
          className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all"
          title="학교 변경 및 전국 학교 조회"
        >
          <Search className="w-4 h-4 text-cyan-400" />
          <span>타 학교 조회</span>
        </button>

        {/* Daily Briefing Settings */}
        <button
          onClick={onOpenNotificationModal}
          className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md shadow-indigo-600/30 transition-all"
          title="맞춤 브리핑 및 웹 알림 설정"
        >
          <Bell className="w-4 h-4" />
          <span>맞춤 브리핑</span>
          {isNotifEnabled && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
              ON
            </span>
          )}
        </button>

        {/* Authentication Section */}
        {!user ? (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-white/15 transition-all shadow-md"
            title="GitHub 계정 로그인"
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>GitHub 로그인</span>
          </button>
        ) : (
          <div className="relative flex items-center gap-2" ref={dropdownRef}>
            {/* User Profile Pill */}
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all select-none"
              title="계정 정보 및 메뉴"
            >
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/80"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight">
                  {user.name || user.login}
                </span>
                <span className="text-[10px] font-semibold text-cyan-300">
                  {gradeClassText}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* Quick Header Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-all"
              title="계정 로그아웃"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">로그아웃</span>
            </button>

            {/* Dropdown Popover */}
            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2.5 w-72 rounded-2xl bg-slate-900 border border-white/15 shadow-2xl backdrop-blur-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                {/* User Head */}
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-cyan-400/80"
                  />
                  <div className="overflow-hidden">
                    <div className="text-sm font-bold text-white truncate">
                      {user.name || user.login}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      @{user.login}
                    </div>
                  </div>
                </div>

                {/* Student Grade / Class Card */}
                <div className="my-3 p-3 rounded-xl bg-gradient-to-r from-indigo-950/60 to-cyan-950/60 border border-indigo-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400">
                        소속 학급
                      </div>
                      <div className="text-xs font-bold text-white">
                        {studentProfile
                          ? `${studentProfile.grade}학년 ${studentProfile.classNum}반 (${studentProfile.dept || '전기전자과'})`
                          : '설정 필요'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenGradeClassModal();
                    }}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-300 text-xs font-medium flex items-center gap-1"
                    title="학년/반 정보 수정"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>수정</span>
                  </button>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-black/30 text-center my-3 text-xs">
                  <div>
                    <div className="font-bold text-cyan-400">
                      {user.public_repos ?? 0}
                    </div>
                    <div className="text-[10px] text-slate-400">저장소</div>
                  </div>
                  <div>
                    <div className="font-bold text-indigo-400">
                      {user.followers ?? 0}
                    </div>
                    <div className="text-[10px] text-slate-400">팔로워</div>
                  </div>
                  <div>
                    <div className="font-bold text-emerald-400">
                      {bookmarkCount}
                    </div>
                    <div className="text-[10px] text-slate-400">내 D-Day</div>
                  </div>
                </div>

                {/* Menu List */}
                <div className="space-y-1 pt-1 text-xs">
                  <a
                    href={`https://github.com/${user.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 w-full p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span>GitHub 프로필 방문</span>
                  </a>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onSyncData();
                    }}
                    className="flex items-center justify-between w-full p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Database className="w-4 h-4 text-emerald-400" />
                      <span>Supabase에 저장 및 동기화</span>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                        isSupabaseReady
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {isSupabaseReady ? '연결됨' : '설정 필요'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenAuthModal();
                    }}
                    className="flex items-center gap-2.5 w-full p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all text-left"
                  >
                    <RefreshCw className="w-4 h-4 text-cyan-400" />
                    <span>Supabase 설정 & DB 스키마</span>
                  </button>

                  <div className="my-1.5 border-t border-white/10" />

                  {/* Dropdown Logout */}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="flex items-center gap-2.5 w-full p-2 rounded-lg text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 transition-all font-semibold text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
