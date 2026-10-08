import { ScheduleEvent, EventCategory, SchoolInfo } from '@/types/schedule';

export const DEFAULT_SCHOOL: SchoolInfo = {
  officeCode: 'C10',
  officeName: '부산광역시교육청',
  schoolCode: '7150597',
  schoolName: '대진전자통신고등학교',
  address: '부산광역시 금정구 수림로 92',
};

export const EVENT_KNOWLEDGE_BASE: Record<
  string,
  { category: EventCategory; desc: string; tip: string }
> = {
  중간고사: {
    category: 'exam',
    desc: '학기 중 학습 성취도를 점검하는 정기 지필평가입니다. 학년별 시간표 및 고사실 배치를 사전에 반드시 확인하세요.',
    tip: '시험 10분 전 입실 완료, 신분증 및 컴퓨터용 수성 사인펜과 수정테이프를 지참하세요.',
  },
  기말고사: {
    category: 'exam',
    desc: '학기말 종합 평가 지필고사입니다. 학기말 성적 산출 비중이 높으므로 취약 과목 복습에 집중하세요.',
    tip: '시험 범위 요약 노트와 오답 노트를 마지막으로 점검하세요.',
  },
  '2학기고사': {
    category: 'exam',
    desc: '3학년 졸업 전 마지막 학기말 성적 산출을 위한 정기 지필평가입니다.',
    tip: '대입 수시 및 취업 포트폴리오 마감과 병행되므로 일정 관리가 중요합니다.',
  },
  영어듣기평가: {
    category: 'exam',
    desc: '전국 시·도교육청 공동주관 영어듣기능력평가입니다. 방송 상태와 문제지를 사전에 점검합니다.',
    tip: '방송 청취 중 집중력을 유지하고 정답 마킹을 정확히 하세요.',
  },
  축제: {
    category: 'festival',
    desc: '대진전자통신고등학교의 자랑, 대진 솔빛 축제! 학생 동아리 발표회, e스포츠 대회, 무대 공연, 체험 부스가 성대하게 열립니다.',
    tip: '다양한 전공 동아리 부스 체험과 밴드/댄스 공연을 함께 즐겨보세요!',
  },
  체육대회: {
    category: 'festival',
    desc: '전교생과 교직원이 하나 되는 열정의 대진 한마음 체육한마당입니다. 반별 축구, 농구, 계주, 줄다리기 경기가 진행됩니다.',
    tip: '충분한 수분 섭취와 준비운동으로 안전사고에 유의하세요!',
  },
  수학여행: {
    category: 'festival',
    desc: '친구들과 잊지 못할 추억을 만드는 현장체험학습(수학여행)입니다.',
    tip: '모둠별 지정 집결 시간 준수 및 개인 안전 수칙을 철저히 지킵니다.',
  },
  여름방학식: {
    category: 'vacation',
    desc: '1학기 교육과정을 마무리하고 알찬 자기계발과 휴식을 위한 여름방학의 시작일입니다.',
    tip: '방학 중 전공 자격증 취득 및 2학기 예습 계획을 세워보세요.',
  },
  겨울방학식: {
    category: 'vacation',
    desc: '한 해의 학사일정을 마무리하는 겨울방학식입니다. 방학 중 동계 방과후학교 및 전공 실습이 병행됩니다.',
    tip: '추운 겨울 건강 관리에 유의하고 다음 학년 준비를 시작하세요.',
  },
  입학식: {
    category: 'festival',
    desc: '새로운 대진인들의 출발을 축하하는 신입생 입학식입니다. 대진전자통신고등학교 가족이 되신 것을 환영합니다!',
    tip: '학교 생활 규정과 전공 학과별 오리엔테이션 내용을 꼼꼼히 확인하세요.',
  },
  개학식: {
    category: 'regular',
    desc: '새 학기 학사 일정이 본격적으로 시작되는 개학식입니다.',
    tip: '새 학기 교과서 배부 및 학급 자치회 구성이 진행됩니다.',
  },
  졸업식: {
    category: 'festival',
    desc: '정든 학교를 떠나 더 큰 사회와 대학으로 힘차게 도약하는 졸업생들을 축하하는 졸업식입니다.',
    tip: '선생님과 친구들에게 감사의 마음을 전하는 소중한 날입니다.',
  },
  수능: {
    category: 'exam',
    desc: '대학수학능력시험일입니다. 수험생들을 위해 학교 전체가 응원하며, 재학생은 휴업일 또는 재량휴업이 적용됩니다.',
    tip: '대진 수험생 여러분의 멋진 도전을 응원합니다!',
  },
};

export const CURATED_HIGHLIGHTS_2026: Array<{
  name: string;
  date: string;
  category: EventCategory;
  icon: string;
  desc: string;
}> = [
  {
    name: '2학기 중간고사 (1·2학년)',
    date: '2026-10-20',
    category: 'exam',
    icon: '📝',
    desc: '2학기 성적의 핵심! 지필평가 기간입니다.',
  },
  {
    name: '대진 솔빛 축제 & 학예제',
    date: '2026-11-06',
    category: 'festival',
    icon: '🎉',
    desc: '동아리 부스, e스포츠 결승, 밴드 공연',
  },
  {
    name: '대학수학능력시험 (수능일)',
    date: '2026-11-19',
    category: 'exam',
    icon: '🎯',
    desc: '수험생 선배 응원 및 재량휴업일',
  },
  {
    name: '2학기 기말고사',
    date: '2026-12-14',
    category: 'exam',
    icon: '📊',
    desc: '학년 마무리 종합 지필평가',
  },
  {
    name: '겨울방학식 & 종업식',
    date: '2027-01-08',
    category: 'vacation',
    icon: '❄️',
    desc: '겨울방학 시작 및 새 학년 준비 기간',
  },
];

export function categorizeEvent(
  eventName: string,
  rawContent?: string,
  deductType?: string
): { category: EventCategory; desc: string; tip: string } {
  const name = eventName || '';
  for (const [key, val] of Object.entries(EVENT_KNOWLEDGE_BASE)) {
    if (name.includes(key)) {
      return {
        category: val.category,
        desc: rawContent && rawContent.trim() ? rawContent : val.desc,
        tip: val.tip,
      };
    }
  }

  if (
    name.includes('고사') ||
    name.includes('시험') ||
    name.includes('평가') ||
    name.includes('능력')
  ) {
    return {
      category: 'exam',
      desc:
        rawContent && rawContent.trim()
          ? rawContent
          : '학습 성취도 평가를 위한 공식 시험 일정입니다.',
      tip: '시험 일정과 과목별 준비물을 점검하세요.',
    };
  }
  if (
    name.includes('방학') ||
    name.includes('휴업') ||
    name.includes('개학')
  ) {
    return {
      category: 'vacation',
      desc:
        rawContent && rawContent.trim()
          ? rawContent
          : '방학 및 학기 전환 관련 공식 학사일정입니다.',
      tip: '일정을 미리 확인하여 방학 계획을 수립하세요.',
    };
  }
  if (
    name.includes('축제') ||
    name.includes('체육') ||
    name.includes('대회') ||
    name.includes('수련') ||
    name.includes('입학식') ||
    name.includes('졸업식')
  ) {
    return {
      category: 'festival',
      desc:
        rawContent && rawContent.trim()
          ? rawContent
          : '학생과 교직원이 함께하는 교내 행사입니다.',
      tip: '학급 및 동아리와 함께 즐거운 추억을 만드세요.',
    };
  }
  if (
    deductType === '공휴일' ||
    name.includes('절') ||
    name.includes('날') ||
    name.includes('공휴일')
  ) {
    return {
      category: 'holiday',
      desc:
        rawContent && rawContent.trim()
          ? rawContent
          : '법정 공휴일 또는 국가 지정 휴일입니다.',
      tip: '가족과 함께 의미 있는 시간을 보내세요.',
    };
  }
  return {
    category: 'regular',
    desc:
      rawContent && rawContent.trim()
        ? rawContent
        : '대진전자통신고등학교 정규 학사일정입니다.',
    tip: '학사일정에 맞춰 수업 준비를 진행하세요.',
  };
}

export function parseYmd(ymdStr: string): string {
  if (!ymdStr || ymdStr.length !== 8) return ymdStr;
  return `${ymdStr.substring(0, 4)}-${ymdStr.substring(4, 6)}-${ymdStr.substring(6, 8)}`;
}

export function calculateDDay(
  targetDateStr: string,
  baseDateStr = '2026-10-06'
): { text: string; value: number; class: 'today' | 'urgent' | 'upcoming' | 'past' } {
  const [bY, bM, bD] = baseDateStr.split('-').map(Number);
  const base = new Date(bY, bM - 1, bD);

  const [tY, tM, tD] = targetDateStr.split('-').map(Number);
  const target = new Date(tY, tM - 1, tD);

  const diffTime = target.getTime() - base.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { text: 'D-Day', value: 0, class: 'today' };
  if (diffDays > 0)
    return {
      text: `D-${diffDays}`,
      value: diffDays,
      class: diffDays <= 7 ? 'urgent' : 'upcoming',
    };
  return { text: `D+${Math.abs(diffDays)}`, value: diffDays, class: 'past' };
}

export function getGradeLabel(ev: Partial<ScheduleEvent>): string {
  const g1 = ev.ONE_GRADE_EVENT_YN === 'Y';
  const g2 = ev.TW_GRADE_EVENT_YN === 'Y';
  const g3 = ev.THREE_GRADE_EVENT_YN === 'Y';
  if (g1 && g2 && g3) return '전체 학년';
  const grades: string[] = [];
  if (g1) grades.push('1학년');
  if (g2) grades.push('2학년');
  if (g3) grades.push('3학년');
  return grades.length > 0 ? grades.join(', ') : '해당없음';
}
