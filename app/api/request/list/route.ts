import { NextResponse } from 'next/server'

import { dbConnect, RequestItem } from '@/db/models'

export async function GET() {
  try {
    // MongoDB에 연결
    await dbConnect()

    // 요청 목록을 가져옴 (isActive가 true인 것만)
    const requestItems = await RequestItem.find({ isActive: true })

    // 요청 목록이 없는 경우
    if (!requestItems || requestItems.length === 0) {
      return NextResponse.json({ message: '활성화된 요청 목록이 없습니다.', success: false, data: [] }, { status: 404 })
    }

    // 데이터를 응답으로 반환
    return NextResponse.json(
      { message: '요청 목록을 성공적으로 가져왔습니다.', success: true, data: requestItems },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching request items:', error)
    return NextResponse.json(
      { message: '요청 목록을 가져오는 데 실패했습니다.', success: false, error: String(error) },
      { status: 500 }
    )
  }
}
