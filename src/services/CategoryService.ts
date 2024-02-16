import { categoryModel } from '../models/category.model'
import { CategoryType } from '../types/category.type'

export const getCategoryFromDB = async () => {
  return await categoryModel.find()
}

export const addCategoryToDB = async (payload: CategoryType) => {
  return await categoryModel.create(payload)
}
