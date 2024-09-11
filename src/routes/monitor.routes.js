import express from 'express'

const monitor = express()

monitor.get('/', (req, res) => {
  res.status(200).send({ success: 'ok' })
})

export default monitor
