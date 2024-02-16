import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const signJWT = (payload: object, options?: jwt.SignOptions | undefined) => {
  return jwt.sign(payload, `${process.env.JWT_KEY}`, {
    ...(options && options)
  })
}

export const verifyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, `${process.env.JWT_KEY}`)
    return {
      valid: true,
      expired: false,
      decoded
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === 'jwt is expired or not eligible to use',
      decoded: null
    }
  }
}
