import { parseString } from 'xml2js'
import Main from '../models/main.models.js'
import Alter from '../models/alter.models.js'

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
        // todos los Personajes convertidos a "JSON"
        const allCharacters = result['QDKP2EXPORT-DKP'].PLAYER
        // seleccionando Personajes MAIN
        // const mainCharacters = allCharacters.filter((ele) => !ele.main)
        // const alterCharacters = allCharacters.filter((ele) => ele.main)
        const mainCharacters = []
        const alterCharacters = []

        allCharacters.forEach((ele) => {
          if (!ele.main) {
            mainCharacters.push(ele)
          } else {
            alterCharacters.push(ele)
          }
        })

        // ! busca en la lista de Main por nombre para editar su DKP u otra propiedad
        // ! si no existe lo crea
        for (const ele of mainCharacters) {
          const findToEditOne = await Main.findOne({
            where: { name: ele.name }
          })

          if (findToEditOne) {
            await findToEditOne.update({ net: ele.net })
          } else {
            console.log(
              `Usuario Main ${ele.name} no encontrado, creando uno nuevo`
            )
            await Main.create(ele) // Crea uno nuevo si no existe
          }
        }

        // ! busca alters en la lista Main si existe lo destruye
        for (const ele of alterCharacters) {
          const findToDestroyOne = await Main.findOne({
            where: { name: ele.name }
          })

          if (findToDestroyOne) {
            console.log(
              `Usuario alter ${ele.name} encontrado en lista Main, destruyendo`
            )
            await findToDestroyOne.destroy()
          }
        }

        // ! Busca alters en la lista de Alters, si no existe lo crea
        for (const ele of alterCharacters) {
          const findToDestroyOne = await Alter.findOne({
            where: { name: ele.name }
          })

          if (!findToDestroyOne) {
            console.log(
              `Usuario Alter ${ele.name} no encontrado, creando uno nuevo`
            )
            await Alter.create(ele) // Crea uno nuevo si no existe
          }
        }

        // ! busca mains en la list Alters, si existe lo destruye
        for (const ele of mainCharacters) {
          const findToDestroyOne = await Alter.findOne({
            where: { name: ele.name }
          })

          if (findToDestroyOne) {
            console.log(
              `Usuario main ${ele.name} encontrado en lista Alter, destruyendo`
            )
            await findToDestroyOne.destroy()
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
