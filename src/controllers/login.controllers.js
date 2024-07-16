// import { matchLogin } from '../helpers/login.helpers.js'

export const postLogin = async (req, res, next) => {
  const { user, password } = req.body
  const admin = 'terry'
  const pass = 'Q5315210q'
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
