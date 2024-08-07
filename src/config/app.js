import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
// importar las rutas aqui abajo
import main from '../routes/main.routes.js'
import alter from '../routes/alter.routes.js'
import dkps from '../routes/dkp.routes.js'
import login from '../routes/login.routes.js'
import scrap from '../routes/scrap.routes.js'
// importar las rutas arriba.

const SERVER = express()

// Permite al servidor recibir y procesar datos enviados desde formularios HTML o solicitudes HTTP en formato JSON, con un límite de tamaño máximo establecido en 50 megabytes.
SERVER.use(express.urlencoded({ extended: true, limit: '50mb' }))
SERVER.use(express.json({ limit: '50mb' }))

SERVER.use(morgan('dev'))
SERVER.use(cors())
SERVER.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // ! se puede cambiar  "*" para habilitar todos los puertos y evitar problemas de CORS
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
  next()
})

// Usar rutas importadas aqui abajo:
SERVER.use('/main', main)
SERVER.use('/alter', alter)
SERVER.use('/dkps', dkps)
SERVER.use('/login', login)
SERVER.use('/scrap', scrap)
// Usar rutas importadas arriba:.

// Captura de Errores
SERVER.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || err
  console.error('esto es err: ', err)
  res.status(status).send(message)
})

export default SERVER
