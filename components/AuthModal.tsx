'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import { UserProfile } from '@/types/schedule';
import {
  X,
  Search,
  ShieldCheck,
  Zap,
  Settings2,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import {
  testSupabaseConnection,
  SUPABASE_SQL_SCHEMA,
  getSupabaseClient,
} from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onSaveSupabaseConfig: (url: string, key: string) => void;
  supabaseUrl: string;
  supabaseKey: string;
}

export function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onSaveSupabaseConfig,
  supabaseUrl: initialUrl,
  supabaseKey: initialKey,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'supabase' | 'username' | 'config'>(
    'supabase'
  );
  const [usernameInput, setUsernameInput] = useState('jkpdj17-arch');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);

  const [supaUrl, setSupaUrl] = useState(initialUrl);
  const [supaKey, setSupaKey] = useState(initialKey);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);

  if (!isOpen) return null;

  const handleFetchGithubUser = async (targetUser: string) => {
    if (!targetUser.trim()) return;
    setSearching(true);
    setSearchError(null);
    try {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(targetUser.trim())}`,
        {
          headers: { Accept: 'application/vnd.github.v3+json' },
        }
      );
      if (!res.ok) {
        if (res.status === 404)
          throw new Error(`'${targetUser}' 사용자를 찾을 수 없습니다.`);
        if (res.status === 403)
          throw new Error('GitHub API 일시적 요청 한도 초과입니다.');
        throw new Error(`GitHub 통신 오류 (코드 ${res.status})`);
      }
      const data = await res.json();
      const user: UserProfile = {
        id: data.id,
        login: data.login,
        name: data.name || data.login,
        avatar_url:
          data.avatar_url ||
          'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        bio: data.bio || '대진전자통신고등학교 학생 개발자',
        public_repos: data.public_repos || 0,
        followers: data.followers || 0,
        connectedAt: new Date().toISOString(),
      };
      setPendingUser(user);
    } catch (err: unknown) {
      setPendingUser(null);
      setSearchError(
        err instanceof Error ? err.message : '사용자 정보를 불러올 수 없습니다.'
      );
    } finally {
      setSearching(false);
    }
  };

  const handleQuickDemo = () => {
    const demoUser: UserProfile = {
      id: 101382405,
      login: 'jkpdj17-arch',
      name: '대진전자통신고 학생개발자',
      avatar_url: 'https://avatars.githubusercontent.com/u/101382405?v=4',
      bio: '대진전자통신고등학교 소프트웨어 개발 학생',
      public_repos: 12,
      followers: 24,
      connectedAt: new Date().toISOString(),
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    const res = await testSupabaseConnection(supaUrl.trim(), supaKey.trim());
    setTestResult(res);
    setTestingConnection(false);
  };

  const handleSaveConfig = () => {
    onSaveSupabaseConfig(supaUrl.trim(), supaKey.trim());
    setTestResult({
      success: true,
      message: 'Supabase 설정이 브라우저에 저장되었습니다.',
    });
  };

  const handleLaunchSupabaseOAuth = async () => {
    const client = getSupabaseClient(supaUrl.trim(), supaKey.trim());
    if (client) {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.href : '',
        },
      });
      if (error) {
        setSearchError(`OAuth 실패: ${error.message}`);
      }
    } else {
      setActiveTab('config');
      setTestResult({
        success: false,
        message: 'Supabase URL과 Anon Key를 먼저 설정해주세요.',
      });
    }
  };

  const handleCopySchema = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/15 flex items-center justify-center text-white shadow-md">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Supabase & GitHub 계정 연동</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                  클라우드 저장
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                소속 학년/반과 D-Day를 Supabase 데이터베이스에 영구 저장합니다.
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

        {/* Tab Nav */}
        <div className="flex border-b border-white/10 px-5 pt-2 text-xs font-semibold gap-3">
          <button
            onClick={() => setActiveTab('supabase')}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'supabase'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Supabase / 빠른 로그인
          </button>
          <button
            onClick={() => setActiveTab('username')}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'username'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            GitHub 아이디 연동
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase 설정 & DB 스키마</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs md:text-sm">
          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Supabase 데이터베이스 연동 준비 완료</span>
                </div>
                <button
                  onClick={() => setActiveTab('config')}
                  className="text-[11px] underline text-cyan-300 font-semibold"
                >
                  설정 확인
                </button>
              </div>

              <p className="text-slate-300 leading-relaxed text-xs">
                Supabase에 학적(학년/반) 및 D-Day 북마크가 실시간 저장되어,
                언제 어디서 접속해도 설정한 데이터가 안전하게 보존 및 복원됩니다.
              </p>

              <button
                onClick={handleLaunchSupabaseOAuth}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold border border-white/20 transition-all text-xs md:text-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>Supabase GitHub OAuth로 로그인</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/10" />
                <span className="flex-shrink mx-3 text-slate-500 text-[11px]">
                  또는 빠른 체험 및 연동
                </span>
                <div className="flex-grow border-t border-white/10" />
              </div>

              <button
                onClick={handleQuickDemo}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold transition-all shadow-md text-xs"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>⚡ 빠른 학생 데모 계정으로 체험 로그인</span>
              </button>
            </div>
          )}

          {activeTab === 'username' && (
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed text-xs">
                본인의 GitHub 사용자명을 입력하면 프로필을 불러와 Supabase 데이터와
                즉시 동기화합니다.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleFetchGithubUser(usernameInput)
                  }
                  placeholder="GitHub 아이디 (예: jkpdj17-arch, octocat)"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs md:text-sm font-mono"
                />
                <button
                  onClick={() => handleFetchGithubUser(usernameInput)}
                  disabled={searching}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 transition-all text-xs flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>조회</span>
                </button>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[11px] text-slate-400 font-semibold">
                  추천 아이디:
                </span>
                {['jkpdj17-arch', 'octocat'].map((usr) => (
                  <button
                    key={usr}
                    onClick={() => {
                      setUsernameInput(usr);
                      handleFetchGithubUser(usr);
                    }}
                    className="px-2.5 py-1 rounded-full text-xs font-mono bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 transition-all"
                  >
                    @{usr}
                  </button>
                ))}
              </div>

              {searchError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                  {searchError}
                </div>
              )}

              {/* Real-time Preview */}
              {pendingUser && (
                <div className="p-4 rounded-xl bg-black/50 border border-cyan-500/40 flex items-start gap-3.5 mt-2 animate-in fade-in">
                  <img
                    src={pendingUser.avatar_url}
                    alt={pendingUser.login}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-cyan-400 flex-shrink-0"
                  />
                  <div className="flex-1 overflow-hidden space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {pendingUser.name}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        @{pendingUser.login}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        확인됨
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {pendingUser.bio}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span>
                        저장소{' '}
                        <strong className="text-cyan-400">
                          {pendingUser.public_repos}
                        </strong>
                        개
                      </span>
                      <span>
                        팔로워{' '}
                        <strong className="text-indigo-400">
                          {pendingUser.followers}
                        </strong>
                        명
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-slate-300 leading-relaxed">
                Supabase의 Project URL과 Anon Public Key를 입력하면, 사용자 학년/반과
                D-Day 북마크가 브라우저 및 Supabase 데이터베이스에 실시간으로
                저장됩니다.
              </div>

              <div>
                <label className="block font-semibold text-white mb-1.5 text-xs">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={supaUrl}
                  onChange={(e) => setSupaUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-white mb-1.5 text-xs">
                  Supabase Anon Public Key
                </label>
                <input
                  type="password"
                  value={supaKey}
                  onChange={(e) => setSupaKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                    testResult.success
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleTestConnection}
                  disabled={testingConnection || !supaUrl || !supaKey}
                  className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 text-slate-200 font-bold transition-all text-xs"
                >
                  {testingConnection ? '연결 확인 중...' : '연결 테스트'}
                </button>
                <button
                  onClick={handleSaveConfig}
                  className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all text-xs flex items-center justify-center gap-1.5"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>설정 저장</span>
                </button>
              </div>

              {/* Collapsible Supabase Schema Helper */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">
                    Supabase 테이블 생성 SQL 쿼리
                  </span>
                  <button
                    onClick={handleCopySchema}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-cyan-300 transition-all"
                  >
                    {copiedSchema ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>복사됨!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>SQL 복사</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-black/60 border border-white/10 text-[10px] text-slate-400 font-mono overflow-x-auto max-h-32">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
                <p className="text-[10px] text-slate-500 mt-1">
                  Supabase 대시보드 &gt; SQL Editor에 붙여넣고 실행(Run)하면
                  테이블이 자동 구성됩니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-black/30">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            닫기
          </button>

          {activeTab === 'username' && (
            <button
              disabled={!pendingUser}
              onClick={() => {
                if (pendingUser) {
                  onLoginSuccess(pendingUser);
                  onClose();
                }
              }}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold transition-all text-xs"
            >
              이 계정으로 로그인 & Supabase 연동
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
