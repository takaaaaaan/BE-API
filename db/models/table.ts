import mongoose from 'mongoose'

import { OrderItemSchema } from './order'

const TableSchema = new mongoose.Schema(
  {
    tableName: { type: String, required: true, default: '' },
    tableNum: { type: Number, required: true },
    orderid: [{ type: mongoose.Schema.Types.ObjectId }],
    lastOrder: [OrderItemSchema], // サブドキュメントスキーマを適用
    totalPrice: { type: Number, required: true, default: 0 },
    status: { type: String, required: true, default: 'pending' },
  },
  {
    timestamps: true,
    collection: 'table',
    versionKey: false,
  }
)

// 既存のモデルが存在する場合、それを使用。ない場合は新規作成
const Table = mongoose.models.Table || mongoose.model('Table', TableSchema)

export default Table
