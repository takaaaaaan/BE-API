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

export async function DELETE(req: NextRequest) {
  try {
    // MongoDB에 연결
    await dbConnect()

    // 쿼리 파라미터에서 tableNum 가져오기
    const { searchParams } = new URL(req.url)
    const tableNum = searchParams.get('tableNum')

    // tableNum이 지정되지 않은 경우
    if (!tableNum) {
      return NextResponse.json({ message: 'tableNum 파라미터가 필요합니다.', success: false }, { status: 400 })
    }

    // 지정된 tableNum의 테이블을 업데이트
    const updatedTable = await Table.findOneAndUpdate(
      { tableNum: Number(tableNum) },
      { $set: { lastOrder: [], totalPrice: 0 } },
      { new: true } // 업데이트된 문서를 반환
    )

    // 업데이트 대상이 존재하지 않는 경우
    if (!updatedTable) {
      return NextResponse.json({ message: '지정된 테이블을 찾을 수 없습니다.', success: false }, { status: 404 })
    }

    // 업데이트 성공 응답
    return NextResponse.json(
      { message: '테이블 데이터를 성공적으로 리셋했습니다.', success: true, table: updatedTable },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Error resetting table data:', error)
    return NextResponse.json(
      { message: '테이블 데이터를 리셋하는 데 실패했습니다.', success: false, error },
      { status: 500 }
    )
  }
}
