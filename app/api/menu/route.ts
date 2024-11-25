import { NextRequest, NextResponse } from 'next/server'

import { dbConnect, MenuItem } from '@/db/models'
import { Menu } from '@/types'

/**
 * 사용자 토큰을 검증하고 사용자 정보를 반환
 * @param {NextRequest} req - 요청 객체
 * @returns {Promise<NextResponse>} 응답 객체
 */
export async function GET(req: NextRequest) {
  try {
    // MongoDB 연결
    await dbConnect()

    // 쿼리 파라미터 가져오기
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const available = searchParams.get('available')

    // 필터 조건 생성
    type MatchConditions = {
      available?: boolean
    }
    const matchConditions: MatchConditions = {}
    if (available !== null) {
      matchConditions.available = available === 'true' // true로 변환
    }

    // Aggregate 쿼리 생성
    const aggregateQuery = [
      {
        $match: matchConditions, // 조건에 따른 필터링
      },
      {
        $lookup: {
          from: 'categories', // categories 컬렉션을 참조
          localField: 'category', // MenuItem의 category
          foreignField: '_id', // categories 컬렉션의 _id
          as: 'category_info', // 결과를 category_info에 저장
        },
      },
      {
        $unwind: '$category_info', // category_info 배열을 단일 객체로 변환
      },
      {
        $project: {
          name: 1,
          price: 1,
          imageUrl: 1,
          available: 1,
          category: '$category_info.name', // category_info의 name을 category로 매핑
        },
      },
    ]

    // 조건에 따른 데이터 필터링 및 조회
    const menuItems = await MenuItem.aggregate(aggregateQuery).exec()
    console.log('menuItems', menuItems)
    const filteredItems = category ? menuItems.filter((item: Menu) => item.category === category) : menuItems

    return NextResponse.json({
      menuItems: filteredItems,
    })
  } catch (error: unknown) {
    // 예외 처리
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: '사용자 확인 실패', flg: false, error: errorMessage }, { status: 500 })
  }
}
