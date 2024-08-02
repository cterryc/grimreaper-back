import Alter from '../models/alter.models.js'
import Main from '../models/main.models.js'

export const getMains = async (req, res, next) => {
  try {
    const allMains = await Main.findAll()
    const allAlters = await Alter.findAll()
    res.status(200).send({ response: allMains, alters: allAlters })
  } catch (error) {
    next(error)
  }
}

export const postMains = (req, res) => {
  console.log('postMains')
}
