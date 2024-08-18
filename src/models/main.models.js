import pkg from 'sequelize'
import DATA_BASE from '../config/db.js'

const { DataTypes } = pkg

const Main = DATA_BASE.define('main', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  gearscore: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  class: {
    type: DataTypes.STRING,
    allowNull: false
  },
  net: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  spent: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  hours: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  rank: {
    type: DataTypes.STRING,
    allowNull: true
  }
})

export default Main
