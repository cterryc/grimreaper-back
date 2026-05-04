import { Router } from 'express'
import {
  getCharacters,
  postCharacters,
  deleteCharacter
} from '../controllers/characters.controllers.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const characters = Router()

characters.get('/', getCharacters)
characters.post('/', postCharacters)
characters.delete('/:name', authMiddleware, deleteCharacter)

export default characters
