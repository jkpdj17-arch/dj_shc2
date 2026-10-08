import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StudentProfile, CustomDday, BookmarkedEvent, NotificationConfig } from '@/types/schedule';

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export function getSupabaseCredentials(): { url: string; key: string } {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem('dj_supabase_url') || '';
    const localKey = localStorage.getItem('dj_supabase_key') || '';
    return {
      url: localUrl || envUrl,
      key: localKey || envKey,
    };
  }

  return { url: envUrl, key: envKey };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(
    url &&
    key &&
    url.startsWith('http') &&
    !url.includes('your-project.supabase.co') &&
    !key.includes('your-anon-key') &&
    key.length > 15
  );
}

export function getEffectiveUserLogin(userLogin?: string): string {
  if (userLogin && userLogin.trim()) return userLogin.trim();
  if (typeof window !== 'undefined') {
    let guestId = localStorage.getItem('dj_guest_id');
    if (!guestId) {
      guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('dj_guest_id', guestId);
    }
    return guestId;
  }
  return 'guest_user';
}

export function getSupabaseClient(customUrl?: string, customKey?: string): SupabaseClient | null {
  const creds = getSupabaseCredentials();
  const url = customUrl || creds.url;
  const key = customKey || creds.key;

  if (!url || !key || !url.startsWith('http')) {
    return null;
  }

  if (cachedClient && lastUsedUrl === url && lastUsedKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    lastUsedUrl = url;
    lastUsedKey = key;
    return cachedClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Test Supabase connection validity
 */
export async function testSupabaseConnection(
  url: string,
  key: string
): Promise<{ success: boolean; message: string }> {
  if (!url || !key) {
    return { success: false, message: 'Supabase URL과 Anon Key를 모두 입력해주세요.' };
  }
  if (!url.startsWith('http')) {
    return { success: false, message: 'URL은 https://로 시작해야 합니다.' };
  }

  try {
    const client = createClient(url, key);
    const { error } = await client.auth.getSession();
    if (error && !error.message.includes('Auth session missing')) {
      return { success: false, message: `연결 실패: ${error.message}` };
    }
    return { success: true, message: 'Supabase 프로젝트와 성공적으로 연결되었습니다!' };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Supabase 연결에 실패했습니다.',
    };
  }
}

/**
 * Save / Upsert Student Grade & Class Profile to Supabase
 */
export async function saveStudentProfileToSupabase(
  userLogin: string,
  profile: StudentProfile
): Promise<{ success: boolean; message?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase 설정이 구성되지 않았습니다.' };
  }

  const effectiveUser = getEffectiveUserLogin(userLogin);

  try {
    const { error } = await client.from('student_profiles').upsert(
      {
        user_login: effectiveUser,
        grade: profile.grade,
        class_num: profile.classNum,
        dept: profile.dept || '전기전자과',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_login' }
    );

    if (error) {
      console.warn('Supabase profile save error:', error);
      return { success: false, message: error.message };
    }

    client.auth.updateUser({
      data: {
        grade: profile.grade,
        classNum: profile.classNum,
        dept: profile.dept,
      },
    }).catch(() => {});

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Supabase 저장 실패';
    return { success: false, message: msg };
  }
}

/**
 * Fetch Student Profile from Supabase
 */
export async function fetchStudentProfileFromSupabase(
  userLogin: string
): Promise<StudentProfile | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  const effectiveUser = getEffectiveUserLogin(userLogin);

  try {
    const { data, error } = await client
      .from('student_profiles')
      .select('grade, class_num, dept, updated_at')
      .eq('user_login', effectiveUser)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      grade: String(data.grade),
      classNum: String(data.class_num),
      dept: data.dept || '전기전자과',
      updatedAt: data.updated_at || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Save User D-Days and Bookmarks to Supabase
 */
export async function saveUserDataToSupabase(
  userLogin?: string,
  customDdays: CustomDday[] = [],
  bookmarks: BookmarkedEvent[] = [],
  notifConfig?: NotificationConfig,
  schoolCode?: string
): Promise<{ success: boolean; message?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase가 설정되지 않았습니다.' };
  }

  const effectiveUser = getEffectiveUserLogin(userLogin);

  try {
    const { error } = await client.from('user_ddays').upsert(
      {
        user_login: effectiveUser,
        ddays: customDdays,
        bookmarks: bookmarks,
        notif_time: notifConfig?.time || '08:00',
        notif_enabled: notifConfig?.enabled ?? true,
        school_code: schoolCode || '7150597',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_login' }
    );

    if (error) {
      console.warn('Supabase user_ddays save error:', error);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Supabase 동기화 오류';
    return { success: false, message: msg };
  }
}

/**
 * Fetch User D-Days and Bookmarks from Supabase
 */
export async function fetchUserDataFromSupabase(userLogin?: string): Promise<{
  customDdays: CustomDday[];
  bookmarks: BookmarkedEvent[];
  notifTime?: string;
  notifEnabled?: boolean;
} | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  const effectiveUser = getEffectiveUserLogin(userLogin);

  try {
    const { data, error } = await client
      .from('user_ddays')
      .select('ddays, bookmarks, notif_time, notif_enabled')
      .eq('user_login', effectiveUser)
      .maybeSingle();

    if (error || !data) return null;

    return {
      customDdays: Array.isArray(data.ddays) ? data.ddays : [],
      bookmarks: Array.isArray(data.bookmarks) ? data.bookmarks : [],
      notifTime: data.notif_time,
      notifEnabled: data.notif_enabled,
    };
  } catch {
    return null;
  }
}

/**
 * Helpful Ready-to-use Supabase SQL Schema for tables
 */
export const SUPABASE_SQL_SCHEMA = `-- 1. 소속 학년/반 저장 테이블
create table if not exists public.student_profiles (
  user_login text primary key,
  grade text not null,
  class_num text not null,
  dept text default '전기전자과',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. D-Day, 북마크 및 알림 설정 저장 테이블
create table if not exists public.user_ddays (
  user_login text primary key,
  ddays jsonb default '[]'::jsonb,
  bookmarks jsonb default '[]'::jsonb,
  notif_time text default '08:00',
  notif_enabled boolean default true,
  school_code text default '7150597',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. RLS(Row Level Security) 설정 및 조회/수정 권한 활성화
alter table public.student_profiles enable row level security;
drop policy if exists "Allow public access for student_profiles" on public.student_profiles;
create policy "Allow public access for student_profiles"
  on public.student_profiles for all using (true) with check (true);

alter table public.user_ddays enable row level security;
drop policy if exists "Allow public access for user_ddays" on public.user_ddays;
create policy "Allow public access for user_ddays"
  on public.user_ddays for all using (true) with check (true);
`;
