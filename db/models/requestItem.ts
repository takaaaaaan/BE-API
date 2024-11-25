import mongoose from 'mongoose'

const RequestItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // 요청 사항 이름
    isActive: { type: Boolean, required: true, default: true }, // 요청 활성 여부
  },
  {
    timestamps: false,
    collection: 'requestItems',
    versionKey: false,
  }
)

const RequestItem = mongoose.models.RequestItem || mongoose.model('RequestItem', RequestItemSchema)

export default RequestItem
