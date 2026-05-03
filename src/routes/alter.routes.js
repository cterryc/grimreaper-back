import { Router } from 'express'
import { getAlters, postAlters, deleteAlter } from '../controllers/alter.controllers.js'

const alter = Router()

alter.get('/', getAlters)
alter.post('/', postAlters)
alter.delete('/:name', deleteAlter)

export default alter
