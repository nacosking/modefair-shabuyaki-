export const menuCategories = [
  {
    id: 'sashimi',
    name: 'Sashimi',
    nameJP: '刺身',
    description: 'Ocean-fresh cuts, served with wasabi and pickled ginger',
    station: 'kitchen',
    items: [
      { id: 'm01', name: 'Otoro Tuna', nameJP: '大トロ', price: 48, description: 'Fatty blue-fin belly, lightly cured with sea salt and yuzu zest', station: 'kitchen' },
      { id: 'm02', name: 'King Salmon', nameJP: '鮭', price: 36, description: 'Hokkaido salmon, aged 48 hours for deeper umami depth', station: 'kitchen' },
      { id: 'm03', name: 'Live Scallop', nameJP: '帆立', price: 42, description: 'Same-day harvest, served in shell with ponzu and micro shiso', station: 'kitchen' },
      { id: 'm04', name: 'Hamachi Yellowtail', nameJP: '鰤', price: 38, description: 'Amberjack belly with jalapeño, truffle oil and momiji oroshi', station: 'kitchen' },
    ]
  },
  {
    id: 'yakimono',
    name: 'Yakimono',
    nameJP: '焼き物',
    description: 'Charcoal-grilled over binchōtan white oak',
    station: 'kitchen',
    items: [
      { id: 'm05', name: 'A5 Wagyu Striploin', nameJP: 'A5和牛', price: 98, description: 'Kagoshima prefecture, BMS 11+, sliced tableside with tare glaze', station: 'kitchen' },
      { id: 'm06', name: 'Miso Black Cod', nameJP: '銀鱈西京焼き', price: 56, description: 'Saikyo miso-marinated for three days, caramelised over high heat', station: 'kitchen' },
      { id: 'm07', name: 'Robata Chicken', nameJP: '地鶏炭火焼き', price: 44, description: 'Free-range Jidori thigh, basted with shio koji and citrus', station: 'kitchen' },
      { id: 'm08', name: 'Eggplant Dengaku', nameJP: '茄子田楽', price: 28, description: 'Nasu eggplant, white miso glaze, toasted sesame, scallion', station: 'kitchen' },
    ]
  },
  {
    id: 'nimono',
    name: 'Nimono & Rice',
    nameJP: '煮物・ご飯',
    description: 'Slow-simmered broths and hand-crafted rice dishes',
    station: 'kitchen',
    items: [
      { id: 'm09', name: 'Wagyu Shabu Broth', nameJP: '和牛しゃぶ', price: 62, description: 'Paper-thin wagyu in dashi-kombu broth with seasonal mushrooms', station: 'kitchen' },
      { id: 'm10', name: 'Uni Ikura Don', nameJP: '雲丹いくら丼', price: 72, description: 'Bafun sea urchin and ikura over warm Koshihikari rice', station: 'kitchen' },
      { id: 'm11', name: 'Kani Chawanmushi', nameJP: '蟹茶碗蒸し', price: 32, description: 'Silken egg custard with snow crab, ginkgo and yuzu foam', station: 'kitchen' },
    ]
  },
  {
    id: 'drinks',
    name: 'Drinks',
    nameJP: '飲み物',
    description: 'Japanese spirits, sake, and seasonal beverages',
    station: 'bar',
    items: [
      { id: 'm12', name: 'Junmai Daiginjo Sake', nameJP: '純米大吟醸', price: 22, description: 'Dassai 23, floral and delicate — served chilled', station: 'bar' },
      { id: 'm13', name: 'Nikka Whisky Highball', nameJP: 'ハイボール', price: 18, description: 'Nikka From the Barrel, Beppu mineral water, crystal ice', station: 'bar' },
      { id: 'm14', name: 'Yuzu Gin Sour', nameJP: 'ゆず ジンサワー', price: 20, description: 'Roku gin, fresh yuzu, shiso, egg white and pickled ginger brine', station: 'bar' },
      { id: 'm15', name: 'Hojicha Latte', nameJP: '焙じ茶ラテ', price: 10, description: 'Roasted green tea, oat milk, a whisper of raw honey', station: 'bar' },
      { id: 'm16', name: 'Sparkling Yuzu-ade', nameJP: 'ゆずソーダ', price: 8, description: 'Fresh yuzu, cane sugar, Perrier — light and palate-cleansing', station: 'bar' },
    ]
  },
  {
    id: 'desserts',
    name: 'Desserts',
    nameJP: '甘味',
    description: 'Delicate sweets to close the evening',
    station: 'kitchen',
    items: [
      { id: 'm17', name: 'Matcha Soufflé', nameJP: '抹茶スフレ', price: 24, description: 'Ceremonial grade matcha, served with vanilla bean crème anglaise', station: 'kitchen' },
      { id: 'm18', name: 'Kuromitsu Panna Cotta', nameJP: '黒蜜パンナコッタ', price: 18, description: 'Black sugar syrup, kinako powder, toasted walnut', station: 'kitchen' },
      { id: 'm19', name: 'Mochi Trio', nameJP: '餅三種', price: 20, description: 'Seasonal selection — ask your server for today\'s flavours', station: 'kitchen' },
    ]
  }
];

export const allItems = menuCategories.flatMap(c => c.items);

export const DISCOUNTS = [
  { code: 'WELCOME10', label: '10% Welcome', type: 'percent', value: 10 },
  { code: 'OMAKASE20', label: '20% Omakase', type: 'percent', value: 20 },
  { code: 'FLAT15',    label: 'RM15 Off',    type: 'flat',    value: 15 },
];

export const RESTAURANT_INFO = {
  name: 'Shabuyaki',
  tagline: '侘び寂び — Wabi-Sabi',
  address: 'Level 23, Menara KL Tower, Bukit Nanas, 50250 Kuala Lumpur',
  phone: '+60 3-2181 0000',
  hours: 'Tuesday – Sunday  18:00 – 23:00',
};
