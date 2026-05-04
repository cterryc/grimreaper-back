import { Router } from 'express'
import { postDkps } from '../controllers/dkp.controllers.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const dkps = Router()

dkps.post('/', authMiddleware, postDkps)

export default dkps
