import { NextRequest, NextResponse } from 'next/server'

import { dbConnect, User } from '@/db/models'

/**
 * @url /api/timerecord/user
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    // MongoDBに接続
    await dbConnect()

    // クエリパラメータからデータを取得
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name')

    // 入力値のチェック
    if (!name) {
      return NextResponse.json({ message: '이름을 지정해주세요', success: false }, { status: 400 })
    }

    // 既存のユーザーに同じ名前が存在するかを確認
    const existingUser = await User.findOne({ name })
    if (existingUser) {
      return NextResponse.json({ message: '같은 이름의 사용자가 이미 존재합니다', success: false }, { status: 409 })
    }

    // 新しいユーザーを登録 (MongoDBが自動的にObjectIdを生成)
    const newUser = await User.create({ name, time_records_id: [], clockingin: false })

    // レスポンスを返す
    return NextResponse.json({ message: '사용자 등록에 성공했습니다', success: true, user: newUser }, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating user:', error)
    return NextResponse.json({ message: '사용자 등록에 실패했습니다', success: false, error }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    // MongoDBに接続
    await dbConnect()

    // クエリパラメータからデータを取得
    const { searchParams } = new URL(req.url)
    const _id = searchParams.get('_id') // 更新対象のユーザーID
    const name = searchParams.get('name') // 新しい名前

    // 入力値のチェック
    if (!_id || !name) {
      return NextResponse.json({ message: '_id와 이름을 지정해주세요', success: false }, { status: 400 })
    }

    // ユーザーが存在するか確認
    const user = await User.findById(_id)
    if (!user) {
      return NextResponse.json({ message: '지정된 _id의 사용자를 찾을 수 없습니다', success: false }, { status: 404 })
    }

    // 名前を更新
    user.name = name
    await user.save()

    // 更新後のデータをレスポンスとして返す
    return NextResponse.json({ message: '사용자 이름이 업데이트되었습니다', success: true, user }, { status: 200 })
  } catch (error: unknown) {
    console.error('Error updating user:', error)
    return NextResponse.json({ message: '사용자 업데이트에 실패했습니다', success: false, error }, { status: 500 })
  }
}

export async function GET() {
  try {
    // MongoDBに接続
    await dbConnect()

    // コレクション内のすべてのドキュメントを取得
    const users = await User.find()

    // ドキュメントが存在しない場合の処理
    if (users.length === 0) {
      return NextResponse.json({ message: '사용자가 존재하지 않습니다', success: false, users: [] }, { status: 404 })
    }

    // ドキュメントをレスポンスとして返す
    return NextResponse.json({ message: '모든 사용자를 가져왔습니다', success: true, users }, { status: 200 })
  } catch (error: unknown) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ message: '사용자 가져오기에 실패했습니다', success: false, error }, { status: 500 })
  }
}

//delete user는 충돌이 발생할 수 있으므로 만들지 않음
