import { Router } from 'express'
import { getScrap } from '../controllers/scrap.controller.js'

const scrap = Router()

scrap.get('/:player', getScrap)

export default scrap
