import { NextRequest, NextResponse } from 'next/server'

import dbConnect from '@/db/dbConnect'
import Table from '@/db/models/table'

export async function GET(req: NextRequest) {
  try {
    // MongoDBに接続
    await dbConnect()

    // クエリパラメータからtableNumを取得
    const { searchParams } = new URL(req.url)
    const tableNums = searchParams.getAll('tableNum') // 複数の`tableNum`を取得可能

    let tables

    if (tableNums.length > 0) {
      // 指定された`tableNum`のテーブルデータを取得
      tables = await Table.find({ tableNum: { $in: tableNums.map(Number) } })
    } else {
      // クエリがない場合はすべてのテーブルデータを取得
      tables = await Table.find()
    }

    // データが存在しない場合のレスポンス
    if (tables.length === 0) {
      return NextResponse.json({ message: '指定されたテーブルデータが存在しません', success: false }, { status: 404 })
    }

    // データをレスポンスとして返す
    return NextResponse.json({ message: 'テーブルデータの取得に成功しました', success: true, tables }, { status: 200 })
  } catch (error: unknown) {
    console.error('Error fetching table data:', error)
    return NextResponse.json({ message: 'テーブルデータの取得に失敗しました', success: false, error }, { status: 500 })
  }
}
