// ====== Order.ts ======

export type Order = {
  _id: string // MongoDB ObjectId
  orderItems: {
    menuId: string // MenuItemのMongoDB ObjectId
    name: string // メニュー名
    quantity: number // 注文数
    price: number // 単価
  }[] // 注文アイテムリスト
  totalPrice: number // 合計金額
  createdAt?: Date // 作成日時 (timestampsオプションに基づく)
  updatedAt?: Date // 更新日時 (timestampsオプションに基づく)
}
