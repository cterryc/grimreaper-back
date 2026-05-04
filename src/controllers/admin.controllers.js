import Admin from '../models/admin.models.js'

export const getAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] }
    })
    res.status(200).send(admins)
  } catch (error) {
    next(error)
  }
}

export const createAdmin = async (req, res, next) => {
  try {
    const { username, password, email } = req.body

    if (!username || !password) {
      return res
        .status(400)
        .send({ error: 'Username y password son requeridos' })
    }

    const existingAdmin = await Admin.findOne({ where: { username } })
    if (existingAdmin) {
      return res.status(400).send({ error: 'El usuario ya existe' })
    }

    const newAdmin = await Admin.create({ username, password, email })
    res.status(201).send({
      username: newAdmin.username,
      email: newAdmin.email
    })
  } catch (error) {
    next(error)
  }
}

export const updateAdmin = async (req, res, next) => {
  try {
    const { username } = req.params
    const { password, email } = req.body

    const admin = await Admin.findOne({ where: { username } })
    if (!admin) {
      return res.status(404).send({ error: 'Usuario no encontrado' })
    }

    const updateData = {}
    if (password) updateData.password = password
    if (email) updateData.email = email

    await admin.update(updateData)
    res.status(200).send({ message: 'Usuario actualizado correctamente' })
  } catch (error) {
    next(error)
  }
}

export const deleteAdmin = async (req, res, next) => {
  try {
    const { username } = req.params

    if (username === 'Lunatik') {
      return res
        .status(400)
        .send({ error: 'No se puede eliminar al usuario Lunatik' })
    }

    const admin = await Admin.findOne({ where: { username } })
    if (!admin) {
      return res.status(404).send({ error: 'Usuario no encontrado' })
    }

    await admin.destroy()
    res.status(200).send({ message: `Usuario ${username} eliminado` })
  } catch (error) {
    next(error)
  }
}
