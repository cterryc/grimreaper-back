import { parseString } from 'xml2js'
import Main from '../models/main.models.js'
import Alter from '../models/alter.models.js'

export const postDkps = (req, res) => {
  const { body } = req.body

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
        const mainCharacters = []
        const alterCharacters = []

        allCharacters.forEach((ele) => {
          if (!ele.main) {
            mainCharacters.push(ele)
          } else {
            alterCharacters.push(ele)
          }
        })

        const copiaAlter = [...alterCharacters]

        copiaAlter.forEach(({ main }, index) => {
          const matchOneMain = mainCharacters.find(({ name }) => name === main)
          if (!matchOneMain) {
            // busco el main del elemento en la lista de alters
            const matchOneAlter = alterCharacters.find(
              ({ name }) => name === main
            )
            if (matchOneAlter) {
              alterCharacters[index] = {
                ...alterCharacters[index],
                main: matchOneAlter.main
              }
            }
          }
        })

        console.log('esto es MAIN ==>', mainCharacters)
        console.log('esto es ALTER ==>', alterCharacters)

        // ! Crea players Mains
        const mainPromises = mainCharacters.map(
          async ({ name, net, class: characterClass, rank }) => {
            if (!characterClass) {
              console.error(`Error: class for character ${name} is missing.`)
              throw new Error(`Missing class for character ${name}`)
            }

            const mainCharacter = await Main.findOne({ where: { name } })

            if (mainCharacter) {
              return mainCharacter.update({ net, class: characterClass, rank })
            } else {
              console.log(
                `Usuario Main ${name} no encontrado, creando uno nuevo`
              )
              return Main.create({ name, net, class: characterClass, rank })
            }
          }
        )

        const alterPromises = alterCharacters.map(
          async ({ name, class: characterClass, rank, main }) => {
            const alterCharacter = await Alter.findOne({ where: { name } })
            if (!alterCharacter) {
              console.log(
                `Usuario Alter ${name} no encontrado, creando uno nuevo`
              )
              console.log('esto es name ==>', name)
              return Alter.create({
                name,
                class: characterClass,
                rank,
                mainPlayername: main
              })
            }
            const alterCharacterInMain = await Main.findOne({ where: { name } })
            if (alterCharacterInMain) {
              console.log(
                `Usuario alter ${name} encontrado en lista Main, destruyendo`
              )
              await alterCharacterInMain.destroy()
            }
          }
        )

        const removeMainsFromAlters = mainCharacters.map(async ({ name }) => {
          const alterCharacter = await Alter.findOne({ where: { name } })
          if (alterCharacter) {
            console.log(
              `Usuario main ${name} encontrado en lista Alter, destruyendo`
            )
            return alterCharacter.destroy()
          }
        })

        await Promise.all([
          ...mainPromises,
          ...alterPromises,
          ...removeMainsFromAlters
        ])

        res.json({ message: 'Datos procesados correctamente' })
      } catch (error) {
        console.error('Error saving to database:', error)
        res.status(500).send({ error: 'Database error' })
      }
    }
  )
}
