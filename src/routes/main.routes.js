import { Router } from 'express'
import {
  getMainsActual,
  getMainsFirst,
  getMainsSecond
} from '../controllers/main.controllers.js'

const main = Router()

main.get('/actual', getMainsActual)
main.get('/first', getMainsFirst)
main.get('/second', getMainsSecond)

export default main
