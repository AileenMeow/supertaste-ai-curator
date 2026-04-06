# 食尚玩家 AI 導遊

> 食尚玩家 500位合作達人 × Claude AI 策展，打造台灣深度旅遊行程

## 專案簡介

這是一個以食尚玩家內容為核心的 AI 旅遊行程產生器。使用者選擇城市與玩法主題後，由 Claude AI 扮演「策展人」角色，將達人文章整理成有故事感的完整行程——包含時間規劃、達人金句、預算估算與食尚玩家來源引用。

**目前涵蓋範圍：** 台北、台南、花蓮 × 各10種玩法主題 = 30條精選路線

---

## 功能特色

- **主題探索** — 首頁展示12個精選主題，支援依城市、旅遊風格、天數篩選
- **隨機推薦** — 一鍵獲得驚喜玩法
- **AI 行程生成** — 選定主題後即時呼叫 Claude API，生成含達人金句的時間軸行程
- **Streaming 體驗** — 行程逐字顯示，有效降低等待感
- **Session 快取** — 同一主題不重複呼叫 API
- **來源引用** — 所有推薦點可追溯至食尚玩家原始報導

---

## 技術架構

| 層次 | 技術 |
|------|------|
| 前端框架 | React 19 + Vite 8 |
| 路由 | React Router v7 |
| 樣式 | Tailwind CSS v3 |
| 動畫 | Framer Motion |
| 狀態管理 | Zustand |
| AI | Anthropic Claude (claude-sonnet-4) |
| 資料來源 | 食尚玩家官網 + Excel 資料庫 (233筆) |

---

## 快速開始

### 安裝依賴

```bash
npm install
```

### 設定環境變數

在專案根目錄建立 `.env` 檔：

```env
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

> API Key 請至 [Anthropic Console](https://console.anthropic.com/) 取得

### 啟動開發伺服器

```bash
npm run dev
```

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
│   ├── icons/          # 自定義 SVG icon 元件
│   └── ui/
│       ├── ThemeCard.jsx     # 主題卡片
│       └── FilterModal.jsx   # 篩選彈窗
├── data/
│   ├── themes.js       # 30個主題靜態資料
│   ├── systemPrompt.js # Claude 系統提示詞
│   └── coverImages.js  # 封面圖設定
├── lib/
│   └── generateItinerary.js  # Claude API 呼叫與 Streaming
├── pages/
│   ├── HomePage.jsx    # 首頁（主題瀏覽）
│   ├── ExplorePage.jsx # 依城市探索
│   └── ItineraryPage.jsx  # 行程結果頁
public/
└── data/
    └── 3個縣市-10主題_完整版.xlsx  # 233筆食尚玩家資料
```

---

## 資料來源說明

所有推薦內容皆來自食尚玩家官網 (supertaste.tvbs.com.tw)：

- 233筆精選店家與景點資料
- 每筆資料包含：標題、分類、達人金句、來源網址、地址、預算範圍
- 涵蓋台北、台南、花蓮 × 10個玩法主題

---

## AI 策展邏輯

Claude 被設定為「食尚玩家 AI 旅遊策展人」，而非對話機器人或搜尋引擎。每次行程生成包含：

1. **故事介紹** — 2-3句有畫面感的玩法說明
2. **行程總覽** — 建議時間、預算、交通方式
3. **時間軸行程** — 每個景點含達人金句與推薦理由
4. **亮點整理** — 這條路線的獨特之處
5. **預算明細** — 交通 / 餐飲 / 門票分項
6. **延伸閱讀** — 對應食尚玩家原始文章連結

---

## 版本資訊

**v1.0** — 初版 prototype，2026/04
