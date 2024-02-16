import Joi from 'joi'
import RegisterType from '../types/register.type'

export const createUpadateUsernameValidation = (payload: RegisterType) => {
  const schema = Joi.object({
    user_id: Joi.string().allow('', null),
    username: Joi.string().allow('', null),
    email: Joi.string().allow('', null),
    password: Joi.string().allow('', null),
    role: Joi.string().allow('', null)
  })
  return schema.validate(payload)
}
