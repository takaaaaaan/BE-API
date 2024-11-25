export type TimeRecord = {
  _id: string // MongoDB ObjectId 記録ID
  user_id: string // 職員ID (User コレクションの関連ID)
  clock_in: string // 出勤時刻 (ISO 8601形式の文字列)
  clock_out: string | null // 退勤時刻 (ISO 8601形式の文字列または未記録の場合は null)
  total_working_hours: number // 合計勤務時間 (単位: 時間)
}
