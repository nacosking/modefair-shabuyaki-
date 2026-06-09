-- ─────────────────────────────────────────────────────────────────────────────
-- V2__seed_data.sql
-- Shabuyaki — Initial seed data (admin user + categories + menu items + tables)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Admin user ────────────────────────────────────────────────────────────────
-- Password: shabuyaki2024  (bcrypt strength 12)
INSERT INTO admin_users (username, password_hash) VALUES
('admin', '$2a$12$XNqJbMJFqZtVqHrM3N8W8.LkCy5gCvGqHvEpYJ5EoUKXm7bWz1nQC');

-- ── Tables (20 restaurant tables) ─────────────────────────────────────────────
INSERT INTO `tables` (table_number, status) VALUES
(1,  'open'),
(2,  'dirty'),
(3,  'occupied'),
(4,  'open'),
(5,  'occupied'),
(6,  'open'),
(7,  'dirty'),
(8,  'occupied'),
(9,  'dirty'),
(10, 'open'),
(11, 'open'),
(12, 'occupied'),
(13, 'open'),
(14, 'dirty'),
(15, 'open'),
(16, 'open'),
(17, 'occupied'),
(18, 'open'),
(19, 'open'),
(20, 'open');

-- ── Categories ────────────────────────────────────────────────────────────────
INSERT INTO categories (name, name_jp, display_order) VALUES
('Sashimi',        '刺身',     1),
('Yakimono',       '焼き物',   2),
('Nimono & Rice',  '煮物・ご飯', 3),
('Drinks',         '飲み物',   4),
('Desserts',       '甘味',     5);

-- ── Menu Items ────────────────────────────────────────────────────────────────
-- Sashimi (category_id = 1)
INSERT INTO menu_items (category_id, name, name_jp, description, price, routing_station) VALUES
(1, 'Otoro Tuna',       '大トロ',  'Fatty blue-fin belly, lightly cured with sea salt and yuzu zest',                48.00, 'kitchen'),
(1, 'King Salmon',      '鮭',      'Hokkaido salmon, aged 48 hours for deeper umami depth',                          36.00, 'kitchen'),
(1, 'Live Scallop',     '帆立',    'Same-day harvest, served in shell with ponzu and micro shiso',                   42.00, 'kitchen'),
(1, 'Hamachi Yellowtail','鰤',     'Amberjack belly with jalapeño, truffle oil and momiji oroshi',                   38.00, 'kitchen');

-- Yakimono (category_id = 2)
INSERT INTO menu_items (category_id, name, name_jp, description, price, routing_station) VALUES
(2, 'A5 Wagyu Striploin',  'A5和牛',        'Kagoshima prefecture, BMS 11+, sliced tableside with tare glaze',      98.00, 'kitchen'),
(2, 'Miso Black Cod',       '銀鱈西京焼き', 'Saikyo miso-marinated for three days, caramelised over high heat',     56.00, 'kitchen'),
(2, 'Robata Chicken',       '地鶏炭火焼き', 'Free-range Jidori thigh, basted with shio koji and citrus',            44.00, 'kitchen'),
(2, 'Eggplant Dengaku',     '茄子田楽',     'Nasu eggplant, white miso glaze, toasted sesame, scallion',            28.00, 'kitchen');

-- Nimono & Rice (category_id = 3)
INSERT INTO menu_items (category_id, name, name_jp, description, price, routing_station) VALUES
(3, 'Wagyu Shabu Broth',  '和牛しゃぶ',    'Paper-thin wagyu in dashi-kombu broth with seasonal mushrooms',         62.00, 'kitchen'),
(3, 'Uni Ikura Don',      '雲丹いくら丼',  'Bafun sea urchin and ikura over warm Koshihikari rice',                 72.00, 'kitchen'),
(3, 'Kani Chawanmushi',   '蟹茶碗蒸し',   'Silken egg custard with snow crab, ginkgo and yuzu foam',               32.00, 'kitchen');

-- Drinks (category_id = 4)
INSERT INTO menu_items (category_id, name, name_jp, description, price, routing_station) VALUES
(4, 'Junmai Daiginjo Sake',  '純米大吟醸',     'Dassai 23, floral and delicate — served chilled',                   22.00, 'bar'),
(4, 'Nikka Whisky Highball', 'ハイボール',     'Nikka From the Barrel, Beppu mineral water, crystal ice',           18.00, 'bar'),
(4, 'Yuzu Gin Sour',         'ゆず ジンサワー', 'Roku gin, fresh yuzu, shiso, egg white and pickled ginger brine',   20.00, 'bar'),
(4, 'Hojicha Latte',         '焙じ茶ラテ',     'Roasted green tea, oat milk, a whisper of raw honey',               10.00, 'bar'),
(4, 'Sparkling Yuzu-ade',    'ゆずソーダ',     'Fresh yuzu, cane sugar, Perrier — light and palate-cleansing',       8.00, 'bar');

-- Desserts (category_id = 5)
INSERT INTO menu_items (category_id, name, name_jp, description, price, routing_station) VALUES
(5, 'Matcha Soufflé',         '抹茶スフレ',            'Ceremonial grade matcha, served with vanilla bean crème anglaise', 24.00, 'kitchen'),
(5, 'Kuromitsu Panna Cotta',  '黒蜜パンナコッタ',      'Black sugar syrup, kinako powder, toasted walnut',                18.00, 'kitchen'),
(5, 'Mochi Trio',             '餅三種',                'Seasonal selection — ask your server for today''s flavours',       20.00, 'kitchen');
