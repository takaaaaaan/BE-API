import mongoose from 'mongoose'

const RequestHistorySchema = new mongoose.Schema(
  {
    tableNum: { type: Number, required: true }, // 요청이 온 테이블 번호
    requests: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, required: true }, // 요청 항목의 ID
        name: { type: String, required: true }, // 요청 항목의 이름
      },
    ],
    isCompleted: { type: Boolean, required: true, default: false }, // 요청 완료 여부
    requestedAt: { type: Date, required: true, default: Date.now }, // 요청 시간
    completedAt: { type: Date }, // 완료 시간 (옵션)
  },
  {
    timestamps: true, // 생성 및 업데이트 시간 자동 기록
    collection: 'requestHistories', // 컬렉션 이름
    versionKey: false, // 버전 키 비활성화
  }
)

const RequestHistory = mongoose.models.RequestHistory || mongoose.model('RequestHistory', RequestHistorySchema)

export default RequestHistory
