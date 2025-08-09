# CloudVault

A modern file management application Create a Dropzone Space where users can upload  files and show the upload progress for each file.

## Prerequisites

- Java 8+
- Node.js 24+
- PostgreSQL 14+ (or Docker)

## Setup & Run

### 1. Setup Database

**Option A: Local PostgreSQL**
```bash
brew services start postgresql@14
psql postgres -c "CREATE DATABASE dropbox_db;"
psql postgres -c "CREATE USER dropbox_user WITH PASSWORD 'dropbox_password';"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE dropbox_db TO dropbox_user;"
```

**Option B: Docker**
```bash
docker-compose up -d postgres
```

### 2. Start Backend
```bash
./mvnw spring-boot:run
```
Backend runs at `http://localhost:8080`

### 3. Start Frontend
```bash
cd react-frontend
npm install --legacy-peer-deps
npm start
```
Frontend runs at `http://localhost:3000`

