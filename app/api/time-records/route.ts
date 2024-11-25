import { NextRequest, NextResponse } from 'next/server'

import { dbConnect, User } from '@/db/models'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')
    const startDate = searchParams.get('start_date') // 開始日
    const endDate = searchParams.get('end_date') // 終了日

    if (!userId) {
      return NextResponse.json({ message: 'user_id を指定してください', success: false }, { status: 400 })
    }

    // ユーザー情報を取得
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
      return NextResponse.json({ message: '指定されたユーザーが見つかりません', success: false }, { status: 404 })
    }

    // 合計勤務時間を計算
    const totalWorkingHours = (userWithRecords.time_records_id as { total_working_hours: number }[]).reduce(
      (sum, record) => sum + (record.total_working_hours || 0),
      0
    )

    return NextResponse.json(
      {
        message: '勤務記録を取得しました',
        success: true,
        user: userWithRecords,
        total_working_hours: totalWorkingHours, // 合計勤務時間を追加
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Error fetching working hours:', error)
    return NextResponse.json({ message: '勤務記録の取得に失敗しました', success: false, error }, { status: 500 })
  }
}
