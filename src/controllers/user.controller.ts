import { Request, Response } from 'express'
import { getEventsUserByIdFromDB, updateUserData } from '../services/userService'
import { logger } from '../utils/logger'
import { createUpadateUsernameValidation } from '../validations/user.validation'
import { signJWT } from '../utils/jwt'
import { findUserByEmail } from '../services/authService'
import { updateEventByUserId } from '../services/eventService'
// import { updateEvent } from "./event.controller";

export const getEventUser = async (req: Request, res: Response) => {
  const user = res.locals.user
  const userId = user._doc.user_id

  try {
    const eventsUser = await getEventsUserByIdFromDB(userId)
    logger.info('get user event')
    return res.status(200).send({
      statusCode: 200,
      type: true,
      data: eventsUser
    })
  } catch (error) {
    logger.info('Failed get Event by user id')
    return res.status(400).send({
      statusCode: 400,
      type: false,
      message: 'Failed get Event by user id'
    })
  }
}

export const getUserDetail = async (req: Request, res: Response) => {
  const user = res.locals.user
  res.status(200).send({
    statusCode: 200,
    type: true,
    data: {
      username: user._doc.username,
      email: user._doc.email,
      register: user._doc.timestamps
    }
  })
}

export const updateUser = async (req: Request, res: Response) => {
  const user = res.locals.user
  const { error, value } = createUpadateUsernameValidation(req.body)
  if (error) {
    logger.info(`FAILED update user`)
    logger.error(`error: ${error.details[0].message}`)
    return res.send({
      message: error.details[0].message
    })
  }
  try {
    const update = await updateUserData(user._doc.user_id, value)
    if (update) {
      const userUpdate = await findUserByEmail(user._doc.email)

      if (userUpdate) {
        const updateEvent = await updateEventByUserId(
          user._doc.user_id,
          userUpdate.username,
          userUpdate.email,
          userUpdate.role
        )
        logger.info(`Success update user`)
        const accesToken = signJWT({ ...userUpdate }, { expiresIn: '1d' })
        const refreshToken = signJWT({ ...userUpdate }, { expiresIn: '1y' })
        res.status(200).send({
          type: true,
          statusCode: 200,
          data: {
            event: updateEvent,
            username: value,
            access_token: accesToken,
            refresh_token: refreshToken
          }
        })
      }
    }
  } catch (error) {
    logger.info(`Failed update user`)
    return res.status(400).send({
      statusCode: 400,
      type: false,
      message: 'Failed update user'
    })
  }
}
