import { dayHours } from '../helpers/dateUpdate.helpers.js'
import Alter from '../models/alter.models.js'
import DateUpdate from '../models/dateUpdate.models.js'
import Main from '../models/main.models.js'

export const getCharacters = async (req, res, next) => {
  try {
    const [allMains, allAlters, lastDateFromDb] = await Promise.all([
      Main.findAll({ order: [['net', 'DESC']] }),
      Alter.findAll({ order: [['net', 'DESC']] }),
      DateUpdate.findOne({
        order: [['createdAt', 'DESC']]
      })
    ])
    let date = ''
    if (!lastDateFromDb) {
      const { dayMonth, minHours } = dayHours()
      date = `${dayMonth} ${minHours}`
    } else {
      date = lastDateFromDb
    }
    // console.log(date)
    res
      .status(200)
      .send({ response: allMains, alters: allAlters, date: date.date })
  } catch (error) {
    next(error)
  }
}

export const postCharacters = (req, res) => {
  console.log('postMains')
}

export const deleteCharacter = async (req, res, next) => {
  try {
    const { name } = req.params
    const mainCharacter = await Main.findOne({ where: { name } })
    if (!mainCharacter) {
      return res.status(404).send({ error: 'Personaje Main no encontrado' })
    }
    await Alter.destroy({ where: { mainPlayername: name } })
    await mainCharacter.destroy()
    res.status(200).send({ message: `Personaje ${name} y sus alters eliminados` })
  } catch (error) {
    next(error)
  }
}
