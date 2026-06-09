# Modefair / Shabuyaki Setup Guide

This repository contains two apps that work together:

- `backend/` - Spring Boot API, WebSocket server, Flyway migrations, and MySQL access
- `frontend/` - React customer/admin UI

## Prerequisites

Install these before running the project:

- Java 17 or newer
- Maven 3.8+
- Node.js 18+ with npm
- MySQL 8.x

## Project Structure

- `backend/` - Spring Boot application
- `backend/src/main/resources/db/migration/` - database schema and seed data
- `frontend/` - React app created with Create React App
- `frontend/.env` - local frontend API and WebSocket URLs

## 1) Backend Setup

### 1.1 Create the database

Create a MySQL database and user for the app:

```sql
CREATE DATABASE shabuyaki_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'shabuyaki_user'@'localhost' IDENTIFIED BY 'shabuyaki_pass';
GRANT ALL PRIVILEGES ON shabuyaki_db.* TO 'shabuyaki_user'@'localhost';
FLUSH PRIVILEGES;
```

### 1.2 Configure the backend

Update `backend/src/main/resources/application.properties` if your local database, ports, or origin differ from the defaults.

Default local values used by the project:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/shabuyaki_db?useSSL=false&serverTimezone=Asia/Kuala_Lumpur&allowPublicKeyRetrieval=true&characterEncoding=UTF-8
spring.datasource.username=shabuyaki_user
spring.datasource.password=shabuyaki_pass

app.jwt.secret=c2hhYnV5YWtpLXN1cGVyLXNlY3JldC1rZXktZm9yLWp3dC0yMDI0LW11c3QtYmUtbG9uZy1lbm91Z2g=
app.cookie.secure=false
app.cors.allowed-origins=http://localhost:3000,http://localhost:3001
```

Flyway runs automatically on startup and applies:

- `V1__create_schema.sql` - creates the tables
- `V2__seed_data.sql` - seeds categories, menu items, tables, and the admin user

### 1.3 Install and run the backend

From the `backend/` folder:

```bash
mvn clean package -DskipTests
mvn spring-boot:run
```

The API starts on `http://localhost:8080`.

If you prefer the packaged jar, run:

```bash
java -jar target/shabuyaki-backend-1.0.0.jar
```

## 2) Frontend Setup

### 2.1 Configure the frontend

The frontend already uses local defaults in `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=http://localhost:8080/ws
```

Change these only if you move the backend to another host or port.

### 2.2 Install and run the frontend

From the `frontend/` folder:

```bash
npm install
npm start
```

The app opens on `http://localhost:3000`.

## 3) Run Order

1. Start MySQL.
2. Start the backend in `backend/`.
3. Start the frontend in `frontend/`.
4. Open the browser at `http://localhost:3000`.

## 4) Login and Seeded Data

The database seed data creates an admin account:

| Username | Password |
| --- | --- |
| admin | shabuyaki2024 |

If you change the seed data or password hashing strategy, update the frontend/admin login instructions accordingly.

## 5) Main URLs

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- WebSocket endpoint: `http://localhost:8080/ws`

## 6) Troubleshooting

- If the frontend cannot reach the API, confirm `REACT_APP_API_URL` matches the backend URL.
- If login or refresh fails, check that `app.jwt.secret` is set and that cookies are allowed in your browser.
- If CORS errors appear, make sure `app.cors.allowed-origins` includes your frontend origin.
- If the database schema is missing, verify MySQL is running and that the `shabuyaki_db` database exists.

## 7) Useful References

- Backend-specific notes: `backend/README.md`
- Backend configuration: `backend/src/main/resources/application.properties`
- Frontend API client: `frontend/src/api/apiClient.js`
- Frontend environment file: `frontend/.env`