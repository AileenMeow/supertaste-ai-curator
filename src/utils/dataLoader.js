import * as XLSX from 'xlsx';

/**
 * Excel 檔案路徑由環境變數控制，方便隨時換資料：
 *   VITE_EXCEL_FILE=3個縣市-10主題_完整版.xlsx   ← 在 .env.local 設定
 *
 * 若網址欄位為空，視為「網友推薦」，日後補連結即可。
 */
const EXCEL_FILE =
  import.meta.env.VITE_EXCEL_FILE || '3個縣市-10主題_完整版.xlsx';

export async function loadDataFromExcel() {
  const response = await fetch(`/data/${EXCEL_FILE}`);
  if (!response.ok) throw new Error(`無法讀取 Excel：/data/${EXCEL_FILE}`);

  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer);

  const worksheet = workbook.Sheets['食尚玩家資料列表'];
  if (!worksheet) throw new Error('找不到工作表「食尚玩家資料列表」');
  const rawData = XLSX.utils.sheet_to_json(worksheet);

  return {
    themes: organizeByTheme(rawData),
    spots: organizeSpots(rawData),
  };
}

function rowToSpotBase(row) {
  const url = (row.網址 || '').trim();
  const isSupertaste = url.includes('supertaste.tvbs.com.tw');

  return {
    name: row.標題 || '',
    city: row.縣市 || '',
    theme: row.玩法主題 || '',
    category: row.分類 || '',
    type: row.推薦類型 || '核心主題',
    quote: row['關鍵達人金句/特色'] || '',
    url: isSupertaste ? url : '',          // 非食尚玩家來源一律清空
    isCommunity: !isSupertaste,            // 標記是否為網友推薦
    address: row.地址 || '',
    priceRange: row.預算範圍 || '',
    isRepresentative: row.是否為代表性推薦點 === '是',
  };
}

function organizeByTheme(data) {
  const themeMap = {};
  data.forEach((row) => {
    const key = `${row.縣市}-${row.玩法主題}`;
    if (!themeMap[key]) {
      themeMap[key] = { city: row.縣市, theme: row.玩法主題, spots: [] };
    }
    themeMap[key].spots.push({
      id: `${key}-${themeMap[key].spots.length}`,
      ...rowToSpotBase(row),
    });
  });
  return Object.values(themeMap);
}

function organizeSpots(data) {
  return data.map((row, index) => ({ id: `spot-${index}`, ...rowToSpotBase(row) }));
}
