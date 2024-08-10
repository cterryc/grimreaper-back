import DateUpdate from '../models/dateUpdate.models.js'

export const dayHours = () => {
  const newDate = new Date()

  // Convertir la fecha y hora a la zona horaria de Perú (UTC-5)
  const utcOffset = -5 * 60 // -5 horas en minutos
  const peruDate = new Date(
    newDate.getTime() + (utcOffset + newDate.getTimezoneOffset()) * 60000
  )

  // Obtener las componentes de la fecha
  const dia = peruDate.getDate()
  const mes = peruDate.getMonth() // Los meses comienzan desde 0
  const horas = peruDate.getHours()
  const minutos = peruDate.getMinutes()

  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]

  // Formatear la fecha como quieras
  const dayMonth = `${dia}-${meses[mes]}`
  const minHours = `${horas}:${minutos}`

  return { dayMonth, minHours }
}

export const getLastDateAndUpdate = async () => {
  const { dayMonth, minHours } = dayHours()
  try {
    const lastDateFromDb = await DateUpdate.findOne({
      order: [['createdAt', 'DESC']]
    })
    if (!lastDateFromDb) {
      console.log('creando primer Update')
      await DateUpdate.create({
        date: `${dayMonth} ${minHours}`
      })
      return false
    }
    const lastDateToJson = lastDateFromDb.toJSON()
    const lastDate = lastDateToJson.date.split(' ')

    if (lastDate[0] !== dayMonth) {
      console.log('creando Update')
      await DateUpdate.create({
        date: `${dayMonth} ${minHours}`
      })
      return true
    }
    await DateUpdate.create({
      date: `${dayMonth} ${minHours}`
    })
    console.log('no se creo Update, y actualizando Original DB')
    return false
  } catch (error) {
    throw new Error(error)
  }
}
