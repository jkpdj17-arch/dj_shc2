import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: '대진전자통신고 학사일정 및 행사 알리미',
  description: 'NEIS 공식 학사일정 실시간 연동, 월간/주간 인터랙티브 캘린더, 맞춤형 브리핑 알림 및 GitHub 학생 계정 연동 서비스',
  openGraph: {
    title: '대진전자통신고 학사일정 및 행사 알리미',
    description: 'NEIS 공식 학사일정 실시간 연동, 월간/주간 인터랙티브 캘린더, 맞춤형 브리핑 알림 및 GitHub 학생 계정 연동 서비스',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '대진전자통신고 학사일정 및 행사 알리미',
    description: 'NEIS 공식 학사일정 실시간 연동, 월간/주간 인터랙티브 캘린더, 맞춤형 브리핑 알림 및 GitHub 학생 계정 연동 서비스',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
