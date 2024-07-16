import SERVER from './src/config/app.js'
import DATA_BASE from './src/config/db.js'

const { PORT_HTTP } = process.env
const PORT = PORT_HTTP || 3001

SERVER.listen(PORT, async () => {
  await DATA_BASE.sync({ force: false })
  console.log(`Server is listening on port ${PORT}`)
})
