import { NextRequest, NextResponse } from 'next/server';
import {
  categorizeEvent,
  parseYmd,
  getGradeLabel,
  CURATED_HIGHLIGHTS_2026,
} from '@/lib/neis-data';
import { ScheduleEvent } from '@/types/schedule';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const officeCode = searchParams.get('officeCode') || 'C10';
  const schoolCode = searchParams.get('schoolCode') || '7150597';
  const year = parseInt(searchParams.get('year') || '2026', 10);
  const month = parseInt(searchParams.get('month') || '10', 10);

  const yyyy = String(year);
  const mm = String(month).padStart(2, '0');
  const lastDay = new Date(year, month, 0).getDate();
  const fromYmd = `${yyyy}${mm}01`;
  const toYmd = `${yyyy}${mm}${String(lastDay).padStart(2, '0')}`;

  const apiUrl = `https://open.neis.go.kr/hub/SchoolSchedule?Type=json&ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&AA_FROM_YMD=${fromYmd}&AA_TO_YMD=${toYmd}`;

  const events: ScheduleEvent[] = [];

  try {
    const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (
        data.SchoolSchedule &&
        data.SchoolSchedule[1] &&
        Array.isArray(data.SchoolSchedule[1].row)
      ) {
        data.SchoolSchedule[1].row.forEach((row: {
          AA_YMD: string;
          EVENT_NM: string;
          EVENT_CNTNT?: string;
          SBTR_DD_SC_NM?: string;
          ONE_GRADE_EVENT_YN?: string;
          TW_GRADE_EVENT_YN?: string;
          THREE_GRADE_EVENT_YN?: string;
        }) => {
          const dateStr = parseYmd(row.AA_YMD);
          const enriched = categorizeEvent(
            row.EVENT_NM,
            row.EVENT_CNTNT,
            row.SBTR_DD_SC_NM
          );
          events.push({
            id: `${row.AA_YMD}_${row.EVENT_NM}_${Math.random().toString(36).substring(2, 6)}`,
            date: dateStr,
            title: row.EVENT_NM,
            category: enriched.category,
            content: enriched.desc,
            tip: enriched.tip,
            deduct: row.SBTR_DD_SC_NM || '해당없음',
            gradeStr: getGradeLabel(row),
            ONE_GRADE_EVENT_YN: row.ONE_GRADE_EVENT_YN,
            TW_GRADE_EVENT_YN: row.TW_GRADE_EVENT_YN,
            THREE_GRADE_EVENT_YN: row.THREE_GRADE_EVENT_YN,
            isNeis: true,
          });
        });
      }
    }
  } catch (err) {
    console.warn('NEIS API fetch failed, using curated data:', err);
  }

  // If Daejin High School, inject or ensure curated highlight events for this month
  if (schoolCode === '7150597') {
    CURATED_HIGHLIGHTS_2026.forEach((h) => {
      const [hY, hM] = h.date.split('-').map(Number);
      if (hY === year && hM === month) {
        const exists = events.some(
          (e) => e.date === h.date && e.title.includes(h.name.replace(/ \(.*\)/, ''))
        );
        if (!exists) {
          events.push({
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
          });
        }
      }
    });
  }

  return NextResponse.json({
    success: true,
    year,
    month,
    events,
  });
}
