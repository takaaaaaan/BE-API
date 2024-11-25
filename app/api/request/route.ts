import { NextRequest, NextResponse } from 'next/server'

import { dbConnect, RequestHistory } from '@/db/models'

export async function GET(req: NextRequest) {
  try {
    // MongoDB 연결
    await dbConnect()

    // URL 쿼리에서 tableNum 가져오기
    const { searchParams } = new URL(req.url)
    const tableNum = searchParams.get('tableNum') // tableNum 쿼리 파라미터

    let histories

    if (tableNum) {
      // 특정 테이블의 기록만 가져오기
      histories = await RequestHistory.find({ tableNum: Number(tableNum) })
    } else {
      // 모든 기록 가져오기
      histories = await RequestHistory.find()
    }

    // 데이터가 없는 경우
    if (!histories || histories.length === 0) {
      return NextResponse.json({ message: '요청 기록이 없습니다.', success: false, data: [] }, { status: 404 })
    }

    // 성공적으로 데이터를 반환
    return NextResponse.json(
      { message: '요청 기록을 성공적으로 가져왔습니다.', success: true, data: histories },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching request histories:', error)
    return NextResponse.json(
      { message: '요청 기록을 가져오는 데 실패했습니다.', success: false, error: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // MongoDB 연결
    await dbConnect()

    // 요청 본문에서 데이터 가져오기
    const body = await req.json()

    // 본문 데이터 검증
    const { tableNum, requests } = body

    if (!tableNum || !Array.isArray(requests) || requests.length === 0) {
      return NextResponse.json({ message: '테이블 번호와 요청 항목이 필요합니다.', success: false }, { status: 400 })
    }

    // 새로운 요청 기록 생성
    const newRequestHistory = {
      tableNum,
      requests,
      isCompleted: false, // 기본값으로 완료되지 않은 상태
    }

    // 데이터베이스에 삽입
    const savedHistory = await RequestHistory.create(newRequestHistory)

    // 성공 응답
    return NextResponse.json(
      { message: '요청 기록이 성공적으로 저장되었습니다.', success: true, data: savedHistory },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('Error saving request history:', error)
    return NextResponse.json(
      { message: '요청 기록을 저장하는 데 실패했습니다.', success: false, error: String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    // MongoDB 연결
    await dbConnect()

    // URL에서 id 파라미터 가져오기
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id') // id 파라미터 추출

    // id 검증
    if (!id) {
      return NextResponse.json({ message: '요청 기록 ID가 필요합니다.', success: false }, { status: 400 })
    }

    // 요청 기록 업데이트
    const updatedHistory = await RequestHistory.findByIdAndUpdate(
      id,
      {
        isCompleted: true,
        completedAt: new Date(), // 완료 시간 기록
      },
      { new: true } // 업데이트 후의 데이터를 반환
    )

    // 기록이 없는 경우
    if (!updatedHistory) {
      return NextResponse.json({ message: '요청 기록을 찾을 수 없습니다.', success: false }, { status: 404 })
    }

    // 성공적으로 업데이트된 기록 반환
    return NextResponse.json(
      { message: '요청 기록이 완료 상태로 업데이트되었습니다.', success: true, data: updatedHistory },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating request history:', error)
    return NextResponse.json(
      { message: '요청 기록을 업데이트하는 데 실패했습니다.', success: false, error: String(error) },
      { status: 500 }
    )
  }
}
