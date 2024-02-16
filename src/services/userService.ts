import { authModel } from '../models/auth.model'
import eventModel from '../models/event.model'

export const getEventsUserByIdFromDB = async (user_id: string) => {
  return await eventModel.find({
    'author.user_id': user_id
  })
}

export const updateUserData = async (user_id: string, payload: object) => {
  return await authModel.findOneAndUpdate({ user_id }, { $set: payload })
}
