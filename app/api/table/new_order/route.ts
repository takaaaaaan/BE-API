import { NextRequest, NextResponse } from 'next/server'

import { dbConnect, Order, Table } from '@/db/models'

export async function POST(req: NextRequest) {
  try {
    // MongoDB에 연결
    await dbConnect()

    // 쿼리 파라미터에서 tableNum 가져오기
    const { searchParams } = new URL(req.url)
    const tableNum = searchParams.get('tableNum')

    if (!tableNum) {
      return NextResponse.json(
        { message: '필요한 테이블 번호가 지정되지 않았습니다.', success: false },
        { status: 400 }
      )
    }

    // 요청 본문에서 데이터 가져오기
    const { orderItems, totalPrice } = await req.json()

    if (!orderItems || totalPrice === undefined) {
      return NextResponse.json({ message: '필요한 매개변수가 부족합니다.', success: false }, { status: 400 })
    }

    // 테이블 데이터 검색
    let table = await Table.findOne({ tableNum })

    if (!table) {
      // 테이블이 존재하지 않을 경우 새로 생성
      table = new Table({
        tableName: `Table ${tableNum}`,
        tableNum: Number(tableNum),
        orderid: [],
        lastOrder: [],
        totalPrice: 0,
        status: 'pending',
      })
    }

    // 새 주문 데이터 생성
    const newOrder = new Order({
      orderItems,
      totalPrice,
    })
    const OrderLog = await newOrder.save()
    console.log('OrderLog:', OrderLog)

    // 테이블 데이터 업데이트
    table.lastOrder = orderItems
    console.log('table.lastOrder:', table.lastOrder)
    table.totalPrice = totalPrice
    table.orderid = [...table.orderid, newOrder._id] // 새 주문 ID 추가
    table.status = 'pending'
    await table.save()

    return NextResponse.json({ message: '테이블 데이터가 업데이트되었습니다.', success: true, table }, { status: 200 })
  } catch (error: unknown) {
    console.error('Error updating table:', error)
    return NextResponse.json(
      { message: '테이블 데이터를 업데이트하는 데 실패했습니다.', success: false, error },
      { status: 500 }
    )
  }
}
