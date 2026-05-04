import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { lunatikOnly } from '../middlewares/lunatikOnly.middleware.js'
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
} from '../controllers/admin.controllers.js'

const admin = Router()

admin.get('/', getAdmins)
admin.post('/', authMiddleware, lunatikOnly, createAdmin)
admin.put('/:username', authMiddleware, lunatikOnly, updateAdmin)
admin.delete('/:username', authMiddleware, lunatikOnly, deleteAdmin)

export default admin
