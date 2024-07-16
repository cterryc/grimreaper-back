import { DataTypes } from 'sequelize'
import DATA_BASE from '../config/db.js'

const Admin = DATA_BASE.define('admin', {
  user: {
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
