import Admin from '../models/admin.models.js'

export const matchLogin = async (user, password) => {
  const match = await Admin.findOne({
    where: {
      user,
      password
    }
  })
  if (match) {
    return match
  }
  throw new Error('Usuario no encontrado')
}
