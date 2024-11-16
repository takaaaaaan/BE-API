import { NextRequest, NextResponse } from 'next/server'

import dbConnect from '@/db/dbConnect'
import { Category } from '@/db/models'

export async function GET(req: NextRequest) {
  try {
    // MongoDBに接続
    await dbConnect()

    // Categoryコレクションの全データを取得
    const categories = await Category.find()

    if (!categories || categories.length === 0) {
      return NextResponse.json({ message: 'カテゴリーデータが存在しません', success: false }, { status: 404 })
    }
    console.log('categories:', categories)
    // データをレスポンスとして返す
    return NextResponse.json(
      {
        message: 'カテゴリーデータを取得しました',
        success: true,
        data: categories,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { message: 'カテゴリーデータの取得に失敗しました', success: false, error },
      { status: 500 }
    )
  }
}
export async function PUT(req: NextRequest) {
  try {
    // MongoDBに接続
    await dbConnect()

    // リクエストボディからデータを取得
    const { _id, name } = await req.json()

    if (!_id || !name) {
      return NextResponse.json({ message: '必要なデータが不足しています', success: false }, { status: 400 })
    }

    // カテゴリーを検索して更新
    const updatedCategory = await Category.findByIdAndUpdate(_id, { name }, { new: true, runValidators: true })

    if (!updatedCategory) {
      return NextResponse.json({ message: '指定されたカテゴリーが存在しません', success: false }, { status: 404 })
    }

    // 更新されたデータを返す
    return NextResponse.json(
      {
        message: 'カテゴリーを更新しました',
        success: true,
        data: updatedCategory,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Error updating category:', error)
    return NextResponse.json({ message: 'カテゴリーの更新に失敗しました', success: false, error }, { status: 500 })
  }
}
