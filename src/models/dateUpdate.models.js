import { DataTypes } from 'sequelize'
import DATA_BASE from '../config/db.js'

const DateUpdate = DATA_BASE.define('dateupdate', {
  date: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  user: {
    type: DataTypes.STRING,
    allowNull: true
  }
})

export default DateUpdate
