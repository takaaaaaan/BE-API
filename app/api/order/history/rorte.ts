import { NextRequest, NextResponse } from 'next/server'

import { dbConnect, Order, Table } from '@/db/models'

export async function GET(req: NextRequest) {
  try {
    // MongoDB에 연결
    await dbConnect()

    // 쿼리 파라미터에서 tableNum 가져오기
    const { searchParams } = new URL(req.url)
    const tableNum = searchParams.get('tableNum')

    if (!tableNum) {
      return NextResponse.json({ message: '테이블 번호가 지정되지 않았습니다.', success: false }, { status: 400 })
    }

    // 지정된 tableNum에 해당하는 테이블 가져오기
    const table = await Table.findOne({ tableNum: Number(tableNum) })

    if (!table) {
      return NextResponse.json({ message: '지정된 테이블이 존재하지 않습니다.', success: false }, { status: 404 })
    }

    // table.orderid[] 내의 ID를 사용하여 order 컬렉션에서 해당 주문 가져오기
    const orders = await Order.find({ _id: { $in: table.orderid } })

    return NextResponse.json(
      {
        message: '주문 내역을 가져왔습니다.',
        success: true,
        data: {
          table: {
            tableNum: table.tableNum,
            tableName: table.tableName,
          },
          orders,
        },
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Error fetching order history:', error)
    return NextResponse.json(
      { message: '주문 내역을 가져오는 데 실패했습니다.', success: false, error },
      { status: 500 }
    )
  }
}
