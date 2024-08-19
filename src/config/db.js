import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'
import pg from 'pg'
dotenv.config()
const { PORT_DB, USER_DB, PASS_DB, NAME_DB, URL_DB, LOCAL } = process.env

let DATA_BASE

if (LOCAL) {
  DATA_BASE = new Sequelize(
    `postgres://${USER_DB}:${PASS_DB}@${PORT_DB}/${NAME_DB}`,
    {
      logging: console.log('Local Data Base'),
      dialectModule: pg
    }
  )
} else {
  DATA_BASE = new Sequelize(URL_DB, {
    logging: console.log('External Data Base')
  })
}

export default DATA_BASE
