import Admin from '../models/admin.models.js'

const generateToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    await Admin.findOne({ where: { email } }).then(async (admin) => {
      if (!admin) {
        return res
          .status(200)
          .send({ message: 'Si el email existe, se enviara un token' })
      }

      const token = generateToken()
      const expiry = new Date(Date.now() + 60 * 60 * 1000)

      await admin.update({
        resetToken: token,
        resetTokenExpiry: expiry
      })

      const url = 'https://api.brevo.com/v3/smtp/email'
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: process.env.BREVO_SENDER_NAME,
            email: process.env.BREVO_SENDER_EMAIL
          },
          to: [
            {
              email: admin.email,
              name: admin.username
            }
          ],
          subject: 'Recuperacion de contrasena',
          htmlContent: `<html><head></head><body><p>Tu codigo de recuperacion es: <strong>${token}</strong></p><p>Este codigo expira en 1 hora.</p></body></html>`
        })
      }

      try {
        const response = await fetch(url, options)
        const data = await response.json()
        console.log('Brevo response:', data)
      } catch (error) {
        console.error('Error enviando email:', error)
      }

      return res
        .status(200)
        .send({ message: 'Si el email existe, se enviara un token' })
    })
  } catch (error) {
    next(error)
  }
}
