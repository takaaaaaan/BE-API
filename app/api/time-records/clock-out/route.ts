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

    // User를 검색하고 출근 상태를 확인
    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json(
        { message: '지정된 user_id를 가진 사용자를 찾을 수 없습니다', success: false },
        { status: 404 }
      )
    }

    if (!user.clockingin) {
      return NextResponse.json({ message: '이 직원은 아직 출근하지 않았습니다', success: true }, { status: 200 })
    }

    // clock_out 시간을 설정하고 total_working_hours 계산
    const clockOutTime = new Date()
    const timeRecord = await TimeRecord.findById(user.time_record_id)

    if (!timeRecord) {
      return NextResponse.json(
        { message: '해당 user_id와 연관된 기록을 찾을 수 없습니다', success: false },
        { status: 404 }
      )
    }

    const clockInTime = timeRecord.clock_in
    const sessionWorkingHours = (clockOutTime.getTime() - new Date(clockInTime).getTime()) / (1000 * 60 * 60) // 時間単位で計算

    // 새로운 기록을 생성
    const newTimeRecord = await TimeRecord.findByIdAndUpdate(user.time_record_id, {
      clock_out: clockOutTime,
      total_working_hours: sessionWorkingHours,
    })

    if (!newTimeRecord) {
      return NextResponse.json({ message: 'TimeRecord를 업데이트 할 수 없었습니다.', success: false }, { status: 404 })
    }

    // Userの勤務時間フィールドに加算
    const updatedTotalHours = (user.total_working_hours || 0) + sessionWorkingHours

    await User.findByIdAndUpdate(
      userId,
      {
        clockingin: false,
        total_working_hours: updatedTotalHours, // 合計勤務時間をセット
        time_record_id: null, // 退勤時に関連付けをリセット
      },
      { new: true }
    )

    return NextResponse.json(
      {
        message: '퇴근 기록이 성공적으로 생성되었습니다',
        success: true,
        근무시간: sessionWorkingHours,
        'User 총근무 시간': updatedTotalHours,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Error during clock-out:', error)
    return NextResponse.json({ message: '퇴근 기록 생성에 실패했습니다', success: false, error }, { status: 500 })
  }
}
