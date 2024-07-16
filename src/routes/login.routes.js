import { Router } from 'express'
import { postLogin } from '../controllers/login.controllers.js'

const login = Router()

login.post('/', postLogin)

export default login
