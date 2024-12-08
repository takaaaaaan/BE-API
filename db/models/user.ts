import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // 職員名
    time_record_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TimeRecord', default: null }, // 現在のタイムカード記録のID
    clockingin: { type: Boolean, default: false }, // 出勤状態
    total_working_hours: { type: Number, default: 0 }, // 合計勤務時間（単位：時間）
  },
  {
    timestamps: true,
    collection: 'users', // コレクション名
    versionKey: false,
  }
)

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export default User
