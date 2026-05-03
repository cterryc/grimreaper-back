import { Router } from 'express'
import {
  getCharacters,
  postCharacters,
  deleteCharacter
} from '../controllers/characters.controllers.js'

const characters = Router()

characters.get('/', getCharacters)
characters.post('/', postCharacters)
characters.delete('/:name', deleteCharacter)

export default characters
