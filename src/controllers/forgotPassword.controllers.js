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
          htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #05030E; font-family: Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #05030E;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" max-width="500px" cellspacing="0" cellpadding="0" style="background-color: #150529; border-radius: 12px; border: 1px solid #7B2CBF;">
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h1 style="color: #C77DFF; font-size: 24px; margin: 0 0 10px 0;">Recuperación de Contraseña</h1>
              <p style="color: #9D4EDD; font-size: 14px; margin: 0 0 30px 0;">Tu código de recuperación</p>
              <div style="background-color: #2A0A4A; border-radius: 8px; padding: 20px; margin: 0 0 30px 0; border: 2px solid #9D4EDD;">
                <span style="color: #C77DFF; font-size: 36px; font-weight: bold; letter-spacing: 8px;">${token}</span>
              </div>
              <p style="color: #9D4EDD; font-size: 12px; margin: 0;">Este código expira en <strong style="color: #7B2CBF;">1 hora</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
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
