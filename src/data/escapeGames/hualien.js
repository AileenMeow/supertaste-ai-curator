export const hualienGame = {
  id: 'hualien',
  city: '花蓮',
  title: '山海守護令：部落危機',
  subtitle: '英雄拯救部落的史詩冒險',
  difficulty: 5,
  estimatedTime: '6-7 小時',
  theme: {
    primaryColor: '#2E7D32',
    secondaryColor: '#FFB300',
    backgroundColor: '#1B5E20',
    accentColor: '#D32F2F',
    fontFamily: '"Noto Sans TC", sans-serif',
    gradient: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #FFB300 100%)',
  },
  prologue: {
    title: '勇者的召喚',
    content: `[部落圖騰發光]

耆老的聲音：
「年輕的勇者，

我們的部落正面臨危機。

三天前，
一道黑色光芒從太平洋升起，
山海之間的平衡被打破了。

作物枯萎、漁獲消失、族人病倒...

祖靈託夢給我：
『只有集齊五個守護印記，
 才能解除詛咒。』

而你，
就是被選中的勇者。

第一個試煉在『山之心』，
去那裡，
證明你的勇氣。」`,
  },
  missions: [
    {
      id: 'hualien-mission-1',
      missionNumber: 1,
      title: '試煉 01 | 山之試煉',
      location: '太魯閣峽谷',
      emoji: '⛰️',
      briefing: `守護力量: ▓░░░░░ 20%

「太魯閣，
是山神居住的地方。

站在峽谷前，
感受山的力量，
拍下你看到的畫面，
山神會給你第一個印記。」`,
      task: '前往太魯閣峽谷，拍下峽谷景色',
      hint: '勇氣來自面對恐懼',
      unlockStory: `[圖騰亮起第一道光]

「山神說：
你有勇氣面對高山，
但勇氣還不夠。

下一個試煉在『海之境』，
去證明你的意志。」`,
      reward: '守護印記 #1 - 山之力',
      style: { cardBg: 'linear-gradient(135deg, #4A148C 0%, #2E7D32 100%)' },
    },
    {
      id: 'hualien-mission-2',
      missionNumber: 2,
      title: '試煉 02 | 海之試煉',
      location: '七星潭',
      emoji: '🌊',
      briefing: `守護力量: ▓▓░░░░ 40%

「七星潭，
是海神的領域。

撿一顆被海洋打磨的石頭，
拍下它，
海神會認可你。」`,
      task: '前往七星潭，撿石頭或拍海景',
      hint: '意志堅定如石',
      unlockStory: `「海神說：
你的意志堅定如石，

但要解除詛咒，
你還需要『森林的智慧』。

去林間尋找答案。」`,
      reward: '守護印記 #2 - 海之意志',
    },
    {
      id: 'hualien-mission-3',
      missionNumber: 3,
      title: '試煉 03 | 林之試煉',
      location: '林田山 / 富源森林',
      emoji: '🌲',
      briefing: `守護力量: ▓▓▓░░░ 60%

「森林記得所有的故事，
樹木活了百年，
見證了部落的興衰。

去找最老的樹，
聽它說話。」`,
      task: '前往林田山或森林，拍下老樹或森林',
      hint: '森林記得一切',
      unlockStory: `「森林之靈說：
你已經知道真相，

下一個試煉，
去稻田，
那裡有『生命之源』。」`,
      reward: '守護印記 #3 - 林之智慧',
    },
    {
      id: 'hualien-mission-4',
      missionNumber: 4,
      title: '試煉 04 | 土之試煉',
      location: '富里稻田 / 池上',
      emoji: '🌾',
      briefing: `守護力量: ▓▓▓▓░░ 80%

「稻田是生命的源頭，
是祖先的祝福。

拍下這片土地，
讓土地記得你的承諾。」`,
      task: '前往稻田，拍下稻田景色',
      hint: '生命的循環',
      unlockStory: `「土地之靈說：
你理解了生命的循環，

現在，
回到部落，
完成最後的使命。」`,
      reward: '守護印記 #4 - 土之慈悲',
    },
    {
      id: 'hualien-mission-5',
      missionNumber: 5,
      title: '最終試煉 | 守護之戰',
      location: '太巴塱部落 / 馬太鞍部落',
      emoji: '🛡️',
      isFinal: true,
      briefing: `守護力量: ▓▓▓▓▓░ 95%

「勇者，
你已經通過四個試煉：

✓ 山給了你勇氣
✓ 海給了你意志
✓ 林給了你智慧
✓ 土給了你慈悲

現在，
回到部落，
站在圖騰前，
拍下圖騰，
將你的力量傳遞給它。」`,
      task: '前往部落，拍下圖騰或部落建築',
      hint: '終點即是起點',
      unlockStory: `[五個印記同時發光]

━━━━━━━━━━━━━━━━━━
守護靈甦醒
━━━━━━━━━━━━━━━━━━

「山海守護靈」現身：

「年輕的勇者，

你做到了。

詛咒已經解除，
作物會重新生長，
魚群會回到海裡，
族人會恢復健康。

從今天起，
你就是『山海守護者』。

記住：
守護部落，
就是守護這片土地，
就是守護我們的根。」

耆老：
「孩子，
你拯救了我們，

部落永遠記得你。」`,
      reward: '完整守護力量',
    },
  ],
  epilogue: {
    title: '英雄歸來',
    achievementTitle: '山海守護者',
    achievements: [
      '✓ 完成 5 個試煉',
      '✓ 解除部落詛咒',
      '✓ 成為被部落認可的勇者',
    ],
    shareText: '我完成了「山海守護令：部落危機」拯救任務！',
    specialRewards: [
      '🏆 守護者勳章',
      '📜 部落榮譽證書',
      '🎖️ 英雄稱號',
    ]
  }
};
