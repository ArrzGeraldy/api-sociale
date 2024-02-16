import 'dotenv/config'
import { logger } from './logger'
import mongoose from 'mongoose'

mongoose
  .connect(`${process.env.DB}`)
  .then(() => {
    logger.info('Connected to MongoDB successfully')
  })
  .catch((err) => {
    logger.info('could not connect to database')
    logger.error(err)
    process.exit(1)
  })
