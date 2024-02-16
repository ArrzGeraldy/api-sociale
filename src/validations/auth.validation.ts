import Joi from 'joi'
import registerType from '../types/register.type'

export const createRegisterValidation = (payload: registerType) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().allow('', null)
  })
  return schema.validate(payload)
}

export const createLoginValidation = (payload: registerType) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
  return schema.validate(payload)
}

export const refreshSessionValidatoin = (payload: registerType) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required()
  })

  return schema.validate(payload)
}
