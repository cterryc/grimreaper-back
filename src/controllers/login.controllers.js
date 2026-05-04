import Admin from '../models/admin.models.js'

export const postLogin = async (req, res, next) => {
  try {
    const { user, password } = req.body

    console.log(user, password)

    const admin = await Admin.findOne({ where: { username: user } })
    if (!admin) {
      return res.status(401).send({ error: 'Usuario no Encontrado' })
    }

    if (admin.password !== password) {
      return res.status(401).send({ error: 'Usuario no Encontrado' })
    }

    res.status(200).send({ response: true })
  } catch (error) {
    next(error)
  }
}
