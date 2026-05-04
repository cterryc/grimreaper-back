import pkg from 'sequelize'
import DATA_BASE from '../config/db.js'

const { DataTypes } = pkg

const Admin = DATA_BASE.define('admin', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

export default Admin
