import { authModel } from '../models/auth.model'
import RegisterType from '../types/register.type'

export const addUserToDB = async (payload: RegisterType) => {
  return await authModel.create(payload)
}

export const getUserFromDB = async () => {
  return await authModel.find()
}

export const findUserByEmail = async (email: string) => {
  return await authModel.findOne({ email })
}
