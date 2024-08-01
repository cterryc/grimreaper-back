import bcrypt from 'bcrypt'
// import { matchLogin } from '../helpers/login.helpers.js'

export const postLogin = async (req, res, next) => {
  const { user, password } = req.body
  const admin = 'terry'
  const pass = 'Q5315210q'
  const clave = bcrypt.hash(pass, 10, function (_err, hash) {
    console.log('esto es logIN', hash)
  })
  console.log('esto es logOUT', clave)
  try {
    if (admin === user.toLowerCase() && pass === password) {
      return res.status(200).send({ response: true })
    }
    throw new Error('Usuario no Encontrado')
    // const match = await matchLogin(user, password)
    // if (match) {
    //   res.status(200).send(match)
    // }
  } catch (error) {
    console.log('esto es error ==>', error)
    next(error)
  }
}
