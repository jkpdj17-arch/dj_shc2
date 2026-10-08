import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword');

  if (!keyword || keyword.trim().length < 2) {
    return NextResponse.json({
      success: false,
      message: '학교명을 2자 이상 입력해주세요.',
      schools: [],
    });
  }

  const encoded = encodeURIComponent(keyword.trim());
  const url = `https://open.neis.go.kr/hub/schoolInfo?Type=json&SCHUL_NM=${encoded}&pSize=20`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error('NEIS 학교 정보 응답 오류');
    const data = await res.json();

    if (
      data.schoolInfo &&
      data.schoolInfo[1] &&
      Array.isArray(data.schoolInfo[1].row)
    ) {
      const schools = data.schoolInfo[1].row.map((s: {
        ATPT_OFCDC_SC_CODE: string;
        ATPT_OFCDC_SC_NM: string;
        SD_SCHUL_CODE: string;
        SCHUL_NM: string;
        ORG_RDNMA?: string;
      }) => ({
        officeCode: s.ATPT_OFCDC_SC_CODE,
        officeName: s.ATPT_OFCDC_SC_NM,
        schoolCode: s.SD_SCHUL_CODE,
        schoolName: s.SCHUL_NM,
        address: s.ORG_RDNMA || '',
      }));
      return NextResponse.json({ success: true, schools });
    }
  } catch (err) {
    console.warn('School search error:', err);
  }

  return NextResponse.json({ success: true, schools: [] });
}
