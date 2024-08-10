import { dayHours } from '../helpers/dateUpdate.helpers.js'
import Alter from '../models/alter.models.js'
import DateUpdate from '../models/dateUpdate.models.js'
import Main from '../models/main.models.js'

export const getMains = async (req, res, next) => {
  try {
    const [allMains, allAlters, lastDateFromDb] = await Promise.all([
      Main.findAll(),
      Alter.findAll(),
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
    console.log(date)
    res
      .status(200)
      .send({ response: allMains, alters: allAlters, date: date.date })
  } catch (error) {
    next(error)
  }
}

export const postMains = (req, res) => {
  console.log('postMains')
}
