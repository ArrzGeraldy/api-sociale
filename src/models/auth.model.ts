import mongoose from 'mongoose'

const authSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      unique: true
    },
    username: {
      type: String
    },
    email: {
      type: String,
      unique: true
    },
    role: {
      type: String,
      default: 'Regular'
    },
    password: {
      type: String
    }
  },
  { timestamps: true }
)

export const authModel = mongoose.model('user', authSchema)
