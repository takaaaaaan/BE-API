import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: { type: String },
  },
  {
    timestamps: false,
    collection: 'categories',
    versionKey: false,
  }
)

const Category = mongoose.models.Order || mongoose.model('Category', categorySchema)

export default Category
