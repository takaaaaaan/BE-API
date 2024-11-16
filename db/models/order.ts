import mongoose from 'mongoose'

// 注文アイテムのスキーマ定義
export const OrderItemSchema = new mongoose.Schema(
  {
    menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true }, // MenuItemと関連付け
    name: { type: String, required: true, default: '' }, // メニュー名
    quantity: { type: Number, required: true, default: 0 }, // 注文数
    price: { type: Number, required: true, default: 0 }, // 単価
  },
  { _id: false } // サブドキュメントの`_id`を無効化
)

const OrderSchema = new mongoose.Schema(
  {
    orderItems: [OrderItemSchema], // サブドキュメントスキーマを使用
    totalPrice: { type: Number, required: true, default: 0 }, // 合計金額
  },
  {
    timestamps: true, // 作成日時・更新日時を自動生成
    collection: 'order', // コレクション名
    versionKey: false, // __vフィールドを無効化
  }
)

// モデル作成または既存モデルの再利用
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema)

export default Order
