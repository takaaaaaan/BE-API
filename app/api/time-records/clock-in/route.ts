import { NextRequest, NextResponse } from 'next/server'

import { dbConnect, TimeRecord, User } from '@/db/models'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ message: 'user_id를 지정해주세요', success: false }, { status: 400 })
    }

    // 출근 기록을 생성
    const timeRecord = await TimeRecord.create({
      user_id: userId,
      clock_in: new Date(),
      clock_out: null,
      total_working_hours: 0,
    })

    // User 컬렉션에 기록 ID를 설정
    const userdata = await User.findByIdAndUpdate(userId, {
      $set: {
        time_record_id: timeRecord._id, // 配列ではなく単一値として設定
        clockingin: true, // 출근 상태 설정
      },
    })

    return NextResponse.json({ message: '출근 기록이 생성되었습니다', success: true, userdata }, { status: 201 })
  } catch (error: unknown) {
    console.error('Error during clock-in:', error)
    return NextResponse.json({ message: '출근 기록 생성에 실패했습니다', success: false, error }, { status: 500 })
  }
}
