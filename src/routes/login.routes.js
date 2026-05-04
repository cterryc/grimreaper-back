import { Router } from 'express'
import { postLogin } from '../controllers/login.controllers.js'
import { changePassword } from '../controllers/changePassword.controllers.js'
import { forgotPassword } from '../controllers/forgotPassword.controllers.js'

const login = Router()

login.post('/', postLogin)
login.post('/forgot-password', forgotPassword)
login.post('/change-password', changePassword)

export default login
