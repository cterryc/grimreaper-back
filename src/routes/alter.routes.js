import { Router } from 'express'
import { getAlters, postAlters } from '../controllers/alter.controllers.js'

const alter = Router()

alter.get('/', getAlters)
alter.post('/', postAlters)

export default alter
