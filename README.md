## Descripción

`grimreaper-back` es una API RESTful backend construida con Node.js y Express para gestionar datos de personajes y registros DKP (Dragon Kill Points) de un guild en el servidor privado Warmane de World of Warcraft. [0-cite-0](#0-cite-0)  El sistema integra gestión de personajes principales y alternativos, procesamiento automático de DKP con importación XML, y web scraping en tiempo real del Armory de Warmane.

## Características Principales

- **Gestión de Personajes**: Sistema de relaciones entre personajes principales (`Main`) y alternativos (`Alter`) con seguimiento de vínculos
- **Procesamiento de DKP**: Importación automática desde XML con mecanismo de respaldos en cascada (`FirstBackUp` y `SecondBackUp`)
- **Web Scraping**: Extracción de datos de personajes desde `armory.warmane.com` usando Puppeteer [0-cite-1](#0-cite-1) 
- **Autenticación**: Sistema de login para administradores con bcrypt [0-cite-2](#0-cite-2) 

## Stack Tecnológico

- **Runtime**: Node.js con módulos ES6 [0-cite-3](#0-cite-3) 
- **Framework**: Express 4.19.2 [0-cite-4](#0-cite-4) 
- **Base de Datos**: PostgreSQL con Sequelize ORM [0-cite-5](#0-cite-5) 
- **Web Scraping**: Puppeteer + chrome-aws-lambda [0-cite-1](#0-cite-1) 
- **Procesamiento**: xml2js para parseo de DKP [0-cite-6](#0-cite-6) 

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` con las siguientes variables:

```env
# Base de datos local
LOCAL=true
PORT_DB=localhost:5432
USER_DB=tu_usuario
PASS_DB=tu_contraseña
NAME_DB=nombre_bd

# Base de datos producción
URL_DB=tu_url_postgresql

# Puerto del servidor
PORT_HTTP=3001
``` [0-cite-7](#0-cite-7) 

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## Endpoints Principales

- `GET /` - Health check
- `GET /characters` - Obtener todos los personajes [0-cite-9](#0-cite-9) 
- `POST /characters` - Crear personaje [0-cite-10](#0-cite-10) 
- `GET /scrap/:character` - Scrapear datos del Armory [0-cite-11](#0-cite-11) 
- `POST /dkps` - Procesar XML de DKP [0-cite-12](#0-cite-12) 
- `POST /login` - Autenticación de administrador [0-cite-13](#0-cite-13) 
- `GET /main/actual` - Personajes principales actuales [0-cite-14](#0-cite-14) 
- `GET /main/first` - Primer respaldo [0-cite-15](#0-cite-15) 
- `GET /main/second` - Segundo respaldo [0-cite-16](#0-cite-16) 

## Despliegue

El proyecto está configurado para desplegarse en Vercel como función serverless. La aplicación detecta automáticamente el entorno y adapta la configuración de Puppeteer según sea necesario (local vs. serverless). [0-cite-17](#0-cite-17) 

## Licencia

ISC

## Notes

Este README cubre las funcionalidades principales del backend basándome en la estructura del código y las dependencias del proyecto. El sistema utiliza una arquitectura en capas con separación clara entre rutas, controladores y modelos. [0-cite-19](#0-cite-19)  La aplicación soporta límites de payload de hasta 50MB para manejar archivos XML grandes. [0-cite-20](#0-cite-20)

### Citations

**File:** package.json (L2-3)
```json
  "name": "grimreaper-back",
  "version": "1.0.0",
```

**File:** package.json (L6-6)
```json
  "type": "module",
```

**File:** package.json (L8-9)
```json
    "start": "node index.js",
    "dev": "npx nodemon index.js"
```

**File:** package.json (L13-13)
```json
  "license": "ISC",
```

**File:** package.json (L16-16)
```json
    "bcrypt": "5.1.1",
```

**File:** package.json (L19-19)
```json
    "express": "4.19.2",
```

**File:** package.json (L21-25)
```json
    "pg": "8.7.0",
    "pg-hstore": "2.3.4",
    "chrome-aws-lambda": "^6",
    "puppeteer-core": "6.0.0",
    "sequelize": "6.6.5",
```

**File:** package.json (L26-26)
```json
    "xml2js": "0.6.2"
```

**File:** src/config/db.js (L5-5)
```javascript
const { PORT_DB, USER_DB, PASS_DB, NAME_DB, URL_DB, LOCAL } = process.env
```

**File:** src/config/db.js (L9-16)
```javascript
if (LOCAL) {
  DATA_BASE = new Sequelize(
    `postgres://${USER_DB}:${PASS_DB}@${PORT_DB}/${NAME_DB}`,
    {
      logging: console.log('Local Data Base'),
      dialectModule: pg
    }
  )
```

**File:** src/config/app.js (L4-12)
```javascript
// importar las rutas aqui abajo
import characters from '../routes/characters.routes.js'
import alter from '../routes/alter.routes.js'
import dkps from '../routes/dkp.routes.js'
import login from '../routes/login.routes.js'
import scrap from '../routes/scrap.routes.js'
import main from '../routes/main.routes.js'
import monitor from '../routes/monitor.routes.js'
import cron from '../routes/cron.routes.js'
```

**File:** src/config/app.js (L18-19)
```javascript
SERVER.use(express.urlencoded({ extended: true, limit: '50mb' }))
SERVER.use(express.json({ limit: '50mb' }))
```

**File:** src/config/app.js (L35-35)
```javascript
SERVER.use('/characters', characters)
```

**File:** src/config/app.js (L37-37)
```javascript
SERVER.use('/dkps', dkps)
```

**File:** src/config/app.js (L38-38)
```javascript
SERVER.use('/login', login)
```

**File:** src/config/app.js (L39-39)
```javascript
SERVER.use('/scrap', scrap)
```

**File:** src/routes/characters.routes.js (L10-10)
```javascript
characters.post('/', postCharacters)
```

**File:** src/routes/main.routes.js (L10-10)
```javascript
main.get('/actual', getMainsActual)
```

**File:** src/routes/main.routes.js (L11-11)
```javascript
main.get('/first', getMainsFirst)
```

**File:** src/routes/main.routes.js (L12-12)
```javascript
main.get('/second', getMainsSecond)
```
