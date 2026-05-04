import { Router } from 'express'
import { postLogin } from '../controllers/login.controllers.js'
import { changePassword } from '../controllers/changePassword.controllers.js'

const login = Router()

login.post('/', postLogin)
login.post('/change-password', changePassword)

export default login
