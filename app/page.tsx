'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ScheduleEvent,
  SchoolInfo,
  UserProfile,
  StudentProfile,
  CustomDday,
  BookmarkedEvent,
  NotificationConfig,
  ToastMessage,
} from '@/types/schedule';
import { DEFAULT_SCHOOL, CURATED_HIGHLIGHTS_2026 } from '@/lib/neis-data';
import {
  saveStudentProfileToSupabase,
  fetchStudentProfileFromSupabase,
  saveUserDataToSupabase,
  fetchUserDataFromSupabase,
  isSupabaseConfigured,
} from '@/lib/supabase';

import { Header } from '@/components/Header';
import { BriefingBanner } from '@/components/BriefingBanner';
import { CalendarView } from '@/components/CalendarView';
import { Sidebar } from '@/components/Sidebar';
import { EventDetailModal } from '@/components/EventDetailModal';
import { NotificationModal } from '@/components/NotificationModal';
import { SchoolSearchModal } from '@/components/SchoolSearchModal';
import { CustomDdayModal } from '@/components/CustomDdayModal';
import { AuthModal } from '@/components/AuthModal';
import { GradeClassModal } from '@/components/GradeClassModal';
import { ToastContainer } from '@/components/ToastContainer';

export default function Home() {
  // 1. Core State
  const [school, setSchool] = useState<SchoolInfo>(DEFAULT_SCHOOL);
  const [year, setYear] = useState<number>(2026);
  const [month, setMonth] = useState<number>(10);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-06');
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    return CURATED_HIGHLIGHTS_2026.map((h) => ({
      id: `curated_${h.date}_${h.name}`,
      date: h.date,
      title: h.name,
      category: h.category,
      content: h.desc,
      tip: '대진전자통신고 공식 추천 학사 행사입니다.',
      deduct: '해당없음',
      gradeStr: '전체 학년',
      ONE_GRADE_EVENT_YN: 'Y',
      TW_GRADE_EVENT_YN: 'Y',
      THREE_GRADE_EVENT_YN: 'Y',
      isHighlight: true,
    }));
  });
  const [isNeisLive, setIsNeisLive] = useState<boolean>(true);

  // 2. User & Personalization State (clean defaults on SSR and client to prevent hydration mismatch)
  const [user, setUser] = useState<UserProfile | null>(null);
  const [studentProfiles, setStudentProfiles] = useState<
    Record<string, StudentProfile>
  >({});
  const [bookmarks, setBookmarks] = useState<BookmarkedEvent[]>([]);
  const [customDdays, setCustomDdays] = useState<CustomDday[]>([]);
  const [notifConfig, setNotifConfig] = useState<NotificationConfig>({
    enabled: true,
    time: '08:00',
    lastNotifiedDate: '',
  });

  // Supabase Config
  const [supabaseUrl, setSupabaseUrl] = useState<string>('');
  const [supabaseKey, setSupabaseKey] = useState<string>('');

  // Hydrate local client data safely after initial mount without hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedUser = localStorage.getItem('dj_github_user');
        if (storedUser) setUser(JSON.parse(storedUser));

        const storedProfiles = localStorage.getItem('dj_student_profiles');
        if (storedProfiles) setStudentProfiles(JSON.parse(storedProfiles));

        const storedBookmarks = localStorage.getItem('dj_bookmarks');
        if (storedBookmarks) setBookmarks(JSON.parse(storedBookmarks));

        const storedDdays = localStorage.getItem('dj_custom_ddays');
        if (storedDdays) setCustomDdays(JSON.parse(storedDdays));

        const storedNotif = localStorage.getItem('dj_notif_config');
        if (storedNotif) setNotifConfig(JSON.parse(storedNotif));

        const storedSupaUrl = localStorage.getItem('dj_supabase_url');
        if (storedSupaUrl) setSupabaseUrl(storedSupaUrl);

        const storedSupaKey = localStorage.getItem('dj_supabase_key');
        if (storedSupaKey) setSupabaseKey(storedSupaKey);
      } catch (err) {
        console.warn('Hydration sync failed:', err);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const isSupabaseReady = useMemo(() => {
    return isSupabaseConfigured() || Boolean(supabaseUrl && supabaseKey);
  }, [supabaseUrl, supabaseKey]);

  // 3. Modal States
  const [selectedEventModal, setSelectedEventModal] =
    useState<ScheduleEvent | null>(null);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isSchoolSearchOpen, setIsSchoolSearchOpen] = useState(false);
  const [isCustomDdayOpen, setIsCustomDdayOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGradeClassModalOpen, setIsGradeClassModalOpen] = useState(false);

  // 4. Toast Notification System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
      const id = `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev, { id, text, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 5. Current User's Student Profile
  const currentStudentProfile = useMemo(() => {
    if (!user) return null;
    return studentProfiles[user.login] || null;
  }, [user, studentProfiles]);

  const triggerBriefingNotification = useCallback(() => {
    const title = `[${school.schoolName}] 오늘의 학사 브리핑`;
    const body = `좋은 아침입니다! 2학기 중간고사 D-14, 대진 솔빛 축제 D-31 남았습니다. 오늘도 힘찬 하루 되세요!`;

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
        addToast('📢 일일 학사 브리핑 알림이 성공적으로 전송되었습니다!', 'success');
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(title, { body });
            addToast('알림 권한이 승인되었습니다. 브리핑이 발송되었습니다.', 'success');
          } else {
            addToast(`[화면 알림] ${title}: ${body}`, 'info');
          }
        });
      } else {
        addToast(`[알림 차단됨 - 화면 안내] ${title}: ${body}`, 'warning');
      }
    } else {
      addToast(`[브리핑 알림] ${title}: ${body}`, 'info');
    }
  }, [school.schoolName, addToast]);

  // 6. Schedule Data Fetching via Async Effect
  useEffect(() => {
    let cancelled = false;

    async function loadSchedule() {
      try {
        const res = await fetch(
          `/api/neis/schedule?officeCode=${school.officeCode}&schoolCode=${school.schoolCode}&year=${year}&month=${month}`
        );
        if (!res.ok) {
          if (!cancelled) setIsNeisLive(false);
          return;
        }
        const data = await res.json();
        if (cancelled) return;

        if (data.success && Array.isArray(data.events)) {
          setEvents((prev) => {
            const merged = [...prev];
            data.events.forEach((newEvent: ScheduleEvent) => {
              const exists = merged.some(
                (e) => e.date === newEvent.date && e.title === newEvent.title
              );
              if (!exists) merged.push(newEvent);
            });
            return merged;
          });
          setIsNeisLive(true);
        } else {
          setIsNeisLive(false);
        }
      } catch (err) {
        console.warn('Schedule fetch error:', err);
        if (!cancelled) setIsNeisLive(false);
      }
    }

    loadSchedule();

    return () => {
      cancelled = true;
    };
  }, [school, year, month]);

  // 7. Daily Briefing Scheduler
  useEffect(() => {
    if (!notifConfig.enabled) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMins}`;
      const todayDateStr = now.toISOString().slice(0, 10);

      if (
        currentTimeStr === notifConfig.time &&
        notifConfig.lastNotifiedDate !== todayDateStr
      ) {
        triggerBriefingNotification();
        const updated = { ...notifConfig, lastNotifiedDate: todayDateStr };
        setNotifConfig(updated);
        localStorage.setItem('dj_notif_config', JSON.stringify(updated));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [notifConfig, triggerBriefingNotification]);

  // 8. Handlers: Navigation
  const handlePrevMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    setYear(2026);
    setMonth(10);
    setSelectedDate('2026-10-06');
  };

  // 9. Handlers: School Change
  const handleSelectSchool = (newSchool: SchoolInfo) => {
    setSchool(newSchool);
    setEvents([]);
    addToast(
      `${newSchool.schoolName}(으)로 변경되었습니다. 최신 학사일정을 동기화합니다.`,
      'success'
    );
  };

  // 10. Handlers: Bookmarks & Custom D-Days (with real-time Supabase saving)
  const handleToggleBookmark = async (ev: ScheduleEvent) => {
    const exists = bookmarks.some(
      (b) => b.title === ev.title && b.date === ev.date
    );
    let updated: BookmarkedEvent[];
    if (exists) {
      updated = bookmarks.filter(
        (b) => !(b.title === ev.title && b.date === ev.date)
      );
    } else {
      updated = [
        ...bookmarks,
        {
          title: ev.title,
          date: ev.date,
          category: ev.category,
        },
      ];
    }
    setBookmarks(updated);
    localStorage.setItem('dj_bookmarks', JSON.stringify(updated));

    // Real-time Save to Supabase
    if (isSupabaseReady) {
      const res = await saveUserDataToSupabase(
        user?.login,
        customDdays,
        updated,
        notifConfig,
        school.schoolCode
      );
      if (res.success) {
        if (exists) {
          addToast(`⭐ '${ev.title}' 즐겨찾기 해제 완료 (Supabase 클라우드 동기화됨)`, 'info');
        } else {
          addToast(`⭐ '${ev.title}' 일정이 Supabase 클라우드 및 D-Day에 안전하게 저장되었습니다!`, 'success');
        }
      } else {
        addToast(
          exists
            ? `'${ev.title}' D-Day 고정이 해제되었습니다. (Supabase 오류: ${res.message})`
            : `'${ev.title}' 일정이 D-Day에 고정되었습니다. (Supabase 오류: ${res.message})`,
          'warning'
        );
      }
    } else {
      if (exists) {
        addToast(`'${ev.title}' D-Day 고정이 해제되었습니다.`, 'info');
      } else {
        addToast(
          `⭐ '${ev.title}' 일정이 D-Day에 고정되었습니다! (Supabase 연결 시 클라우드 실시간 동기화)`,
          'success'
        );
      }
    }
  };

  const handleAddCustomDday = async (
    title: string,
    date: string,
    category: ScheduleEvent['category']
  ) => {
    const newDday: CustomDday = {
      id: `custom_${Date.now()}`,
      title,
      date,
      category,
    };
    const updated = [...customDdays, newDday];
    setCustomDdays(updated);
    localStorage.setItem('dj_custom_ddays', JSON.stringify(updated));

    // Real-time Save to Supabase
    if (isSupabaseReady) {
      const res = await saveUserDataToSupabase(
        user?.login,
        updated,
        bookmarks,
        notifConfig,
        school.schoolCode
      );
      if (res.success) {
        addToast(`📌 '${title}' D-Day가 Supabase 클라우드 데이터베이스에 실시간 저장되었습니다!`, 'success');
      } else {
        addToast(`📌 '${title}' D-Day가 추가되었습니다. (Supabase 오류: ${res.message})`, 'warning');
      }
    } else {
      addToast(`📌 '${title}' D-Day가 성공적으로 추가되었습니다. (Supabase 연결 시 클라우드 자동 저장)`, 'success');
    }
  };

  const handleDeleteCustomDday = async (title: string, date: string) => {
    const updated = customDdays.filter(
      (c) => !(c.title === title && c.date === date)
    );
    setCustomDdays(updated);
    localStorage.setItem('dj_custom_ddays', JSON.stringify(updated));

    if (isSupabaseReady) {
      const res = await saveUserDataToSupabase(
        user?.login,
        updated,
        bookmarks,
        notifConfig,
        school.schoolCode
      );
      if (res.success) {
        addToast(`🗑️ '${title}' D-Day가 Supabase 및 목록에서 삭제되었습니다.`, 'info');
      } else {
        addToast(`🗑️ '${title}' D-Day가 삭제되었습니다. (Supabase 오류: ${res.message})`, 'warning');
      }
    } else {
      addToast(`🗑️ '${title}' D-Day가 목록에서 삭제되었습니다.`, 'info');
    }
  };

  // 11. Handlers: Authentication & LOGOUT
  const handleLoginSuccess = async (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    localStorage.setItem('dj_github_user', JSON.stringify(loggedInUser));

    // 1) First check local profile
    let currentProfile = studentProfiles[loggedInUser.login];

    // 2) If Supabase is configured, fetch remote profile and D-Days!
    if (isSupabaseReady) {
      try {
        const remoteProfile = await fetchStudentProfileFromSupabase(loggedInUser.login);
        if (remoteProfile) {
          currentProfile = remoteProfile;
          setStudentProfiles((prev) => {
            const merged = { ...prev, [loggedInUser.login]: remoteProfile };
            localStorage.setItem('dj_student_profiles', JSON.stringify(merged));
            return merged;
          });
          setFilterGrade(remoteProfile.grade);
          addToast(
            `☁️ Supabase에서 [${remoteProfile.grade}학년 ${remoteProfile.classNum}반] 학적 정보를 복원했습니다!`,
            'success'
          );
        }

        const remoteData = await fetchUserDataFromSupabase(loggedInUser.login);
        if (remoteData) {
          let mergedDdays = [...customDdays];
          if (remoteData.customDdays && remoteData.customDdays.length > 0) {
            remoteData.customDdays.forEach((rem) => {
              if (!mergedDdays.some((c) => c.title === rem.title && c.date === rem.date)) {
                mergedDdays.push(rem);
              }
            });
            setCustomDdays(mergedDdays);
            localStorage.setItem('dj_custom_ddays', JSON.stringify(mergedDdays));
          }

          let mergedBookmarks = [...bookmarks];
          if (remoteData.bookmarks && remoteData.bookmarks.length > 0) {
            remoteData.bookmarks.forEach((rem) => {
              if (!mergedBookmarks.some((b) => b.title === rem.title && b.date === rem.date)) {
                mergedBookmarks.push(rem);
              }
            });
            setBookmarks(mergedBookmarks);
            localStorage.setItem('dj_bookmarks', JSON.stringify(mergedBookmarks));
          }

          // Ensure Supabase has merged collection
          saveUserDataToSupabase(loggedInUser.login, mergedDdays, mergedBookmarks, notifConfig, school.schoolCode);
        } else {
          // Push existing local D-days & bookmarks to Supabase
          if (customDdays.length > 0 || bookmarks.length > 0) {
            saveUserDataToSupabase(loggedInUser.login, customDdays, bookmarks, notifConfig, school.schoolCode);
          }
        }
      } catch (err) {
        console.warn('Supabase fetch on login error:', err);
      }
    }

    if (currentProfile) {
      setFilterGrade(currentProfile.grade);
      if (!isSupabaseReady) {
        addToast(
          `🎉 환영합니다, @${loggedInUser.login}님! [${currentProfile.grade}학년 ${currentProfile.classNum}반] 맞춤 정보가 자동 복원되었습니다.`,
          'success'
        );
      }
    } else {
      // Prompt for Grade and Class onboarding
      setIsGradeClassModalOpen(true);
      addToast(
        '로그인이 완료되었습니다! 학사일정 안내를 위해 학년과 반을 설정해주세요.',
        'info'
      );
    }
  };

  const handleLogout = () => {
    const prevLogin = user?.login || '사용자';
    setUser(null);
    localStorage.removeItem('dj_github_user');
    setFilterGrade('all');
    addToast(
      `@${prevLogin} 계정에서 안전하게 로그아웃되었습니다. (설정된 학적 및 D-Day 정보는 보관됨)`,
      'info'
    );
  };

  // 12. Handlers: Save Student Grade & Class (with Supabase save!)
  const handleSaveGradeClass = async (
    grade: string,
    classNum: string,
    dept: string
  ) => {
    if (!user) {
      addToast('로그인이 필요한 기능입니다.', 'warning');
      return;
    }
    const profile: StudentProfile = {
      grade,
      classNum,
      dept,
      updatedAt: new Date().toISOString(),
    };
    const updated = {
      ...studentProfiles,
      [user.login]: profile,
    };
    setStudentProfiles(updated);
    localStorage.setItem('dj_student_profiles', JSON.stringify(updated));
    setFilterGrade(grade);

    // Save to Supabase
    if (isSupabaseReady) {
      const res = await saveStudentProfileToSupabase(user.login, profile);
      if (res.success) {
        addToast(
          `✅ [${grade}학년 ${classNum}반 (${dept})] Supabase 및 계정에 성공적으로 저장되었습니다!`,
          'success'
        );
      } else {
        addToast(
          `⚠️ 로컬 저장 완료 (Supabase 저장 오류: ${res.message || '확인 필요'})`,
          'warning'
        );
      }
    } else {
      addToast(
        `✅ [${grade}학년 ${classNum}반 (${dept})] 로컬에 저장되었습니다. (Supabase 설정 시 클라우드 영구 동기화)`,
        'info'
      );
    }
  };

  // 13. Sync All Data to Supabase Handler
  const handleSyncData = async () => {
    if (!user) {
      addToast('로그인 후 Supabase에 저장할 수 있습니다.', 'warning');
      return;
    }

    if (!isSupabaseReady) {
      addToast(
        '⚠️ Supabase URL과 Key가 아직 등록되지 않았습니다. [Supabase 설정]에서 등록해주세요.',
        'warning'
      );
      setIsAuthModalOpen(true);
      return;
    }

    const currentProf = studentProfiles[user.login];
    let profileSaved = false;

    if (currentProf) {
      const resProf = await saveStudentProfileToSupabase(user.login, currentProf);
      profileSaved = resProf.success;
    }

    const resData = await saveUserDataToSupabase(
      user.login,
      customDdays,
      bookmarks,
      notifConfig,
      school.schoolCode
    );

    if (resData.success || profileSaved) {
      addToast(
        `☁️ @${user.login}님의 학적 및 D-Day 데이터가 Supabase 데이터베이스에 저장되었습니다!`,
        'success'
      );
    } else {
      addToast(
        `⚠️ Supabase 저장 중 오류가 발생했습니다. (테이블 스키마 확인 필요)`,
        'error'
      );
    }
  };

  // Save Supabase Config
  const handleSaveSupabaseConfig = async (url: string, key: string) => {
    setSupabaseUrl(url);
    setSupabaseKey(key);
    localStorage.setItem('dj_supabase_url', url);
    localStorage.setItem('dj_supabase_key', key);
    addToast('Supabase 연동 정보가 브라우저에 저장되었습니다.', 'success');

    // Auto-sync if user is logged in
    if (user && url && key) {
      const currentProf = studentProfiles[user.login];
      if (currentProf) {
        saveStudentProfileToSupabase(user.login, currentProf);
      }
      saveUserDataToSupabase(user.login, customDdays, bookmarks, notifConfig, school.schoolCode);
    }
  };

  // Filter today's events for the briefing banner
  const todayEvents = events.filter((e) => e.date === selectedDate);

  return (
    <div className="min-h-screen text-slate-100 antialiased pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Header */}
        <Header
          school={school}
          isNeisLive={isNeisLive}
          isSupabaseReady={isSupabaseReady}
          user={user}
          studentProfile={currentStudentProfile}
          isNotifEnabled={notifConfig.enabled}
          bookmarkCount={bookmarks.length + customDdays.length}
          onOpenSchoolSearch={() => setIsSchoolSearchOpen(true)}
          onOpenNotificationModal={() => setIsNotifModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenGradeClassModal={() => setIsGradeClassModalOpen(true)}
          onLogout={handleLogout}
          onSyncData={handleSyncData}
        />

        {/* Live Daily Briefing Banner */}
        <BriefingBanner
          schoolName={school.schoolName}
          selectedDate={selectedDate}
          todayEvents={todayEvents}
          onTriggerTestNotif={triggerBriefingNotification}
        />

        {/* Dashboard Grid (Calendar + Sidebar) */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Interactive Calendar (8 Cols) */}
          <div className="lg:col-span-8">
            <CalendarView
              year={year}
              month={month}
              selectedDate={selectedDate}
              viewMode={viewMode}
              filterCategory={filterCategory}
              filterGrade={filterGrade}
              events={events}
              bookmarks={bookmarks}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onGoToday={handleGoToday}
              onSelectDate={(d) => setSelectedDate(d)}
              onSelectEvent={(ev) => setSelectedEventModal(ev)}
              onChangeViewMode={(mode) => setViewMode(mode)}
              onChangeCategory={(cat) => setFilterCategory(cat)}
              onChangeGrade={(g) => setFilterGrade(g)}
            />
          </div>

          {/* Sidebar: D-Day & Highlights (4 Cols) */}
          <div className="lg:col-span-4">
            <Sidebar
              selectedDate={selectedDate}
              events={events}
              bookmarks={bookmarks}
              customDdays={customDdays}
              isSupabaseReady={isSupabaseReady}
              onOpenCustomDdayModal={() => setIsCustomDdayOpen(true)}
              onSelectEvent={(ev) => setSelectedEventModal(ev)}
              onDeleteCustomDday={handleDeleteCustomDday}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      <EventDetailModal
        event={selectedEventModal}
        bookmarks={bookmarks}
        onClose={() => setSelectedEventModal(null)}
        onToggleBookmark={handleToggleBookmark}
      />

      <NotificationModal
        isOpen={isNotifModalOpen}
        config={notifConfig}
        schoolName={school.schoolName}
        onClose={() => setIsNotifModalOpen(false)}
        onSave={(newCfg) => {
          setNotifConfig(newCfg);
          localStorage.setItem('dj_notif_config', JSON.stringify(newCfg));
          addToast(`브리핑 알림 설정이 저장되었습니다. (매일 ${newCfg.time})`, 'success');
          if (user && isSupabaseReady) {
            saveUserDataToSupabase(user.login, customDdays, bookmarks, newCfg, school.schoolCode);
          }
        }}
        onTestNotification={triggerBriefingNotification}
      />

      <SchoolSearchModal
        isOpen={isSchoolSearchOpen}
        onClose={() => setIsSchoolSearchOpen(false)}
        onSelectSchool={handleSelectSchool}
      />

      <CustomDdayModal
        isOpen={isCustomDdayOpen}
        onClose={() => setIsCustomDdayOpen(false)}
        onAddDday={handleAddCustomDday}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSaveSupabaseConfig={handleSaveSupabaseConfig}
        supabaseUrl={supabaseUrl}
        supabaseKey={supabaseKey}
      />

      <GradeClassModal
        isOpen={isGradeClassModalOpen}
        user={user}
        currentProfile={currentStudentProfile}
        onClose={() => setIsGradeClassModalOpen(false)}
        onSave={handleSaveGradeClass}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
