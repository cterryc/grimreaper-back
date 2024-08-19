import { Router } from 'express'
import { getScrap } from '../controllers/scrap.controller.js'

const scrap = Router()

scrap.get('/:character', getScrap)

export default scrap
