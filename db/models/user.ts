import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // 職員名
    time_records_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TimeRecord' }], // タイムカード記録のID配列
    clockingin: { type: Boolean, default: false }, // 출근 상태
  },
  {
    timestamps: true,
    collection: 'users', // コレクション名
    versionKey: false,
  }
)

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export default User
