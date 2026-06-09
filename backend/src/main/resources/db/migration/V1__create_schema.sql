-- ─────────────────────────────────────────────────────────────────────────────
-- V1__create_schema.sql
-- Shabuyaki — Full database schema
-- ─────────────────────────────────────────────────────────────────────────────

SET NAMES utf8mb4;
SET time_zone = '+08:00';

-- ── admin_users ───────────────────────────────────────────────────────────────
CREATE TABLE admin_users (
    id            BIGINT          NOT NULL AUTO_INCREMENT,
    username      VARCHAR(50)     NOT NULL,
    password_hash VARCHAR(255)    NOT NULL,
    created_at    DATETIME(6)     NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at    DATETIME(6)     NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_admin_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── refresh_tokens ────────────────────────────────────────────────────────────
CREATE TABLE refresh_tokens (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    admin_user_id   BIGINT       NOT NULL,
    token_hash      VARCHAR(255) NOT NULL,
    expires_at      DATETIME(6)  NOT NULL,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_refresh_token_hash (token_hash),
    CONSTRAINT fk_refresh_token_user
        FOREIGN KEY (admin_user_id) REFERENCES admin_users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── categories ────────────────────────────────────────────────────────────────
CREATE TABLE categories (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    name          VARCHAR(100) NOT NULL,
    name_jp       VARCHAR(100) NOT NULL,
    display_order INT          NOT NULL DEFAULT 0,
    created_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── menu_items ────────────────────────────────────────────────────────────────
CREATE TABLE menu_items (
    id               BIGINT         NOT NULL AUTO_INCREMENT,
    category_id      BIGINT         NOT NULL,
    name             VARCHAR(150)   NOT NULL,
    name_jp          VARCHAR(150)   NOT NULL,
    description      TEXT,
    price            DECIMAL(10, 2) NOT NULL,
    routing_station  ENUM('kitchen','bar') NOT NULL DEFAULT 'kitchen',
    is_active        TINYINT(1)     NOT NULL DEFAULT 1,
    created_at       DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at       DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_menu_item_category
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── tables ────────────────────────────────────────────────────────────────────
CREATE TABLE `tables` (
    id           BIGINT      NOT NULL AUTO_INCREMENT,
    table_number INT         NOT NULL,
    status       ENUM('open','occupied','dirty') NOT NULL DEFAULT 'open',
    created_at   DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at   DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_table_number (table_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── orders ────────────────────────────────────────────────────────────────────
CREATE TABLE orders (
    id              BIGINT         NOT NULL AUTO_INCREMENT,
    table_id        BIGINT         NOT NULL,
    receipt_number  VARCHAR(30)    NOT NULL,
    status          ENUM('open','paid','voided') NOT NULL DEFAULT 'open',
    discount_code   VARCHAR(50),
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    subtotal        DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_amount    DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at      DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_receipt_number (receipt_number),
    CONSTRAINT fk_order_table
        FOREIGN KEY (table_id) REFERENCES `tables` (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── order_items ───────────────────────────────────────────────────────────────
CREATE TABLE order_items (
    id                      BIGINT         NOT NULL AUTO_INCREMENT,
    order_id                BIGINT         NOT NULL,
    menu_item_id            BIGINT         NOT NULL,
    quantity                INT            NOT NULL DEFAULT 1,
    price_at_time_of_order  DECIMAL(10, 2) NOT NULL,
    prep_status             ENUM('pending','preparing','served') NOT NULL DEFAULT 'pending',
    created_at              DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at              DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_order_item_order
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_order_item_menu_item
        FOREIGN KEY (menu_item_id) REFERENCES menu_items (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Indexes for query performance ─────────────────────────────────────────────
CREATE INDEX idx_order_items_order_id   ON order_items (order_id);
CREATE INDEX idx_order_items_prep_status ON order_items (prep_status);
CREATE INDEX idx_orders_table_status    ON orders (table_id, status);
CREATE INDEX idx_orders_receipt         ON orders (receipt_number);
CREATE INDEX idx_orders_created_at      ON orders (created_at);
CREATE INDEX idx_menu_items_active      ON menu_items (is_active);
CREATE INDEX idx_menu_items_category    ON menu_items (category_id);
CREATE INDEX idx_refresh_token_expiry   ON refresh_tokens (expires_at);
