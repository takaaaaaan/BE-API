import mongoose from 'mongoose'

const TimeRecordSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 職員IDへの参照
    clock_in: { type: Date, required: true }, // 出勤時刻
    clock_out: { type: Date }, // 退勤時刻
    total_working_hours: { type: Number, default: 0 }, // 合計勤務時間（単位：時間）
  },
  {
    timestamps: true, // createdAt, updatedAt を有効
    collection: 'time_records', // コレクション名
    versionKey: false, // __v を無効
  }
)

const TimeRecord = mongoose.models.TimeRecord || mongoose.model('TimeRecord', TimeRecordSchema)

export default TimeRecord
