// import { extractFromHtml } from '@extractus/article-extractor'
import dotenv from 'dotenv'
import pup from 'puppeteer'
import chro from 'chrome-aws-lambda'
import puppeteerCore from 'puppeteer-core'
dotenv.config()

let chrome = {}
let puppeteer

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = chro
  puppeteer = puppeteerCore
} else {
  puppeteer = pup
}

export const getScrap = async (req, res, next) => {
  let options = {}

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true
    }
  }

  try {
    const { character } = req.params
    const urlCharacter = `https://armory.warmane.com/character/${character}/Icecrown/summary`

    // Lanza el navegador
    const browser = await puppeteer.launch(options)
    const page = await browser.newPage()

    // Navega a la URL específica del personaje
    await page.goto(urlCharacter)

    // Evaluar la página y extraer todos los atributos de las etiquetas <a> y <img>
    const elementos = await page.evaluate(() => {
      const left = document.querySelectorAll('.item-left div div a')
      const right = document.querySelectorAll('.item-right div div a')
      const bottom = document.querySelectorAll('.item-bottom div div a')

      // Función para extraer atributos de un nodo
      const extractAttributes = (node) => {
        const attrs = {}
        for (const attr of node.attributes) {
          attrs[attr.name] = attr.value
        }
        return attrs
      }

      // Extrae atributos de <a> y <img> (si existe) en los elementos
      const extractElementsAttributes = (elements) => {
        return Array.from(elements).map((ele) => {
          const aAttributes = extractAttributes(ele)
          const imgElement = ele.querySelector('img')
          const imgAttributes = imgElement
            ? extractAttributes(imgElement)
            : null

          return { ...aAttributes, ...imgAttributes }
        })
      }

      const leftAttributes = extractElementsAttributes(left)
      const rightAttributes = extractElementsAttributes(right)
      const bottomAttributes = extractElementsAttributes(bottom)

      return {
        left: leftAttributes,
        right: rightAttributes,
        bottom: bottomAttributes
      }
    })

    // Cierra el navegador
    await browser.close()

    // Muestra los atributos extraídos en la consola

    // Devuelve la respuesta JSON con los atributos extraídos
    res.status(200).send(elementos)
  } catch (error) {
    next(error)
  }
}
