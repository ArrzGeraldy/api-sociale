import { Request, Response } from 'express'
import { addCategoryToDB, getCategoryFromDB } from '../services/CategoryService'
import { logger } from '../utils/logger'
import { createCategoryValidation } from '../validations/category.validation'

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await getCategoryFromDB()
    logger.info('Success get category')
    return res.status(200).send({
      statusCode: 200,
      status: true,
      category
    })
  } catch (error) {
    logger.info('failed get category')
    logger.error('ERROR = ', error)
    return res.status(400).send({
      statusCode: 400,
      status: true,
      message: 'cannot find category'
    })
  }
}

export const createCategory = async (req: Request, res: Response) => {
  const { error, value } = createCategoryValidation(req.body)
  if (error) {
    logger.info('failed input category')
    logger.error(error.details[0].message)
    return res.status(422).send({
      type: false,
      statusCode: 422,
      message: error.details[0].message
    })
  }

  try {
    const category = await addCategoryToDB(value)
    logger.info('Success create new category')
    return res.status(201).send({
      type: true,
      statusCode: 201,
      data: category
    })
  } catch (error) {
    logger.error('Failed create category')
    return res.status(201).send({
      type: true,
      statusCode: 201,
      message: error
    })
  }
}
