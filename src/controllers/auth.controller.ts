/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import {
  createLoginValidation,
  createRegisterValidation,
  refreshSessionValidatoin
} from '../validations/auth.validation'
import { addUserToDB, findUserByEmail, getUserFromDB } from '../services/authService'
import { v4 } from 'uuid'
import { checkPassword, hashing } from '../utils/hashing'
import { signJWT, verifyJWT } from '../utils/jwt'
import { logger } from '../utils/logger'

export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await getUserFromDB()
    return res.send({ data: users })
  } catch (error) {
    res.status(400).send({
      message: 'cannot find users'
    })
  }
}

export const RegisterUser = async (req: Request, res: Response) => {
  req.body.user_id = v4()
  const { error, value } = createRegisterValidation(req.body)

  if (error) {
    logger.error(`ERROR = ${error.details[0].message}`)
    return res.status(400).send({
      message: error.details[0].message
    })
  }

  try {
    const isNotUniqueEmail = await findUserByEmail(value.email)
    if (isNotUniqueEmail) {
      logger.info('failed Register duplicat email')
      return res.status(400).send({
        statusCod: 400,
        type: false,
        message: 'Email already use'
      })
    }

    value.password = hashing(value.password)

    const user = await addUserToDB(value)

    if (user) {
      logger.info('Succes register')
      return res.status(201).send({
        statusCode: 201,
        type: true,
        message: 'succes register'
      })
    }
  } catch (error) {
    logger.info('Failed register user')
    res.status(400).send({
      type: false,
      message: 'Failed register user',
      err: error
    })
  }
}
export const loginUser = async (req: Request, res: Response) => {
  const { error, value } = createLoginValidation(req.body)
  if (error) {
    return res.status(400).send({
      message: error.details[0].message
    })
  }
  try {
    const user = await findUserByEmail(value.email)
    const isValid = checkPassword(value.password, user?.password || '')

    if (!isValid) return res.status(400).send({ type: false, message: 'Invalid email or password' })

    const accesToken = signJWT({ ...user }, { expiresIn: '1d' })
    const refreshToken = signJWT({ ...user }, { expiresIn: '1y' })

    res.status(200).send({
      message: 'succes login',
      type: true,
      data: {
        username: user?.username,
        access_token: accesToken,
        refresh_token: refreshToken
      }
    })
  } catch (error) {
    logger.info('Invalid email or password')
    res.status(500).send({
      type: false,
      message: error
    })
  }
}

export const refreshSession = async (req: Request, res: Response) => {
  const { error, value } = refreshSessionValidatoin(req.body)
  if (error) {
    logger.info(`ERR - login user = ${error.details[0].message}`)
    return res.status(400).send({
      type: false,
      statusCode: 400,
      message: error.details[0].message
    })
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { decoded }: any = verifyJWT(value.refreshToken)
    // console.log(decoded);
    const user = await findUserByEmail(decoded._doc.email)
    if (!user) return false
    const accesToken = signJWT({ ...user }, { expiresIn: '1d' })
    return res.status(200).send({
      type: true,
      statusCode: 200,
      message: 'succes login',
      data: { accesToken, user }
    })
  } catch (error: any) {
    return res.status(400).send({
      type: false,
      statusCode: 400,
      message: error.message
    })
  }
}
