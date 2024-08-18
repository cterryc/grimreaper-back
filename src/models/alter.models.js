import pkg from 'sequelize'
import DATA_BASE from '../config/db.js'
import Main from './main.models.js'

const { DataTypes } = pkg

const Alter = DATA_BASE.define('alter', {
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
  },
  mainPlayername: {
    type: DataTypes.STRING,
    references: {
      model: Main,
      key: 'name'
    }
  }
})

Main.hasMany(Alter, {
  foreignKey: 'mainPlayername'
})

Alter.belongsTo(Main, {
  foreignKey: 'mainPlayername'
})

export default Alter
