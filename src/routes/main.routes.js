import { Router } from 'express'
import { getMains, postMains } from '../controllers/main.controllers.js'

const main = Router()

main.get('/', getMains)
main.post('/', postMains)

export default main
