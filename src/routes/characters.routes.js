import { Router } from 'express'
import {
  getCharacters,
  postCharacters
} from '../controllers/characters.controllers.js'

const characters = Router()

characters.get('/', getCharacters)
characters.post('/', postCharacters)

export default characters
