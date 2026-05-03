import Alter from '../models/alter.models.js'

export const getAlters = (req, res) => {
  console.log('getAlters')
}

export const postAlters = (req, res) => {
  console.log('postAlters')
}

export const deleteAlter = async (req, res, next) => {
  try {
    const { name } = req.params
    const alterCharacter = await Alter.findOne({ where: { name } })
    if (!alterCharacter) {
      return res.status(404).send({ error: 'Alter no encontrado' })
    }
    await alterCharacter.destroy()
    res.status(200).send({ message: `Alter ${name} eliminado` })
  } catch (error) {
    next(error)
  }
}
