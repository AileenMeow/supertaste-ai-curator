export const tainanGame = {
  id: 'tainan',
  city: '台南',
  title: '時空裂痕：古都迷航',
  subtitle: '穿越時空的古都冒險',
  difficulty: 4,
  estimatedTime: '5-6 小時',
  theme: {
    primaryColor: '#8B4513',
    secondaryColor: '#F5DEB3',
    backgroundColor: '#2C1810',
    accentColor: '#DC143C',
    fontFamily: '"Noto Serif TC", serif',
    gradient: 'linear-gradient(135deg, #2C1810 0%, #8B4513 50%, #F5DEB3 100%)',
  },
  prologue: {
    title: '時空異常偵測',
    content: `[畫面扭曲效果]

系統通知：
時空座標異常
當前年份：1932
你的年份：2024

時空落差：-92 年

「穿越者，

你意外啟動了時空裂痕，
現在困在 1932 年的台南。

想要回家，
你必須收集五個時空碎片，
修復時空裂痕。

第一個碎片在『時空錨點』，
那是這個時代最現代的建築。」`,
  },
  missions: [
    {
      id: 'tainan-mission-1',
      missionNumber: 1,
      title: '時空碎片 01 | 摩登起點',
      location: '林百貨',
      emoji: '🏬',
      briefing: `時空穩定度: ▓░░░░░ 20%

「林百貨，1932 年剛開幕，
是台南最摩登的建築。

在你的時代（2024），
它已經重新開放。

站在電梯前，
拍下這個『時空錨點』。」`,
      task: '前往林百貨，拍下電梯或建築',
      hint: '全台灣第一台電梯',
      unlockStory: `[碎片發光]

「碎片 01 已收集
時空能量 +20%

下一個碎片在『味道不變的地方』，
那裡有一碗湯，
從 1932 煮到 2024。」`,
      reward: '時空碎片 #1',
      style: { cardBg: 'linear-gradient(135deg, #8B4513 0%, #F5DEB3 100%)' },
    },
    {
      id: 'tainan-mission-2',
      missionNumber: 2,
      title: '時空碎片 02 | 永恆之味',
      location: '阿霞飯店',
      emoji: '🍜',
      briefing: `時空穩定度: ▓▓░░░░ 40%

「這間店，
在 1932 年剛開始營業，
到 2024 年還在。

味道穿越了時空，
拍下這碗『時空之湯』。」`,
      task: '前往阿霞飯店，拍下美食或店面',
      hint: '從路邊攤到總統府的傳奇',
      unlockStory: `「碎片 02 已收集

警告：時空開始產生矛盾
你在這個時代停留太久，
可能會改變歷史。

下一個碎片在『老街深處』。」`,
      reward: '時空碎片 #2',
      style: { cardBg: 'linear-gradient(135deg, #DC143C 0%, #F5DEB3 100%)' },
    },
    {
      id: 'tainan-mission-3',
      missionNumber: 3,
      title: '時空碎片 03 | 街巷記憶',
      location: '神農街',
      emoji: '🏘️',
      briefing: `時空穩定度: ▓▓▓░░░ 60%

「神農街，
在 1932 年叫『北勢街』，
是最熱鬧的商業街。

到了 2024，
變成文青最愛的老街。

找一扇門，
它在兩個時代都存在。」`,
      task: '前往神農街，拍下老屋或街景',
      hint: '老街的每扇門都是故事的入口',
      unlockStory: `「碎片 03 已收集

系統偵測：
你開始影響這個時代的人，
有人記住了你的臉...

快去找下一個碎片，
在『未來的記憶』裡。」`,
      reward: '時空碎片 #3',
    },
    {
      id: 'tainan-mission-4',
      missionNumber: 4,
      title: '時空碎片 04 | 平行記憶',
      location: '水交社眷村',
      emoji: '🏠',
      briefing: `時空穩定度: ▓▓▓▓░░ 80%

「這個地方，
在 1932 年還不存在，
要到 1949 年才會出現。

但時空碎片連結了
『還未發生的記憶』。

拍下這個『未來的證明』。」`,
      task: '前往水交社，拍下眷村建築',
      hint: '未來的記憶也能成為錨點',
      unlockStory: `「碎片 04 已收集

最後的碎片在『古老的起點』，
那裡見證了 400 年的歷史，
是時空最穩定的地方。

去安平古堡，
在那裡關閉時空裂痕。」`,
      reward: '時空碎片 #4',
    },
    {
      id: 'tainan-mission-5',
      missionNumber: 5,
      title: '時空碎片 05 | 歷史之錨',
      location: '安平古堡',
      emoji: '🏰',
      isFinal: true,
      briefing: `時空穩定度: ▓▓▓▓▓░ 95%

「安平古堡，
從 1624 年就在這裡，
見證了荷蘭、明鄭、清朝、日治、民國...

在這裡，
所有的時空都會收束。

拍下古堡，
啟動回家的傳送門。」`,
      task: '前往安平古堡，拍下城牆或古堡',
      hint: '終點就是起點',
      unlockStory: `[五個碎片合體]

時空穩定度: ▓▓▓▓▓▓ 100%

「穿越者，

五個碎片已收集完成。

時空裂痕已修復。

你可以回到 2024 年了。

但是...
你確定要回去嗎？

在這個時代，
你看到了台南最初的樣子，
那些在你的時代已經消失的...

或許，
這才是旅行的意義：

不只是看見風景，
而是看見時間。」

歡迎回到 2024 年。`,
      reward: '完整時空',
    },
  ],
  epilogue: {
    title: '穿越完成',
    achievementTitle: '時空旅者',
    achievements: [
      '✓ 收集 5 個時空碎片',
      '✓ 穿越 92 年時光',
      '✓ 見證台南的百年變遷',
    ],
    shareText: '我完成了「時空裂痕：古都迷航」穿越任務！',
  }
};
