import { NextRequest, NextResponse } from 'next/server'

import { dbConnect, Order, Table } from '@/db/models'

export async function GET(req: NextRequest) {
  try {
    // MongoDBに接続
    await dbConnect()

    // クエリパラメータからtableNumを取得
    const { searchParams } = new URL(req.url)
    const tableNum = searchParams.get('tableNum')

    if (!tableNum) {
      return NextResponse.json({ message: 'テーブル番号が指定されていません', success: false }, { status: 400 })
    }

    // 指定されたtableNumに該当するテーブルを取得
    const table = await Table.findOne({ tableNum: Number(tableNum) })

    if (!table) {
      return NextResponse.json({ message: '指定されたテーブルが存在しません', success: false }, { status: 404 })
    }

    // table.orderid[]内のIDを用いてorderコレクションから該当する注文を取得
    const orders = await Order.find({ _id: { $in: table.orderid } })

    return NextResponse.json(
      {
        message: '注文履歴を取得しました',
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
    return NextResponse.json({ message: '注文履歴の取得に失敗しました', success: false, error }, { status: 500 })
  }
}
