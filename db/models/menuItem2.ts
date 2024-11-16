// db\models\menuItem.ts
import mongoose from 'mongoose'

const MenuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId },
    price: { type: Number, required: true, default: 0 },
    imageUrl: { type: String, default: '' },
    available: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: false,
    collection: 'menuItem',
    versionKey: false,
  }
)

const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema)

export default MenuItem
