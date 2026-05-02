# Project Context: grimreaper-back

`grimreaper-back` is a RESTful API built with Node.js and Express to manage characters and DKP (Dragon Kill Points) for a World of Warcraft guild on the Warmane private server. It handles character tracking and DKP updates from XML imports with backup mechanisms.

## Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 4.19.2
- **Database**: PostgreSQL with Sequelize ORM
- **Parsing**: xml2js (for DKP XML files)
- **Security**: bcrypt (for admin authentication)

## Project Architecture
The project follows a layered architecture:
- `src/routes/`: Express route definitions.
- `src/controllers/`: Route handlers and business logic.
- `src/models/`: Sequelize models for database tables.
- `src/helpers/`: Utility and helper functions.
- `src/config/`: Configuration for the Express server (`app.js`) and Sequelize connection (`db.js`).

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- PostgreSQL database

### Installation
```bash
npm install
```

### Configuration
Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
LOCAL=true # Set to false for production database
PORT_DB=localhost:5432
USER_DB=your_db_user
PASS_DB=your_db_password
NAME_DB=your_db_name
URL_DB=your_production_db_url

# Server Configuration
PORT_HTTP=3001
```

### Running the Project
- **Development**: `npm run dev` (uses `nodemon`)
- **Production**: `npm start`

## Development Conventions

### Coding Style
- This project follows the **JavaScript Standard Style**.
- **ES Modules**: Use `import`/`export` syntax (ensure `.js` extension is included in imports).
- **Asynchronous Code**: Prefer `async`/`await` for database operations.

### Database Patterns
- **Syncing**: The database is synced on server start using `DATA_BASE.sync({ force: false })` in `index.js`.
- **Models**: Defined in `src/models/` using Sequelize.
- **Relationships**: Character relationships (Main/Alter) and DKP backups are managed through separate models (`FirstBackUp`, `SecondBackUp`).

### Error Handling
- Use the central error-handling middleware in `src/config/app.js`. Controllers should pass errors to `next(error)`.
