import { parseString } from 'xml2js'
import Main from '../models/main.models.js'
import Alter from '../models/alter.models.js'
import FirstBackUp from '../models/firstBackUp.models.js'
import SecondBackUp from '../models/secondBackUp.models.js'
import { getLastDateAndUpdate } from '../helpers/dateUpdate.helpers.js'

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
        if (!result['QDKP2EXPORT-DKP']) {
          return res.status(400).send({ error: 'XML inválido: falta QDKP2EXPORT-DKP' })
        }

        let allCharacters = result['QDKP2EXPORT-DKP'].PLAYER
        if (!allCharacters) {
          return res.status(400).send({ error: 'XML inválido: falta PLAYER' })
        }

        if (!Array.isArray(allCharacters)) {
          allCharacters = [allCharacters]
        }

        const mainCharacters = []
        const alterCharacters = []

        allCharacters.forEach((ele) => {
          if (!ele.main) {
            mainCharacters.push(ele)
          } else {
            alterCharacters.push(ele)
          }
        })

        const validMainNames = new Set(mainCharacters.map(({ name }) => name))

        const alterNamesMap = new Map(alterCharacters.map((c, i) => [c.name, i]))

        const copiaAlter = [...alterCharacters]

        copiaAlter.forEach(({ main }, index) => {
          if (!validMainNames.has(main) && alterNamesMap.has(main)) {
            alterCharacters[index].main = alterCharacters[alterNamesMap.get(main)].main
          }
        })

        let createBackUp = false
        let processFirstBackUp = []
        let processSecondBackUp = []
        const getFirstBack = (await Main.findAll()).map((ele) => ele.toJSON())
        const getSecondBack = (await FirstBackUp.findAll()).map((ele) =>
          ele.toJSON()
        )

        const isNewDay = await getLastDateAndUpdate()
        if (isNewDay) {
          createBackUp = true
        }

        // ! Crea players Mains
        const mainPromises = mainCharacters.map(
          async ({ name, net, class: characterClass, rank, gearscore, spent, total, hours }) => {
            if (!characterClass) {
              console.error(`Error: class for character ${name} is missing.`)
              throw new Error(`Missing class for character ${name}`)
            }

            const mainCharacter = await Main.findOne({ where: { name } })

            if (mainCharacter && mainCharacter.net !== net) {
              if (createBackUp && !processFirstBackUp.length) {
                console.log('Creando backup por ser nuevo dia')
                const fields = ['name', 'gearscore', 'class', 'net', 'spent', 'total', 'hours', 'rank']
                await SecondBackUp.truncate()
                processSecondBackUp = [SecondBackUp.bulkCreate(getSecondBack, { fields })]
                await FirstBackUp.truncate()
                processFirstBackUp = [FirstBackUp.bulkCreate(getFirstBack, { fields })]
              }
              return mainCharacter.update({ net, class: characterClass, rank, gearscore, spent, total, hours })
            } else if (!mainCharacter) {
              return Main.create({ name, net, class: characterClass, rank, gearscore, spent, total, hours })
            }
          }
        )

        const alterPromises = alterCharacters.map(
          async ({ name, class: characterClass, rank, main, net, gearscore, spent, total, hours }) => {
            const alterCharacterInMain = await Main.findOne({ where: { name } })
            if (alterCharacterInMain) {
              console.log(
                `Usuario alter ${name} encontrado en lista Main, destruyendo`
              )
              await alterCharacterInMain.destroy()
            }

            const validatedMain = validMainNames.has(main) ? main : null
            if (!validatedMain) {
              console.warn(`Alter ${name} tiene main "${main}" invalido, asignando null`)
            }

            const alterCharacter = await Alter.findOne({ where: { name } })
            if (!alterCharacter) {
              console.log(
                `Usuario Alter ${name} no encontrado, creando uno nuevo`
              )
              return Alter.create({
                name,
                class: characterClass,
                rank,
                net,
                gearscore,
                spent,
                total,
                hours,
                mainPlayername: validatedMain
              })
            } else {
              return alterCharacter.update({
                net,
                class: characterClass,
                rank,
                gearscore,
                spent,
                total,
                hours,
                mainPlayername: validatedMain
              })
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

        const results = await Promise.allSettled([
          ...mainPromises,
          ...alterPromises,
          ...removeMainsFromAlters,
          ...processFirstBackUp,
          ...processSecondBackUp
        ])

        const failedOperations = results.filter((r) => r.status === 'rejected')
        if (failedOperations.length > 0) {
          console.error(`${failedOperations.length} operaciones fallaron:`)
          failedOperations.forEach((r, i) => {
            console.error(`  Fallo ${i + 1}:`, r.reason?.message || r.reason)
          })
        }

        const successCount = results.filter((r) => r.status === 'fulfilled').length
        console.log(`Operaciones completadas: ${successCount}/${results.length}`)

        res.json({ message: 'Datos procesados correctamente' })
      } catch (error) {
        console.error('Error saving to database:', error)
        res.status(500).send({ error: 'Database error' })
      }
    }
  )
}
