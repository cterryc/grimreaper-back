import { Router } from 'express'
import { getAlters, postAlters, deleteAlter } from '../controllers/alter.controllers.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const alter = Router()

alter.get('/', getAlters)
alter.post('/', postAlters)
alter.delete('/:name', authMiddleware, deleteAlter)

export default alter
