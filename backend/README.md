# Shabuyaki Backend — Setup Guide

## Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.x

---

## 1. MySQL Setup

```sql
-- Run as MySQL root user
CREATE DATABASE shabuyaki_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'shabuyaki_user'@'localhost' IDENTIFIED BY 'shabuyaki_pass';
GRANT ALL PRIVILEGES ON shabuyaki_db.* TO 'shabuyaki_user'@'localhost';
FLUSH PRIVILEGES;
```

Flyway will automatically run the migrations in `src/main/resources/db/migration/`:
- `V1__create_schema.sql` — creates all 7 tables
- `V2__seed_data.sql` — seeds categories, menu items, 20 tables, and the admin user

---

## 2. Configuration

Edit `src/main/resources/application.properties`:

```properties
# Update these for your environment:
spring.datasource.url=jdbc:mysql://localhost:3306/shabuyaki_db?useSSL=false&serverTimezone=Asia/Kuala_Lumpur
spring.datasource.username=shabuyaki_user
spring.datasource.password=shabuyaki_pass

# IMPORTANT: Replace with a secure 256-bit base64 key in production
app.jwt.secret=c2hhYnV5YWtpLXN1cGVyLXNlY3JldC1rZXktZm9yLWp3dC0yMDI0LW11c3QtYmUtbG9uZy1lbm91Z2g=

# Set to true when running on HTTPS in production
app.cookie.secure=false

# Comma-separated list of allowed frontend origins
app.cors.allowed-origins=http://localhost:3000
```

---

## 3. Build & Run

```bash
cd shabuyaki-backend

# Build
mvn clean package -DskipTests

# Run
mvn spring-boot:run
# OR
java -jar target/shabuyaki-backend-1.0.0.jar
```

Server starts on **http://localhost:8080**

---

## 4. Admin Credentials (from seed data)

| Username | Password        |
|----------|-----------------|
| admin    | shabuyaki2024   |

To generate a new bcrypt hash:
```java
// BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
// System.out.println(encoder.encode("yourpassword"));
```

---

## 5. API Quick Reference

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Active menu grouped by category |
| POST | `/api/orders/checkout` | Place order, returns receipt |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Get JWT + refresh cookie |
| POST | `/api/auth/refresh` | Rotate tokens |
| POST | `/api/auth/logout` | Invalidate tokens |

### Admin (requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/menu` | All menu items |
| POST | `/api/admin/menu` | Create item |
| PUT | `/api/admin/menu/{id}` | Update item |
| DELETE | `/api/admin/menu/{id}` | Soft delete |
| PUT | `/api/admin/menu/{id}/restore` | Re-activate |
| GET | `/api/admin/categories` | All categories |
| POST | `/api/admin/categories` | Create category |
| PUT | `/api/admin/categories/{id}` | Update/reorder |
| GET | `/api/admin/tables` | All tables |
| PUT | `/api/admin/tables/{id}/status` | Update status |
| GET | `/api/admin/orders/table/{tableId}` | Active order for table |
| GET | `/api/admin/orders/{id}` | Order by ID |
| PUT | `/api/admin/orders/{id}/status` | Mark paid/voided |
| PUT | `/api/admin/order-items/{id}/prep-status` | Advance prep status |
| POST | `/api/admin/orders/{id}/split` | Split check |

### Checkout Request Example
```json
POST /api/orders/checkout
{
  "tableNumber": 5,
  "items": [
    { "menuItemId": 1, "quantity": 2 },
    { "menuItemId": 12, "quantity": 1 }
  ],
  "discountCode": "WELCOME10"
}
```

### Login Request Example
```json
POST /api/auth/login
{ "username": "admin", "password": "shabuyaki2024" }
```

---

## 6. WebSocket (STOMP over SockJS)

Connect your React admin to: `http://localhost:8080/ws`

| Topic | Event | When triggered |
|-------|-------|----------------|
| `/topic/tables` | Table status update | Any table status change |
| `/topic/kitchen` | New kitchen ticket | Customer checkout with food items |
| `/topic/bar` | New bar ticket | Customer checkout with drinks |
| `/topic/prep-status` | Item prep status update | Staff advances item status |

**React example:**
```javascript
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const client = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
  onConnect: () => {
    client.subscribe('/topic/tables', (msg) => {
      const table = JSON.parse(msg.body);
      // Update table grid state
    });
    client.subscribe('/topic/kitchen', (msg) => {
      const ticket = JSON.parse(msg.body);
      // Show new ticket on kitchen screen
    });
  }
});
client.activate();
```

---

## 7. Project Structure

```
src/main/java/com/shabuyaki/
├── ShabuyakiApplication.java
├── config/
│   ├── JpaConfig.java              — JPA auditing
│   ├── RestaurantProperties.java   — App config bean
│   ├── SecurityConfig.java         — Spring Security + CORS
│   └── WebSocketConfig.java        — STOMP/WebSocket
├── controller/
│   ├── AuthController.java         — /api/auth/*
│   ├── PublicMenuController.java   — /api/menu
│   ├── CheckoutController.java     — /api/orders/checkout
│   ├── AdminMenuController.java    — /api/admin/menu, categories
│   ├── AdminTableController.java   — /api/admin/tables
│   └── AdminOrderController.java   — /api/admin/orders, order-items
├── service/
│   ├── AuthService.java            — Login, JWT, refresh tokens
│   ├── MenuService.java            — Menu CRUD, soft delete
│   ├── TableService.java           — Table management + WebSocket
│   └── OrderService.java           — Checkout, routing, split check
├── repository/                     — Spring Data JPA interfaces
├── entity/                         — JPA entities (all with timestamps)
├── dto/
│   ├── request/                    — Validated request bodies
│   └── response/                   — API response shapes
├── security/
│   ├── JwtTokenProvider.java       — JWT generation + validation
│   └── JwtAuthenticationFilter.java— Spring Security filter
├── websocket/
│   └── WebSocketEventPublisher.java— STOMP broadcast helpers
└── exception/
    ├── GlobalExceptionHandler.java — Unified error responses
    └── *Exception.java             — Custom exception types
```
