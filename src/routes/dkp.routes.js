import { Router } from 'express'
import { postDkps } from '../controllers/dkp.controllers.js'

const dkps = Router()

dkps.post('/', postDkps)

export default dkps
