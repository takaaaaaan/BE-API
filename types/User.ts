export type User = {
  _id: string // MongoDB ObjectId 職員ID
  name: string // 職員名
  time_records_id: string[] | null // タイムカード記録IDの配列
}
