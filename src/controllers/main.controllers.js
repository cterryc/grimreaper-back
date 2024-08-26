import FirstBackUp from '../models/firstBackUp.models.js'
import Main from '../models/main.models.js'
import SecondBackUp from '../models/secondBackUp.models.js'

export const getMainsActual = async (req, res, next) => {
  try {
    const mains = await Main.findAll({
      order: [['net', 'DESC']]
    })
    res.status(200).send(mains)
  } catch (error) {
    next(error)
  }
}

export const getMainsFirst = async (req, res, next) => {
  try {
    const mains = await FirstBackUp.findAll({
      order: [['net', 'DESC']]
    })
    res.status(200).send(mains)
  } catch (error) {
    next(error)
  }
}

export const getMainsSecond = async (req, res, next) => {
  try {
    const mains = await SecondBackUp.findAll({
      order: [['net', 'DESC']]
    })
    res.status(200).send(mains)
  } catch (error) {
    next(error)
  }
}
