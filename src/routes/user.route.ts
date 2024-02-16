import { Router } from 'express'
import { requireUser } from '../middleware/auth'
import { getEventUser, getUserDetail, updateUser } from '../controllers/user.controller'

export const UserRouter: Router = Router()

UserRouter.get('/events', requireUser, getEventUser)
UserRouter.get('/', requireUser, getUserDetail)
UserRouter.put('/', requireUser, updateUser)
