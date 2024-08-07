// import { extractFromHtml } from '@extractus/article-extractor'

import Alter from '../models/alter.models.js'

export const getScrap = async (req, res, next) => {
  const { player } = req.params
  try {
    const infoPlayer = await fetch(
      `https://armory.warmane.com/api/character/${player}/icecrown/summary`
    )
    const des = await infoPlayer.json()
    const altersPlayer = await Alter.findAll({
      where: {
        mainPlayername: player
      }
    })
    console.log(altersPlayer)
    res.status(200).send(des)
  } catch (error) {
    next(error)
  }

  // try {
  //   const article = await extract(scrap)
  //   console.log(article)
  //   res.status(200).send({ content: article.content })
  // } catch (err) {
  //   console.error(err)
  // }

  // const rest = await fetch(scrap)
  // const html = await rest.text()

  // you can do whatever with this raw html here: clean up, remove ads banner, etc
  // just ensure a html string returned

  // const article = await extractFromHtml(html, scrap)
  // console.log(article)
}
