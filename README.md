# 食尚玩家 AI 導遊

> 食尚玩家 500位合作達人 × Claude AI 策展，打造台灣深度旅遊行程

🔗 **Live Demo:** https://supertaste-ai-curator.vercel.app/

---

## 專案簡介

一個以食尚玩家內容為核心的 AI 旅遊行程產生器。使用者選擇主題、勾選想去的景點後，由 Claude AI 扮演「策展人」，依地理位置、營業時間、用餐動線重新排程，並生成個人化開場故事。

外加一個彩蛋：**城市逃脫遊戲** — 將台北 / 台南 / 花蓮 各設計成五關情境冒險，使用者上傳實地照片解鎖故事，化旅遊為沉浸式體驗。

**目前涵蓋範圍：** 台北、台南、花蓮 × 各 10 種玩法主題 = 30 條精選路線；29 個主題、約 1,500 筆店家／景點。

---

## 功能特色

### 🗺 AI 行程規劃
- **30 條精選主題** — 首頁卡片展示，支援依城市 / 玩法風格 / 天數篩選
- **景點挑選器** — 類別 tab + 大量景點卡片 + 全選 / 清除工具
- **AI 智慧排程** — 一次 Claude API 呼叫同時產生：個人化開場故事、依營業時間與動線重排的順序、午晚餐推薦
- **時間軸視覺** — 含營業時間、移動時間、用餐時段的完整一日行程
- **真實資料來源** — 全部取自食尚玩家爬蟲（含 125 篇文章標題抓取）

### 🎮 城市逃脫遊戲
- **三條故事線** — 台北賽博龐克 × 台南民國穿越 × 花蓮部落史詩
- **五關情境任務** — 每關獨立場景插圖、briefing、hint
- **照片解鎖機制** — 上傳實地照片即解鎖下一段故事
- **進度持久化** — Zustand + localStorage
- **完賽證書頁** — 煙火動畫 + 證書徽章 + 照片牆 + 故事回顧

### 💸 友善降級
- AI 額度耗盡時跳出「錢不夠用了 QAQ」提示，瀏覽功能不受影響
- 沒餐廳的主題自動從同城市其他主題撈推薦補上
- 所有頁面切換都會自動 scroll 回頂

---

## 技術架構

| 層次 | 技術 |
|------|------|
| 前端框架 | React 19 + Vite 8 |
| 路由 | React Router v7（含 ScrollToTop） |
| 樣式 | Tailwind CSS v3 + 客製 CSS 動畫 |
| 狀態管理 | Zustand（含 persist middleware） |
| AI | Anthropic Claude（claude-haiku-4-5） |
| 資料來源 | 食尚玩家爬蟲 JSON（29 主題 / 1,500+ 景點 / 125 篇文章標題） |
| 部署 | Vercel（含 SPA rewrites） |

---

## 快速開始

```bash
npm install
echo "VITE_ANTHROPIC_API_KEY=sk-ant-..." > .env.local
npm run dev
```

> API Key 請至 [Anthropic Console](https://console.anthropic.com/settings/keys) 取得

### 建置正式版本

```bash
npm run build
npm run preview
```

---

## 專案結構

```
src/
├── components/
│   ├── icons/
│   │   └── HandDrawn.jsx           # 手繪風 SVG icon set
│   ├── ui/
│   │   ├── ThemeCard.jsx           # IG 風格主題卡片
│   │   ├── SpotPicker.jsx          # 景點挑選器（含 fixed bottom bar）
│   │   └── FilterModal.jsx         # 條件篩選彈窗
│   └── ScrollToTop.jsx             # 路由切換捲動到頂
├── data/
│   ├── themes.js                   # 30 主題靜態 metadata
│   ├── themeMapping.js             # themeId → 食尚資料對應
│   ├── supertaste_spots_data.json  # 食尚玩家爬蟲主資料
│   ├── article-titles.json         # 125 篇文章標題（爬蟲產出）
│   └── escapeGames/                # 城市逃脫遊戲故事資料
│       ├── taipei.js / tainan.js / hualien.js
│       └── index.js
├── lib/
│   └── aiPlanner.js                # Claude 行程排序 / 故事生成
├── pages/
│   ├── HomePage.jsx                # 首頁
│   ├── ExplorePage.jsx             # 城市探索
│   ├── ItineraryPage.jsx           # 景點挑選 → AI 行程結果
│   ├── SavedPage.jsx               # 收藏清單
│   └── EscapeGame/
│       ├── EscapeGameHome.jsx      # 三城市選擇頁
│       ├── GameStoryline.jsx       # 故事關卡頁（每城市專屬主題）
│       └── GameComplete.jsx        # 完賽證書頁
├── store/
│   ├── savedSpotsStore.js          # 收藏景點 store
│   └── escapeGameStore.js          # 遊戲進度 store（含 persist）
└── utils/
    └── spotDataMapper.js           # 補完欄位（budget / duration / hours）

scripts/
└── scrape-titles.mjs               # 抓取食尚文章 og:title

public/
├── data/theme-images.json          # 30 主題封面圖
└── favicon.svg
```

---

## AI 策展邏輯

`src/lib/aiPlanner.js` 用一次 Claude Haiku 4.5 呼叫同時要三件事：

```json
{
  "story": "70-120 字個人化開場（提到使用者選的元素）",
  "ordered_indices": [依地理位置與動線重排後的索引],
  "lunch_pick": "從餐廳池選最適合午餐的店名",
  "dinner_pick": "從餐廳池選最適合晚餐的店名"
}
```

排序規則包含：
1. 開始時間是 09:00，**不會把當下還沒開門的店排在第一個**
2. 同區的景點要排在一起
3. 午餐時段（11:30-14:00）安排美食類
4. 晚餐時段（18:00-20:30）安排美食類
5. 戶外/景點優先白天，咖啡/酒吧排傍晚後

夜間主題（含「不夜 / 夜 / 晚 / 凌晨」）自動從 18:00 開始。

---

## 城市逃脫遊戲故事線

| 城市 | 主題 | 主角 | 風格 | 配色 |
|---|---|---|---|---|
| 台北 | 記憶代碼：AI 特工 | PHOENIX 失憶特工 | 賽博龐克 monospace | 深灰 + 霓虹藍 |
| 台南 | 時空裂痕：古都迷航 | 李明華穿越者 | 民國復古 serif | 褐 + 米黃 + 紅 |
| 花蓮 | 山海守護令：部落危機 | 部落使者勇者 | 部落史詩 | 森林綠 + 金黃 |

每條故事線有 5 個關卡，每關包含專屬 SVG 場景插圖、briefing、hint、照片上傳、解鎖故事。完賽進入證書頁，可看完整 5 張照片牆 + 5 段故事回顧。

---

## 版本資訊

**v1.40** — 2026/04
- 完整 AI 行程規劃 + 真實食尚玩家資料整合
- 城市逃脫遊戲（3 城市 × 5 關 × 專屬視覺）
- 完賽證書頁（煙火 / 徽章 / 照片牆 / 故事回顧）
- Mobile RWD 優化
- 部署上線 Vercel

---

## 開發團隊

這隊很有料 · 舜子 · 劉澐 · 安啾 · Aileen
