# MenoVerse AI

MenoVerse AI is a React single-page application for menopause education and
wellness tracking. The frontend uses Vite, React Router, Tailwind CSS, and
Axios; user and health records are served by the FastAPI backend.

## Requirements

- Node.js and npm versions supported by the Vite version in `package-lock.json`.
- A Python version supported by the pinned packages in
  `backend/requirements.txt` (the backend uses Python 3.10+ syntax).
- Microsoft SQL Server with an existing `HealthMonitorDB` database.
- Microsoft ODBC Driver 17 for SQL Server and a Windows account that can
  connect to the database using integrated authentication.

The backend's SQL Server connection strings are currently defined in
`backend/database.py`; they are not configured through an environment variable.
The backend tries the local default instance and common `SQLEXPRESS`/localhost
instances using Windows trusted authentication.

## Configure the backend

From the repository root, create and activate a virtual environment and install
the pinned dependencies:

```powershell
py -m venv backend\venv
.\backend\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r backend\requirements.txt
```

Copy `backend/.env.example` to `backend/.env`. Set `JWT_SECRET_KEY` to a
unique secret of at least 32 characters. Keep this file private and do not
commit real credentials.

Registration and login can run without SMTP credentials. Password-reset email
requires the SMTP settings (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`,
`SMTP_PASSWORD`, `SMTP_FROM_EMAIL`, and `SMTP_USE_SSL`) and `FRONTEND_URL` to
be configured. The example file uses `http://localhost:5173` for local
development.

The database `HealthMonitorDB` must already exist and be accessible to the
Windows account running the API. On startup, the backend creates tables from
its SQLAlchemy models, seeds default community groups and diet/recipe content,
and runs a few compatibility checks for existing columns. The API does not
create the SQL Server database itself.

## Configure and run the frontend

From the repository root:

```powershell
cd frontend
npm ci
```

The Axios client defaults to `http://127.0.0.1:8000`. To use another backend
URL, create `frontend/.env.local` with:

```dotenv
VITE_API_URL=http://127.0.0.1:8000
```

Start the API in a separate terminal from the repository root:

```powershell
.\backend\venv\Scripts\Activate.ps1
Set-Location backend
python -m uvicorn main:app --reload
```

Then start the frontend from another terminal:

```powershell
Set-Location frontend
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). The backend
currently allows local development origins on ports 5173 and 5174; update its
CORS configuration before serving the frontend from another origin.

## Useful commands

Run these from the `frontend` directory:

```powershell
npm run lint
npm run build
npm run preview
```

The production build is written to `frontend/dist/`. For backend API routes,
request and response details, password-reset setup, and the assessment's
limitations, see [`backend/API_DOCS.md`](../backend/API_DOCS.md).

## Assessment model files

The assessment endpoint expects `backend/menopause_risk_model.pkl` and the
training workbook at `dataset/menopause_synthetic_500_age45-49_v4.xlsx`.
Retrain the model from the `backend` directory with the environment's Python:

```powershell
python trainmodel.py
```

The prediction is a stage-derived proxy category, not a clinical diagnosis or
validated medical risk score. See the backend API documentation for details.
