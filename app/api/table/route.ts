import { NextRequest, NextResponse } from 'next/server'

import { dbConnect, Table } from '@/db/models'

export async function GET(req: NextRequest) {
  try {
    // MongoDB에 연결
    await dbConnect()

    // 쿼리 파라미터에서 tableNum 가져오기
    const { searchParams } = new URL(req.url)
    const tableNums = searchParams.getAll('tableNum') // 여러 `tableNum` 가져오기 가능

    let tables

    if (tableNums.length > 0) {
      // 지정된 `tableNum`의 테이블 데이터 가져오기
      tables = await Table.find({ tableNum: { $in: tableNums.map(Number) } })
    } else {
      // 쿼리가 없는 경우 모든 테이블 데이터 가져오기
      tables = await Table.find()
    }

    // 데이터가 존재하지 않는 경우 응답
    if (tables.length === 0) {
      return NextResponse.json(
        { message: '지정된 테이블 데이터가 존재하지 않습니다.', success: false },
        { status: 404 }
      )
    }

    // 데이터를 응답으로 반환
    return NextResponse.json(
      { message: '테이블 데이터를 성공적으로 가져왔습니다.', success: true, tables },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Error fetching table data:', error)
    return NextResponse.json(
      { message: '테이블 데이터를 가져오는 데 실패했습니다.', success: false, error },
      { status: 500 }
    )
  }
}
