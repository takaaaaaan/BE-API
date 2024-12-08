import { FilterQuery } from 'mongoose' // Mongoose の FilterQuery 型を使用
import { NextRequest, NextResponse } from 'next/server'

import { dbConnect, TimeRecord } from '@/db/models'

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
    const query: FilterQuery<typeof TimeRecord> = { user_id: userId } // 型安全なクエリ定義

    if (startDate && endDate) {
      query.updatedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    // TimeRecord에서 user_id와 조건에 맞는 데이터 검색
    const timeRecords = await TimeRecord.find(query, 'clock_in clock_out total_working_hours createdAt updatedAt')

    if (!timeRecords || timeRecords.length === 0) {
      return NextResponse.json({ message: '근무 기록을 찾을 수 없습니다.', success: false }, { status: 404 })
    }

    // 총 근무 시간 계산
    const totalWorkingHours = timeRecords.reduce((sum, record) => sum + (record.total_working_hours || 0), 0)

    return NextResponse.json(
      {
        message: '근무 기록을 가져왔습니다.',
        success: true,
        records: timeRecords,
        total_working_hours: totalWorkingHours, // 총 근무 시간
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
