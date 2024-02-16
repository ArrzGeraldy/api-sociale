import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    event_id: {
      type: String,
      unique: true
    },
    title: {
      type: String
    },
    image: {
      type: Object
    },
    category: {
      type: String
    },
    price: {
      type: String
    },
    startEvent: {
      type: String
    },
    endEvent: {
      type: String
    },
    location: {
      type: String
    },
    desc: {
      type: String
    },
    author: {
      type: Object,
      require: true
    }
  },
  { timestamps: true }
)

const eventModel = mongoose.model('event', eventSchema)

export default eventModel
