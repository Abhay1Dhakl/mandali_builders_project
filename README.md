# Mandali Builders

Professional full-stack construction company platform for `Mandali Builders`, modeled on the structure and depth of the Turner Construction reference site.

## Stack

- `frontend/`: `Next.js` marketing site and admin interface
- `backend/`: `FastAPI` CMS/API with JWT auth, CRUD endpoints, inquiry handling, and seeded SQLite data
- `shared/demo-data.json`: shared content seed used by both apps

## What is included

- Premium multi-page company website:
  - Home
  - About
  - Services
  - Sectors
  - Projects
  - Project detail
  - Insights
  - Insight detail
  - Contact
- Admin panel:
  - Company profile editing
  - Commitments CRUD
  - Services CRUD
  - Sectors CRUD
  - Projects CRUD
  - Insights CRUD
  - Offices CRUD
  - Inquiry management
- Backend features:
  - JWT login
  - SQLite persistence
  - Seeded construction-company demo content
  - Public API for the website
  - Admin API for content operations

## Seeded admin credentials

- Username: `admin`
- Password: `mandali123`

## Local run

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend URL: `http://127.0.0.1:8000`

### Frontend

Requirements: `node` and `npm`

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://127.0.0.1:3000`

## Docker run

If you prefer not to install local Node/Python dependencies:

```bash
docker compose up --build
```

## API overview

### Public

- `GET /api/public/site`
- `GET /api/public/profile`
- `GET /api/public/services`
- `GET /api/public/sectors`
- `GET /api/public/projects`
- `GET /api/public/projects/{slug}`
- `GET /api/public/insights`
- `GET /api/public/insights/{slug}`
- `GET /api/public/offices`
- `POST /api/public/contact`

### Admin

- `POST /api/admin/auth/login`
- `GET /api/admin/dashboard`
- `GET/PUT /api/admin/profile`
- CRUD on:
  - `/api/admin/commitments`
  - `/api/admin/services`
  - `/api/admin/sectors`
  - `/api/admin/projects`
  - `/api/admin/insights`
  - `/api/admin/offices`
  - `/api/admin/inquiries`

## Verification completed here

- Backend import validation passed with `./.venv/bin/python -c "import app.main"`
- Backend smoke tests passed for:
  - `GET /health`
  - `GET /api/public/site`
  - `POST /api/admin/auth/login`
  - `GET /api/admin/dashboard`
  - `POST /api/public/contact`
  - `PUT /api/admin/inquiries/{id}`
- JSON seed validation passed

## Verification not completed here

- Frontend runtime build could not be executed in this environment because `node`/`npm` are not installed
- Backend dependency installation was blocked by sandbox network restrictions
