// ====== Table.ts ======

export type Table = {
  _id: string // MongoDB ObjectId
  tableName: string // テーブル名
  tableNum: number // テーブル番号
  orderid: string[] // OrderのMongoDB ObjectIdの配列
  lastOrder: {
    menuId: string // MenuItemのMongoDB ObjectId
    name: string // メニュー名
    quantity: number // 数量
    price: number // 価格
  }[] // 最後の注文リスト
  totalPrice: number // 合計金額
  status: string // テーブルのステータス ('pending', 'completed'など)
  createdAt?: Date // 作成日時 (timestampsオプションに基づく)
  updatedAt?: Date // 更新日時 (timestampsオプションに基づく)
}
