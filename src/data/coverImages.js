// Unsplash cover photos for each theme
// Format: photo-{ID}?auto=format&fit=crop&w=600&q=75

const U = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=75`;

export const COVER_IMAGES = {
  // ── 台北 ──
  'taipei-night':     U('1489824823529-4f8f57b72f3e'), // Taipei night skyline
  'taipei-oasis':     U('1441974231531-c6227db76b6e'), // forest park path
  'taipei-korean':    U('1617196034183-421b4040ed20'), // Korean BBQ food
  'taipei-hk':        U('1558618666-fcd25c85cd64'),   // retro vintage cafe
  'taipei-ai-food':   U('1504674900247-0877df9cc836'), // gourmet food flatlay
  'taipei-anime':     U('1578632767115-351597cf2a0c'), // neon anime arcade
  'taipei-instagram': U('1567521464027-f127ff144326'), // pretty pastel cafe
  'taipei-indie':     U('1481627834876-b7833e8f5570'), // cozy bookstore coffee
  'taipei-hiking':    U('1464822759023-fed622ff2c3b'), // mountain trail green
  'taipei-shopping':  U('1441986300917-64674bd600d8'), // shopping mall interior

  // ── 台南 ──
  'tainan-ancient':   U('1524413840807-0c3cb6fa808d'), // ancient temple
  'tainan-midnight':  U('1569050467447-ce54b3bbc37d'), // night market lanterns
  'tainan-oldshop':   U('1563245372-f21724e3856d'),   // taiwanese street food
  'tainan-sweet':     U('1563805042-7684c019e1cb'),   // colorful desserts
  'tainan-michelin':  U('1414235077428-338989a2e8c0'), // fine dining plate
  'tainan-amazon':    U('1500917835512-f89a5ff2a8e4'), // green mangrove tunnel
  'tainan-temple':    U('1545987796-200677ee1011'),   // dramatic Chinese temple
  'tainan-oldhouse':  U('1590253230532-a67f6bc61b2e'), // Japanese wooden house
  'tainan-instagram': U('1508193638397-1c4234db14d8'), // colorful street wall
  'tainan-indie':     U('1485546912-c1f02a9dc52a'),   // indie bookstore shelves

  // ── 花蓮 ──
  'hualien-canyon':   U('1533130061792-64b345e4a6ad'), // canyon gorge cliffs
  'hualien-tribe':    U('1565106430740-6a52a3df28aa'), // tribal cultural crafts
  'hualien-sea':      U('1507525428034-b723cf961d3e'), // Pacific beach sunrise
  'hualien-bike':     U('1558618047-3c8c76ca7d13'),   // scenic cycling road
  'hualien-kengo':    U('1487088678257-3a541e6e3922'), // modern architecture
  'hualien-family':   U('1533473359331-0135ef1b58bf'), // children on green farm
  'hualien-local':    U('1563245372-f21724e3856d'),   // local taiwanese food
  'hualien-hiking':   U('1551632811-561732d1e306'),   // waterfall lush trail
  'hualien-instagram':U('1507525428034-b723cf961d3e'), // sky mirror reflection
  'hualien-indie':    U('1481627834876-b7833e8f5570'), // bookstore cafe cozy
};
