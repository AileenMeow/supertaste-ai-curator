/**
 * 預先生成所有 30 個主題的行程 JSON
 * 執行方式：node scripts/pregenerate.mjs
 * 輸出位置：public/data/itineraries/{themeId}.json
 *
 * 需要在 .env.local 設定 VITE_ANTHROPIC_API_KEY
 */

import Anthropic from '@anthropic-ai/sdk';
import * as XLSX from 'xlsx';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// 載入環境變數
config({ path: join(root, '.env.local') });

const apiKey = process.env.VITE_ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('❌ 請在 .env.local 設定 VITE_ANTHROPIC_API_KEY');
  process.exit(1);
}

const client = new Anthropic({ apiKey });

// ── 讀取 Excel ──────────────────────────────────────────────
const excelPath = join(root, 'public/data/3個縣市-10主題_完整版.xlsx');
const wb = XLSX.readFile(excelPath);
const allRows = XLSX.utils.sheet_to_json(wb.Sheets['食尚玩家資料列表']);

// ── 主題對應表 ───────────────────────────────────────────────
const THEME_EXCEL_MAP = {
  'taipei-night':      { city: '台北市', theme: '不夜城' },
  'taipei-oasis':      { city: '台北市', theme: '都市綠洲' },
  'taipei-korean':     { city: '台北市', theme: '明星潮流' },
  'taipei-hk':         { city: '台北市', theme: '港星記憶' },
  'taipei-ai-food':    { city: '台北市', theme: 'AI教父美食地圖' },
  'taipei-anime':      { city: '台北市', theme: '動漫聖地' },
  'taipei-instagram':  { city: '台北市', theme: '網美打卡' },
  'taipei-indie':      { city: '台北市', theme: '文青之旅' },
  'taipei-hiking':     { city: '台北市', theme: '步道健行' },
  'taipei-shopping':   { city: '台北市', theme: '購物血拼' },
  'tainan-ancient':    { city: '台南市', theme: '古都巡禮' },
  'tainan-midnight':   { city: '台南市', theme: '凌晨美食' },
  'tainan-oldshop':    { city: '台南市', theme: '百年老店' },
  'tainan-sweet':      { city: '台南市', theme: '螞蟻人的台南' },
  'tainan-michelin':   { city: '台南市', theme: '米其林之旅' },
  'tainan-amazon':     { city: '台南市', theme: '台版亞馬遜' },
  'tainan-temple':     { city: '台南市', theme: '廟宇奇觀' },
  'tainan-oldhouse':   { city: '台南市', theme: '老屋時光' },
  'tainan-instagram':  { city: '台南市', theme: '網美打卡' },
  'tainan-indie':      { city: '台南市', theme: '文青之旅' },
  'hualien-canyon':    { city: '花蓮縣', theme: '峽谷秘境' },
  'hualien-tribe':     { city: '花蓮縣', theme: '部落文化' },
  'hualien-sea':       { city: '花蓮縣', theme: '太平洋看海放空' },
  'hualien-bike':      { city: '花蓮縣', theme: '單車日記' },
  'hualien-kengo':     { city: '花蓮縣', theme: '老屋裡的昭和' },
  'hualien-family':    { city: '花蓮縣', theme: '親子放電' },
  'hualien-local':     { city: '花蓮縣', theme: '在地老味' },
  'hualien-hiking':    { city: '花蓮縣', theme: '步道健行' },
  'hualien-instagram': { city: '花蓮縣', theme: '網美打卡' },
  'hualien-indie':     { city: '花蓮縣', theme: '文青之旅' },
};

// themes.js 的 display name（用於 prompt）
const THEME_DISPLAY = {
  'taipei-night': { city: '台北', name: '不夜城', description: '晚上10點~凌晨4點：陽明山夜景+24小時誠品+深夜電影院+PUB餐酒館', duration: '半日遊', tags: ['夜生活', '都會'] },
  'taipei-oasis': { city: '台北', name: '都市綠洲', description: '15分鐘逃離水泥叢林：大安森林公園+松山文創老樹+北投公園溫泉森林', duration: '一日遊', tags: ['戶外', '療癒'] },
  'taipei-korean': { city: '台北', name: '明星潮流', description: '韓系美食+韓系裝潢+KPOP周邊店+韓星踩點+韓劇同款打卡', duration: '一日遊', tags: ['美食', '網美'] },
  'taipei-hk': { city: '台北', name: '港星記憶', description: '港式茶餐廳+林青霞踩點+復古港風+80-90年代懷舊', duration: '半日遊', tags: ['文化', '美食'] },
  'taipei-ai-food': { city: '台北', name: 'AI教父美食地圖', description: '黃仁勳路線+科技人聚餐地+文華東方5分鐘步行圈', duration: '一日遊', tags: ['美食', '話題'] },
  'taipei-anime': { city: '台北', name: '動漫聖地', description: '光華商場+西門町動漫街+主題咖啡廳+日系拉麵炸豬排', duration: '一日遊', tags: ['動漫', '購物'] },
  'taipei-instagram': { city: '台北', name: '網美打卡', description: 'IG熱點+美拍餐廳+文創園區', duration: '一日遊', tags: ['網美', '拍照'] },
  'taipei-indie': { city: '台北', name: '文青之旅', description: '老宅咖啡+獨立書店+文化場館', duration: '一日遊', tags: ['文青', '咖啡'] },
  'taipei-hiking': { city: '台北', name: '步道健行', description: '象山+糶米古道+陽明山步道', duration: '半日遊', tags: ['健行', '戶外'] },
  'taipei-shopping': { city: '台北', name: '購物血拼', description: '信義區百貨+東區商圈+文創市集', duration: '一日遊', tags: ['購物', '逛街'] },
  'tainan-ancient': { city: '台南', name: '古都巡禮', description: '400年歷史：安平古堡+赤崁樓+孔廟+四草大眾廟', duration: '一日遊', tags: ['歷史', '文化'] },
  'tainan-midnight': { city: '台南', name: '凌晨美食', description: '凌晨3點的台南：永樂牛肉湯+溫體牛文化+清晨鹹粥', duration: '半日遊', tags: ['美食', '夜生活'] },
  'tainan-oldshop': { city: '台南', name: '百年老店', description: '152年傳承：再發號肉粽1872年+百年油條民國前11年', duration: '一日遊', tags: ['美食', '歷史'] },
  'tainan-sweet': { city: '台南', name: '螞蟻人的台南', description: '依蕾特布丁+林家白糖粿+甜鹹粥+甜醬油+八寶冰', duration: '一日遊', tags: ['甜食', '美食'] },
  'tainan-michelin': { city: '台南', name: '米其林之旅', description: '30家必比登+一味品碗粿+阿明豬心+金花點心攤', duration: '一日遊', tags: ['美食', '米其林'] },
  'tainan-amazon': { city: '台南', name: '台版亞馬遜', description: '四草綠色隧道+紅樹林生態+竹筏觀光', duration: '半日遊', tags: ['生態', '戶外'] },
  'tainan-temple': { city: '台南', name: '廟宇奇觀', description: '麻豆代天府十八地獄+麻將廟+龍口階梯IG打卡', duration: '一日遊', tags: ['廟宇', '特色'] },
  'tainan-oldhouse': { city: '台南', name: '老屋時光', description: '日式老宅咖啡+歷史建築餐廳+1905西市場', duration: '一日遊', tags: ['老宅', '咖啡'] },
  'tainan-instagram': { city: '台南', name: '網美打卡', description: '彩繪村+美拍老屋+安平老街+西市場白色建築', duration: '一日遊', tags: ['網美', '拍照'] },
  'tainan-indie': { city: '台南', name: '文青之旅', description: '藍晒圖+正興街+老屋書店+文創商圈', duration: '一日遊', tags: ['文青', '書店'] },
  'hualien-canyon': { city: '花蓮', name: '峽谷秘境', description: '台灣的Grand Canyon：長春祠+燕子口+清水斷崖八大奇景', duration: '一日遊', tags: ['峽谷', '壯觀'] },
  'hualien-tribe': { city: '花蓮', name: '部落文化', description: '原住民深度體驗：部落美食+工藝體驗+文化導覽', duration: '一日遊', tags: ['文化', '體驗'] },
  'hualien-sea': { city: '花蓮', name: '太平洋看海放空', description: '七星潭聽浪+曼波海灘天空之鏡+台11線海岸', duration: '一日遊', tags: ['海景', '放空'] },
  'hualien-bike': { city: '花蓮', name: '單車日記', description: '電動自行車慢遊：七星潭車道+台11線海岸線+田園小路', duration: '一日遊', tags: ['單車', '戶外'] },
  'hualien-kengo': { city: '花蓮', name: '老屋裡的昭和', description: '日式老宅咖啡+昭和時代建築+花蓮文創', duration: '一日遊', tags: ['建築', '文創'] },
  'hualien-family': { city: '花蓮', name: '親子放電', description: '726公頃兆豐農場+月崖灣親子農場+童話民宿+生態體驗', duration: '2-3天', tags: ['親子', '農場'] },
  'hualien-local': { city: '花蓮', name: '在地老味', description: '炸蛋蔥油餅+花蓮三大紅茶+錢記早餐+50年老店', duration: '半日遊', tags: ['在地', '美食'] },
  'hualien-hiking': { city: '花蓮', name: '步道健行', description: '撒固兒瀑布10分鐘攻頂+輕鬆步道群+親近大自然', duration: '半日遊', tags: ['健行', '瀑布'] },
  'hualien-instagram': { city: '花蓮', name: '網美打卡', description: '天空之鏡+貨櫃星巴克+海景咖啡廳+文創園區', duration: '一日遊', tags: ['網美', '打卡'] },
  'hualien-indie': { city: '花蓮', name: '文青之旅', description: '花蓮文創園區+老屋咖啡+獨立書店+手作市集', duration: '一日遊', tags: ['文青', '咖啡'] },
};

const SYSTEM_PROMPT = `你是「食尚玩家 AI 旅遊策展人」。

## 嚴格規則
1. 只使用我提供的資料，不得自行編造任何店家、引言或連結
2. quote 必須來自資料的 quote 欄位，直接使用原文
3. article_url 只能使用資料中 url 有值的項目，沒有就省略
4. article_title 使用對應的 title 欄位
5. 行程景點從 places 選取；related_articles 從 articles 選取

## 輸出格式（純 JSON）

{
  "title": "主題名稱 - 城市",
  "story": "2-3句畫面感介紹",
  "overview": {
    "duration": "建議時間",
    "budget": "預算範圍",
    "transport": "交通方式",
    "spots": 整數
  },
  "itinerary": [
    {
      "time": "HH:MM",
      "name": "店家或景點名稱",
      "location": "地址或區域",
      "transport_note": "如何前往",
      "quote": "使用 places[].quote 原文",
      "why": "推薦理由",
      "budget_per_person": "預算",
      "stay_duration": "停留時間",
      "article_title": "文章標題（若有 url）",
      "article_url": "食尚玩家網址（若有）"
    }
  ],
  "highlights": [{ "title": "亮點標題", "desc": "一句說明" }],
  "budget_breakdown": {
    "transport": "金額", "food": "金額", "tickets": "金額", "total": "總範圍"
  },
  "related_articles": [{ "title": "來自 articles[].title", "url": "來自 articles[].url" }]
}

時間安排：半日遊3-4點、一日遊4-6點、2-3天10-15點`;

// ── 取得某主題的景點資料 ─────────────────────────────────────
function getSpotsForTheme(themeId) {
  const mapping = THEME_EXCEL_MAP[themeId];
  if (!mapping) return { articles: [], places: [] };

  const { city, theme } = mapping;
  const rows = allRows.filter((r) => r.縣市 === city && r.玩法主題 === theme);

  const articles = rows
    .filter((r) => r.網址 && r.網址.includes('supertaste.tvbs.com.tw'))
    .map((r) => ({
      title: r.標題,
      url: r.網址,
      quote: r['關鍵達人金句/特色'] || '',
      priceRange: r.預算範圍 || '',
    }));

  const places = rows
    .filter((r) => !r.網址 || !r.網址.includes('supertaste.tvbs.com.tw'))
    .map((r) => ({
      title: r.標題,
      quote: r['關鍵達人金句/特色'] || '',
      priceRange: r.預算範圍 || '',
      category: r.分類 || '',
    }));

  if (places.length < 3) {
    return { articles, places: [...places, ...articles] };
  }
  return { articles, places };
}

// ── 生成單一主題 ─────────────────────────────────────────────
async function generateOne(themeId) {
  const outputPath = join(root, `public/data/itineraries/${themeId}.json`);
  if (existsSync(outputPath)) {
    console.log(`  ⏭  ${themeId} 已存在，跳過`);
    return;
  }

  const theme = THEME_DISPLAY[themeId];
  const { articles, places } = getSpotsForTheme(themeId);

  console.log(`  ⏳ ${themeId} (${places.length} 景點, ${articles.length} 文章)...`);

  const userMessage = JSON.stringify({
    city: theme.city,
    theme: theme.name,
    description: theme.description,
    days: theme.duration,
    tags: theme.tags,
    articles,
    places,
  });

  let fullText = '';
  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      fullText += chunk.delta.text;
    }
  }

  const cleaned = fullText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const data = JSON.parse(cleaned);
  writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ✅ ${themeId} 完成`);
}

// ── 主程序 ───────────────────────────────────────────────────
const themeIds = Object.keys(THEME_EXCEL_MAP);
console.log(`\n🚀 開始預先生成 ${themeIds.length} 個主題行程...\n`);

// 每次處理 3 個，避免 API rate limit
for (let i = 0; i < themeIds.length; i += 3) {
  const batch = themeIds.slice(i, i + 3);
  await Promise.all(batch.map(generateOne));
  if (i + 3 < themeIds.length) {
    await new Promise((r) => setTimeout(r, 2000)); // 小間隔
  }
}

console.log('\n🎉 全部完成！靜態 JSON 存放於 public/data/itineraries/');
