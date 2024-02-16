import Joi from 'joi'
import { CategoryType } from '../types/category.type'

export const createCategoryValidation = (payload: CategoryType) => {
  const schema = Joi.object({
    category: Joi.string().required()
  })
  return schema.validate(payload)
}
