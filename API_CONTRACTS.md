# Contratos API - grimreaper-back

## Tabla de Contenidos

- [Characters](#characters)
- [Alter](#alter)
- [DKPs](#dkps)
- [Login](#login)
- [Main](#main)
- [Monitor](#monitor)
- [Cron](#cron)

---

## Characters

### GET `/characters`

Obtiene todos los personajes (Mains y Alters) con la fecha de última actualización.

#### Response

**200 OK**
```json
{
  "response": [
    {
      "name": "Maicolmb",
      "class": "Hunter",
      "rank": "New Moon",
      "net": 1000,
      "spent": 500,
      "total": 1500,
      "gearscore": 5000,
      "hours": 100
    }
  ],
  "alters": [
    {
      "name": "Jusstgg",
      "class": "Priest",
      "rank": "Member",
      "net": 500,
      "spent": 200,
      "total": 700,
      "gearscore": 4000,
      "hours": 50,
      "mainPlayername": "Maicolmb"
    }
  ],
  "date": "2-Mayo 14:30"
}
```

**Nota:** Los resultados de `response` (Mains) y `alters` están ordenados por `net` de mayor a menor.

---

### POST `/characters`

*Endpoint no implementado (stub).*

#### Response

**200 OK**
```json
{
  "message": "postMains"
}
```

---

### DELETE `/characters/:name`

Elimina un personaje Main y todos sus Alters asociados.

#### Request

**URL Params:**
```
name: string (nombre del personaje Main)
```

#### Response

**200 OK - Éxito**
```json
{
  "message": "Personaje Maicolmb y sus alters eliminados"
}
```

**404 Not Found - Main no encontrado**
```json
{
  "error": "Personaje Main no encontrado"
}
```

---

## Alter

### GET `/alter`

*Endpoint no implementado (stub).*

#### Response

**200 OK**
```json
{
  "message": "getAlters"
}
```

---

### POST `/alter`

*Endpoint no implementado (stub).*

#### Response

**200 OK**
```json
{
  "message": "postAlters"
}
```

---

### DELETE `/alter/:name`

Elimina un personaje Alter.

#### Request

**URL Params:**
```
name: string (nombre del Alter)
```

#### Response

**200 OK - Éxito**
```json
{
  "message": "Alter NombreAlter eliminado"
}
```

**404 Not Found - Alter no encontrado**
```json
{
  "error": "Alter no encontrado"
}
```

---

## DKPs

### POST `/dkps`

Procesa datos DKP (Dragon Kill Points) desde un archivo XML exportado de QDKP2 (addon de World of Warcraft).

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "body": "<XML_STRING>"
}
```

El `body` debe ser un string conteniendo un XML con el formato QDKP2EXPORT-DKP.

**Formato 1 - Atributos XML (más común en QDKP2):**
```xml
<QDKP2EXPORT-DKP list="guild" time="1777764401" guild="Lunatik" exporter="Drankg">
  <PLAYER name="Maicolmb" class="Hunter" rank="New Moon" net="0" total="0" spent="0" hours="0" />
  <PLAYER name="Jusstgg" class="Priest" rank="New Moon" net="0" total="0" spent="0" hours="0" />
  <PLAYER name="NombreAlter" class="Rogue" rank="Member" main="Maicolmb" net="500" total="700" spent="200" hours="50" />
</QDKP2EXPORT-DKP>
```

**Formato 2 - Elementos hijos:**
```xml
<QDKP2EXPORT-DKP>
  <PLAYER>
    <name>NombrePersonaje</name>
    <class>Warrior</class>
    <rank>Officer</rank>
    <net>1000</net>
    <spent>500</spent>
    <total>1500</total>
    <gearscore>5000</gearscore>
    <hours>100</hours>
  </PLAYER>
  <PLAYER>
    <name>NombreAlter</name>
    <class>Rogue</class>
    <rank>Member</rank>
    <main>NombrePersonaje</main>
    <net>500</net>
    <spent>200</spent>
    <total>700</total>
    <gearscore>4000</gearscore>
    <hours>50</hours>
  </PLAYER>
</QDKP2EXPORT-DKP>
```

Ambos formatos son soportados gracias a `mergeAttrs: true` en el parser xml2js.

#### Response

**200 OK - Éxito**
```json
{
  "message": "Datos procesados correctamente"
}
```

**400 Bad Request - XML inválido**
```json
{
  "error": "XML inválido: falta QDKP2EXPORT-DKP"
}
```
```json
{
  "error": "XML inválido: falta PLAYER"
}
```
```json
{
  "error": "Invalid XML"
}
```

**400 Bad Request - Clase inválida**
```json
{
  "error": "Clase inválida: {nombreClase} en personaje {nombrePersonaje}. Clases válidas: Warlock, Death Knight, Hunter, Shaman, Druid, Warrior, Mage, Paladin, Rogue, Priest"
}
```

**500 Internal Server Error - Error de base de datos**
```json
{
  "error": "Database error"
}
```

#### Notas

- Los personajes sin campo `main` se clasifican como **Mains**
- Los personajes con campo `main` se clasifican como **Alters**
- Al crear/actualizar un personaje Main, se guardan todos los campos: `name`, `class`, `rank`, `net`, `spent`, `total`, `gearscore`, `hours`
- Al crear/actualizar un Alter, se guarda `mainPlayername` referenciando al Main
- Si el `main` de un Alter no existe en la lista de personajes válidos del XML, se asigna `null`
- El sistema de backups se activa automáticamente cuando cambia el día desde la última importación
- Un Main puede convertirse en Alter y viceversa en sucesivas importaciones

#### Modelos de Datos

**Main**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | STRING | Nombre del personaje (PK) |
| class | STRING | Clase del personaje |
| rank | STRING | Rango en el guild |
| net | INTEGER | DKP neto actual |
| spent | INTEGER | DKP gastado |
| total | INTEGER | DKP total |
| gearscore | INTEGER | Puntuación de equipo |
| hours | INTEGER | Horas jugadas |

**Alter**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | STRING | Nombre del personaje (PK) |
| class | STRING | Clase del personaje |
| rank | STRING | Rango en el guild |
| net | INTEGER | DKP neto actual |
| spent | INTEGER | DKP gastado |
| total | INTEGER | DKP total |
| gearscore | INTEGER | Puntuación de equipo |
| hours | INTEGER | Horas jugadas |
| mainPlayername | STRING | FK hacia Main.name |

---

## Login

### POST `/login`

Autenticación de administrador.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "user": "lunatik",
  "password": "Lunatik321"
}
```

#### Response

**200 OK - Éxito**
```json
{
  "response": true
}
```

**401 Unauthorized - Credenciales inválidas**
```json
{
  "error": "Usuario no Encontrado"
}
```

#### Notas

- El usuario y contraseña están hardcodeados en el controlador
- Credenciales válidas: `user: "lunatik"`, `password: "Lunatik321"`

---

## Main

### GET `/main/actual`

Obtiene los personajes Main actuales ordenados por `net` de mayor a menor.

#### Response

**200 OK**
```json
[
  {
    "name": "Maicolmb",
    "class": "Hunter",
    "rank": "New Moon",
    "net": 1000,
    "spent": 500,
    "total": 1500,
    "gearscore": 5000,
    "hours": 100
  }
]
```

---

### GET `/main/first`

Obtiene el primer respaldo (FirstBackUp) de los personajes Main, ordenado por `net` de mayor a menor.

#### Response

**200 OK**
```json
[
  {
    "name": "Maicolmb",
    "class": "Hunter",
    "rank": "New Moon",
    "net": 900,
    "spent": 400,
    "total": 1300,
    "gearscore": 4800,
    "hours": 90
  }
]
```

#### Notas para Frontend

- Este endpoint retorna **solo un array de Main** (sin `alters` ni `date`)
- Esto es intencional: los backups guardan únicamente snapshots de la tabla Main
- Si necesitas la lista completa con Alters y fecha, usa `GET /characters` en su lugar
- El propósito de este endpoint es comparar valores históricos de DKP de los personajes principales

---

### GET `/main/second`

Obtiene el segundo respaldo (SecondBackUp) de los personajes Main, ordenado por `net` de mayor a menor.

#### Response

**200 OK**
```json
[
  {
    "name": "Maicolmb",
    "class": "Hunter",
    "rank": "New Moon",
    "net": 800,
    "spent": 300,
    "total": 1100,
    "gearscore": 4500,
    "hours": 80
  }
]
```

#### Notas para Frontend

- Este endpoint retorna **solo un array de Main** (sin `alters` ni `date`)
- Los backups en cascada (`FirstBackUp` → `SecondBackUp`) permiten consultar hasta 2 días atrás
- Si necesitas la lista completa con Alters y fecha, usa `GET /characters` en su lugar

---

## Monitor

### GET `/monitor`

Endpoint de salud del servidor.

#### Response

**200 OK**
```json
{
  "success": "ok"
}
```

---

## Cron

### GET `/`

Endpoint de salud del servidor (ruta base).

#### Response

**200 OK**
```json
{
  "message": "Home alive"
}
```
