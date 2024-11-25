import { NextRequest, NextResponse } from 'next/server'

import { Category, dbConnect } from '@/db/models'

export async function GET() {
  try {
    // MongoDB에 연결
    await dbConnect()

    // Category 컬렉션의 모든 데이터 가져오기
    const categories = await Category.find()

    if (!categories || categories.length === 0) {
      return NextResponse.json({ message: '카테고리 데이터가 존재하지 않습니다.', success: false }, { status: 404 })
    }
    console.log('categories:', categories)
    // 데이터를 응답으로 반환
    return NextResponse.json(
      {
        message: '카테고리 데이터를 가져왔습니다.',
        success: true,
        data: categories,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { message: '카테고리 데이터를 가져오는 데 실패했습니다.', success: false, error },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    // MongoDB에 연결
    await dbConnect()

    // 요청 본문에서 데이터 가져오기
    const { _id, name } = await req.json()

    if (!_id || !name) {
      return NextResponse.json({ message: '필요한 데이터가 부족합니다.', success: false }, { status: 400 })
    }

    // 카테고리를 검색하여 업데이트
    const updatedCategory = await Category.findByIdAndUpdate(_id, { name }, { new: true, runValidators: true })

    if (!updatedCategory) {
      return NextResponse.json({ message: '지정된 카테고리가 존재하지 않습니다.', success: false }, { status: 404 })
    }

    // 업데이트된 데이터를 반환
    return NextResponse.json(
      {
        message: '카테고리를 업데이트했습니다.',
        success: true,
        data: updatedCategory,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { message: '카테고리를 업데이트하는 데 실패했습니다.', success: false, error },
      { status: 500 }
    )
  }
}
