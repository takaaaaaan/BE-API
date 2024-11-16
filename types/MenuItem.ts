// ====== MenuItem.ts ======
export type Menu = {
  _id: string // MongoDB ObjectId
  name: string // 게시글 제목
  price: number // 게시글 내용
  imageUrl: string // 작성자 ID (User 컬렉션의 관련 ID)
  available: boolean // 게시글 생성 날짜
  category: string // 게시글 갱신 날짜
}
