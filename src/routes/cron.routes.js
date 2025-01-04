import { Router } from 'express'

const cron = Router()

cron.get('/', (req, res) => {
  res.status(200).send({ message: 'Home alive' })
})

export default cron
