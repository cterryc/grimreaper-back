export const lunatikOnly = (req, res, next) => {
  const { user } = req.body

  if (user !== 'Lunatik') {
    return res
      .status(403)
      .send({ error: 'Solo Lunatik puede realizar esta accion' })
  }

  next()
}
