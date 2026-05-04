import Admin from '../models/admin.models.js'

export const changePassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body

    const admin = await Admin.findOne({ where: { email } })
    if (!admin) {
      return res.status(404).send({ error: 'Usuario no encontrado' })
    }

    if (admin.resetToken !== token) {
      return res.status(400).send({ error: 'Token invalido' })
    }

    if (!admin.resetTokenExpiry || new Date() > admin.resetTokenExpiry) {
      return res.status(400).send({ error: 'Token expirado' })
    }

    await admin.update({
      password: newPassword,
      resetToken: null,
      resetTokenExpiry: null
    })

    res.status(200).send({ message: 'Contrasena actualizada correctamente' })
  } catch (error) {
    next(error)
  }
}
