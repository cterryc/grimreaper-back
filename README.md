## Descripción

`grimreaper-back` es una API RESTful backend construida con Node.js y Express para gestionar datos de personajes y registros DKP (Dragon Kill Points) de un guild en el servidor privado Warmane de World of Warcraft. El sistema integra gestión de personajes principales y alternativos, y procesamiento automático de DKP con importación XML.

## Características Principales

- **Gestión de Personajes**: Sistema de relaciones entre personajes principales (`Main`) y alternativos (`Alter`) con seguimiento de vínculos
- **Procesamiento de DKP**: Importación automática desde XML con mecanismo de respaldos en cascada (`FirstBackUp` y `SecondBackUp`)
- **Autenticación**: Sistema de login para administradores con bcrypt

## Stack Tecnológico

- **Runtime**: Node.js con módulos ES6
- **Framework**: Express 4.19.2
- **Base de Datos**: PostgreSQL con Sequelize ORM
- **Procesamiento**: xml2js para parseo de DKP

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
```

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
- `GET /characters` - Obtener todos los personajes
- `POST /characters` - Crear personaje
- `POST /dkps` - Procesar XML de DKP
- `POST /login` - Autenticación de administrador
- `GET /main/actual` - Personajes principales actuales
- `GET /main/first` - Primer respaldo
- `GET /main/second` - Segundo respaldo

## Despliegue

El proyecto está configurado para desplegarse en Vercel como función serverless.

## Licencia

ISC

## Notes

Este README cubre las funcionalidades principales del backend basándome en la estructura del código y las dependencias del proyecto. El sistema utiliza una arquitectura en capas con separación clara entre rutas, controladores y modelos. La aplicación soporta límites de payload de hasta 50MB para manejar archivos XML grandes.
