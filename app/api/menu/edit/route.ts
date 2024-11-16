import { NextRequest, NextResponse } from 'next/server'

import dbConnect from '@/db/dbConnect'
import { MenuItem } from '@/db/models'

/**
 * 메뉴 아이템 업데이트
 * @param {NextRequest} req - 요청 객체
 * @returns {Promise<NextResponse>} 응답 객체
 */
export async function POST(req: NextRequest) {
  try {
    // MongoDB 연결
    await dbConnect()

    // 쿼리 파라미터에서 _id 가져오기
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    // 요청 본문 파싱
    const body = await req.json()
    const { name, price, available } = body

    // 필수 데이터 유효성 검사
    if (!id || (!name && price === undefined && available === undefined)) {
      return NextResponse.json(
        { message: '유효하지 않은 요청입니다. id 및 업데이트할 데이터를 포함해야 합니다.', flg: false },
        { status: 400 }
      )
    }

    // 메뉴 아이템 업데이트
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(price !== undefined && { price }), // price가 0일 수 있으므로 undefined만 검사
        ...(available !== undefined && { available }),
      },
      { new: true } // 업데이트된 데이터를 반환
    )

    if (!updatedMenuItem) {
      return NextResponse.json({ message: '메뉴 아이템을 찾을 수 없습니다.', flg: false }, { status: 404 })
    }

    return NextResponse.json({
      message: '메뉴 아이템이 성공적으로 업데이트되었습니다.',
      flg: true,
      updatedMenuItem,
    })
  } catch (error: unknown) {
    // 예외 처리
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: '메뉴 업데이트 실패', flg: false, error: errorMessage }, { status: 500 })
  }
}
