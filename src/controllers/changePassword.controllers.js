import Admin from '../models/admin.models.js'

export const changePassword = async (req, res, next) => {
  try {
    const { user, newPassword } = req.body

    const admin = await Admin.findOne({ where: { username: user } })
    if (!admin) {
      return res.status(404).send({ error: 'Usuario no encontrado' })
    }

    await admin.update({ password: newPassword })
    res.status(200).send({ message: 'Contraseña actualizada correctamente' })
  } catch (error) {
    next(error)
  }
}