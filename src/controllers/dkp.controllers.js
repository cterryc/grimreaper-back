import { parseString } from 'xml2js'
import Main from '../models/main.models.js'

export const postDkps = (req, res) => {
  const { body } = req.body // Accede directamente a req.body

  parseString(
    body,
    { explicitArray: false, mergeAttrs: true },
    async (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err)
        return res.status(400).send({ error: 'Invalid XML' })
      }

      try {
        const allCharacters = result['QDKP2EXPORT-DKP'].PLAYER
        const mainCharacters = allCharacters.filter((ele) => !ele.main)

        for (const ele of mainCharacters) {
          const findToEditOne = await Main.findOne({
            where: { name: ele.name }
          })

          if (findToEditOne) {
            await findToEditOne.update({ net: ele.net })
          } else {
            console.log(`Usuario ${ele.name} no encontrado, creando uno nuevo`)
            await Main.create(ele) // Crea uno nuevo si no existe
          }
        }

        res.json({ message: 'Datos procesados correctamente' })
      } catch (error) {
        console.error('Error saving to database:', error)
        res.status(500).send({ error: 'Database error' })
      }
    }
  )
}
