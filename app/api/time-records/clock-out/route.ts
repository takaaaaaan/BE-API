import { NextRequest, NextResponse } from 'next/server'

import { dbConnect, TimeRecord, User } from '@/db/models'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const recordId = searchParams.get('record_id')

    if (!recordId) {
      return NextResponse.json({ message: 'record_id를 지정해주세요', success: false }, { status: 400 })
    }

    // 현재 시각을 가져옵니다
    const clockOutTime = new Date()

    // 기록을 업데이트하기 전, 해당 record_id를 가진 User를 확인
    const user = await User.findOne({ time_records_id: recordId })

    if (!user) {
      return NextResponse.json(
        { message: '해당 record_id를 가진 사용자를 찾을 수 없습니다', success: false },
        { status: 404 }
      )
    }
    console.log('user', user)
    console.log('clockingin', user.clockingin)
    // User의 출근 상태를 확인
    if (!user.clockingin) {
      return NextResponse.json({ message: '이 직원은 아직 출근하지 않았습니다', success: true }, { status: 200 })
    }

    // 기록을 업데이트합니다
    const timeRecord = await TimeRecord.findById(recordId)
    if (!timeRecord) {
      return NextResponse.json({ message: '지정된 기록을 찾을 수 없습니다', success: false }, { status: 404 })
    }

    const clockInTime = timeRecord.clock_in
    const totalWorkingHours = (clockOutTime.getTime() - new Date(clockInTime).getTime()) / (1000 * 60 * 60)

    timeRecord.clock_out = clockOutTime
    timeRecord.total_working_hours = totalWorkingHours
    await timeRecord.save()

    // 출근 상태를 false로 업데이트합니다
    await User.findByIdAndUpdate(user._id, { clockingin: false })

    return NextResponse.json({ message: '퇴근 기록이 업데이트되었습니다', success: true, timeRecord }, { status: 200 })
  } catch (error: unknown) {
    console.error('Error during clock-out:', error)
    return NextResponse.json({ message: '퇴근 기록 업데이트에 실패했습니다', success: false, error }, { status: 500 })
  }
}
