import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'
dotenv.config()
const { /* PORT_DB, USER_DB, PASS_DB, NAME_DB, */ URL_DB } = process.env

// const DATA_BASE = new Sequelize(`postgres://${USER_DB}:${PASS_DB}@${PORT_DB}/${NAME_DB}`, {
//   logging: false
// })

const DATA_BASE = new Sequelize(URL_DB, {
  logging: false
})

export default DATA_BASE
