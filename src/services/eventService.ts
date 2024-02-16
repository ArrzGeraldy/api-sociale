import eventModel from '../models/event.model'
import EventType from '../types/event.type'

export const addEventToDB = async (payload: EventType) => {
  return await eventModel.create(payload)
}

export const countTotalEvents = async () => {
  return await eventModel.find().countDocuments()
}
export const countTotalEventsByCategory = async (payload: string) => {
  return await eventModel
    .find({
      category: payload
    })
    .countDocuments()
}
export const countTotalEventsByTitle = async (search: string) => {
  return await eventModel
    .find({
      title: { $regex: search, $options: 'i' }
    })
    .countDocuments()
}

export const getEventFromDB = async (
  pageNumber: number,
  limit: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => {
  return await eventModel
    .find()
    .skip((pageNumber - 1) * limit)
    .limit(limit)
}

export const getEventByIdFromDB = async (event_id: string) => {
  return await eventModel.findOne({
    event_id
  })
}

export const getEventByNameFromDB = async (search: string) => {
  return await eventModel.find({
    title: { $regex: search, $options: 'i' }
  })
}

export const getEventByCategoryFromDB = async (category: string) => {
  return await eventModel.find({
    category
  })
}

export const updateEventById = async (event_id: string, payload: EventType) => {
  return await eventModel.findOneAndUpdate({ event_id }, { $set: payload })
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateEventByUserId = async (
  user_id: string,
  username: string | null | undefined,
  email: string | null | undefined,
  role: string
) => {
  return await eventModel.updateMany(
    { 'author.user_id': user_id },
    {
      $set: {
        author: {
          user_id,
          username,
          email,
          role
        }
      }
    }
  )
}

export const deleteEventById = async (event_id: string) => {
  return await eventModel.findOneAndDelete({ event_id })
}
