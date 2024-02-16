import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    unique: true
  }
})

export const categoryModel = mongoose.model('category', categorySchema)
