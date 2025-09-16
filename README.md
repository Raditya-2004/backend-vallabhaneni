SVI Backend (Express + PostgreSQL + Sequelize)

Setup

1) Create an .env file in server/ with:

PORT=4000
CORS_ORIGIN=http://localhost:5173
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=svi_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
SQL_LOG=false
DB_ALTER=true
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
MAIL_FROM=no-reply@yourdomain.com
MAIL_TO_ADMIN=admin@yourdomain.com
MAIL_SEND_USER=true
ADMIN_TOKEN=your-strong-random-token

2) Install dependencies:

npm install

3) Run in dev:

npm run dev

Endpoints

- GET /health → checks API and DB connectivity
- POST /api/contact → save contact form message
  - Sends email notification to admin; optional confirmation to user if MAIL_SEND_USER=true

Admin endpoint:

- GET /api/contact (admin only) → list messages with pagination
  - Headers: Authorization: Bearer YOUR_ADMIN_TOKEN
  - Query: page, pageSize

Payload example:

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 99999 99999",
  "message": "I need a quote for hydraulic cylinder repair."
}

Response:

{ "id": 1 }

Notes

- Sequelize sync() creates tables in development. For production, use migrations and SSL as needed.

Auto-create database

- On startup, the server connects to the maintenance DB (default `postgres`) and creates `POSTGRES_DB` if missing.
- Override maintenance DB with `POSTGRES_MAINTENANCE_DB` in .env if needed.

Admin access

- Set ADMIN_TOKEN in .env (a random strong token)
- Example curl:

curl -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:4000/api/contact?page=1&pageSize=20


