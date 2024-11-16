import { NextRequest, NextResponse } from 'next/server'

import dbConnect from '@/db/dbConnect'
import { Order, Table } from '@/db/models'

export async function POST(req: NextRequest) {
  try {
    // MongoDBに接続
    await dbConnect()

    // クエリパラメータからtableNumを取得
    const { searchParams } = new URL(req.url)
    const tableNum = searchParams.get('tableNum')

    if (!tableNum) {
      return NextResponse.json({ message: '必要なテーブル番号が指定されていません', success: false }, { status: 400 })
    }

    // リクエストボディからデータを取得
    const { orderItems, totalPrice } = await req.json()

    if (!orderItems || totalPrice === undefined) {
      return NextResponse.json({ message: '必要なパラメーターが不足しています', success: false }, { status: 400 })
    }

    // テーブルデータを検索
    let table = await Table.findOne({ tableNum })

    if (!table) {
      // テーブルが存在しない場合、新規作成
      table = new Table({
        tableName: `Table ${tableNum}`,
        tableNum: Number(tableNum),
        orderid: [],
        lastOrder: [],
        totalPrice: 0,
        status: 'pending',
      })
    }

    // 新しい注文データを作成
    const newOrder = new Order({
      orderItems,
      totalPrice,
    })
    const OrderLog = await newOrder.save()
    console.log('OrderLog:', OrderLog)

    // テーブルデータを更新
    table.lastOrder = orderItems
    console.log('table.lastOrder:', table.lastOrder)
    table.totalPrice = totalPrice
    table.orderid = [...table.orderid, newOrder._id] // 新しい注文IDを追加
    table.status = 'pending'
    await table.save()

    return NextResponse.json({ message: 'テーブルデータが更新されました', success: true, table }, { status: 200 })
  } catch (error: unknown) {
    console.error('Error updating table:', error)
    return NextResponse.json({ message: 'テーブルデータの更新に失敗しました', success: false, error }, { status: 500 })
  }
}
