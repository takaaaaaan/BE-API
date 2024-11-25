import { NextRequest, NextResponse } from 'next/server'

import { dbConnect, User } from '@/db/models'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')
    const startDate = searchParams.get('start_date') // 시작 날짜
    const endDate = searchParams.get('end_date') // 종료 날짜

    if (!userId) {
      return NextResponse.json({ message: 'user_id를 지정해주세요.', success: false }, { status: 400 })
    }

    // 사용자 정보 가져오기
    const userWithRecords = await User.findById(userId).populate({
      path: 'time_records_id',
      match:
        startDate && endDate
          ? {
              updatedAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
              },
            }
          : {},
    })

    if (!userWithRecords) {
      return NextResponse.json({ message: '지정된 사용자를 찾을 수 없습니다.', success: false }, { status: 404 })
    }

    // 총 근무 시간 계산
    const totalWorkingHours = (userWithRecords.time_records_id as { total_working_hours: number }[]).reduce(
      (sum, record) => sum + (record.total_working_hours || 0),
      0
    )

    return NextResponse.json(
      {
        message: '근무 기록을 가져왔습니다.',
        success: true,
        user: userWithRecords,
        total_working_hours: totalWorkingHours, // 총 근무 시간을 추가
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Error fetching working hours:', error)
    return NextResponse.json(
      { message: '근무 기록을 가져오는 데 실패했습니다.', success: false, error },
      { status: 500 }
    )
  }
}
