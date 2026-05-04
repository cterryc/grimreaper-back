import Admin from '../models/admin.models.js'

export const authMiddleware = async (req, res, next) => {
  const { user, password } = req.body

  if (!user || !password) {
    return res.status(401).send({ error: 'Credenciales requeridas' })
  }

  try {
    const admin = await Admin.findOne({ where: { username: user } })

    if (!admin || admin.password !== password) {
      return res.status(401).send({ error: 'Credenciales inválidas' })
    }

    next()
  } catch (error) {
    next(error)
  }
}