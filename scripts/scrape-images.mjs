/**
 * 從食尚玩家文章 URL 抓取 og:image，存成 public/data/theme-images.json
 * 執行：node scripts/scrape-images.mjs
 *
 * 輸出格式：{ [themeId]: [imageUrl, ...] }
 */

import XLSX from 'xlsx';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const OUTPUT = join(root, 'public/data/theme-images.json');

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

// 讀 Excel
const wb = XLSX.readFile(join(root, 'public/data/3個縣市-10主題_完整版.xlsx'));
const allRows = XLSX.utils.sheet_to_json(wb.Sheets['食尚玩家資料列表']);

// 取已存的快取
const cache = existsSync(OUTPUT) ? JSON.parse(readFileSync(OUTPUT, 'utf-8')) : {};

async function fetchOgImage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

async function scrapeTheme(themeId) {
  if (cache[themeId]?.length >= 3) {
    console.log(`  ⏭  ${themeId} 已有圖片，跳過`);
    return;
  }

  const { city, theme } = THEME_EXCEL_MAP[themeId];
  const urls = allRows
    .filter(r => r.縣市 === city && r.玩法主題 === theme && r.網址?.includes('supertaste.tvbs.com.tw'))
    .map(r => r.網址)
    .slice(0, 5); // 最多抓5篇找3張

  const images = [];
  for (const url of urls) {
    if (images.length >= 3) break;
    console.log(`    fetching ${url}`);
    const img = await fetchOgImage(url);
    if (img) images.push(img);
    await new Promise(r => setTimeout(r, 500)); // 禮貌性間隔
  }

  cache[themeId] = images;
  console.log(`  ✅ ${themeId}: ${images.length} 張圖`);
}

console.log('\n🖼  開始抓取文章封面圖...\n');

for (const themeId of Object.keys(THEME_EXCEL_MAP)) {
  await scrapeTheme(themeId);
  writeFileSync(OUTPUT, JSON.stringify(cache, null, 2)); // 每個主題存一次
}

console.log(`\n✅ 完成！儲存至 public/data/theme-images.json`);
