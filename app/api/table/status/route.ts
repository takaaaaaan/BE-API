import { NextRequest, NextResponse } from 'next/server'

import { dbConnect, Table } from '@/db/models'

export async function PUT(req: NextRequest) {
  try {
    // MongoDB에 연결
    await dbConnect()

    // 요청 본문에서 데이터 가져오기
    const body = await req.json()

    // 본문이 배열인지 확인
    if (!Array.isArray(body)) {
      return NextResponse.json({ message: '요청 본문은 배열이어야 합니다.', success: false }, { status: 400 })
    }

    // 업데이트 처리
    const updateResults = await Promise.all(
      body.map(async (item) => {
        const { tableNum, status } = item

        if (!tableNum || !status) {
          throw new Error('tableNum 또는 status가 부족합니다.')
        }

        // 테이블 업데이트
        const updatedTable = await Table.findOneAndUpdate(
          { tableNum: Number(tableNum) }, // 검색 조건
          { status }, // 업데이트 내용
          { new: true } // 업데이트 후 데이터 반환
        )

        // 테이블을 찾을 수 없는 경우
        if (!updatedTable) {
          return { tableNum, success: false, message: '지정된 테이블을 찾을 수 없습니다.' }
        }

        return { tableNum, success: true, updatedTable }
      })
    )

    // 결과를 응답으로 반환
    return NextResponse.json(
      { message: '테이블 상태가 업데이트되었습니다.', success: true, results: updateResults },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Error updating table status:', error)
    return NextResponse.json(
      { message: '테이블 상태를 업데이트할 수 없습니다.', success: false, error: String(error) },
      { status: 500 }
    )
  }
}
