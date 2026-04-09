export const taipeiGame = {
  id: 'taipei',
  city: '台北',
  title: '記憶代碼：AI特工',
  subtitle: '失憶特工的機密任務',
  difficulty: 5,
  estimatedTime: '4-5 小時',
  theme: {
    primaryColor: '#00D9FF',
    secondaryColor: '#9D00FF',
    backgroundColor: '#0A0E27',
    accentColor: '#FF006E',
    fontFamily: '"Orbitron", "Noto Sans TC", sans-serif',
    gradient: 'linear-gradient(135deg, #0A0E27 0%, #1A1F3A 50%, #00D9FF 100%)',
  },
  prologue: {
    title: '系統啟動...',
    content: `ERROR: MEMORY CORRUPTED
正在嘗試恢復...

▓▓▓▓▓░░░░░ 45%

你的身份：[DATA LOST]
你的任務：[DATA LOST]
當前位置：台北車站

手機收到訊息：

「特工 PHOENIX，
你的記憶已被暫時清除，
這是保護任務的必要措施。

找回五個記憶節點，
你就會知道一切。

第一個節點：
『城市制高點，俯瞰一切』

記住：沒有人可以信任。」`,
  },
  missions: [
    {
      id: 'taipei-mission-1',
      missionNumber: 1,
      title: '記憶節點 01 | 監控點',
      location: '台北 101 觀景台 / 象山',
      emoji: '🏙️',
      briefing: `記憶恢復進度: ▓░░░░░ 20%

任務提示：
「在你的記憶裡，
這裡是最佳監控點。

前往城市最高處，
拍下整個台北市，
系統會自動解鎖第一段記憶。」`,
      task: '前往 101 觀景台或象山，拍下台北市景',
      hint: '站在高處，俯瞰整個城市',
      unlockStory: `記憶閃回：
『你是 AI 情報局的特工，
代號 PHOENIX。
你的專長是城市監控與數據分析...』

手機震動，新訊息：

「記憶節點 01 恢復成功。

下一個節點在『數據流動最密集的地方』，
那裡 24 小時燈火通明，
所有人都在盯著螢幕。

時間緊迫。」`,
      reward: '記憶碎片 #1',
      style: { cardBg: 'linear-gradient(135deg, #1a1f3a 0%, #00D9FF 100%)' },
    },
    {
      id: 'taipei-mission-2',
      missionNumber: 2,
      title: '記憶節點 02 | 情報站',
      location: '光華商場 / 三創數位園區',
      emoji: '💻',
      briefing: `記憶恢復進度: ▓▓░░░░ 40%

任務提示：
「在你的記憶中，
這裡是情報交換的地點。

電子訊號在這裡交會，
找到『數位之心』，
拍下它，
下一段記憶會浮現。」`,
      task: '前往光華商場/三創，拍下電子產品或螢幕牆',
      hint: '尋找最多螢幕聚集的地方',
      unlockStory: `記憶閃回：
『你接獲指令：
敵方組織「暗網」正在策劃重大行動，
你需要滲透他們的據點...

但是，誰是敵人？
誰又是盟友？』

手機訊息：

「警告：有人在追蹤你。

下一個節點在『夜晚最熱鬧的地方』，
人群是最好的掩護。」`,
      reward: '記憶碎片 #2',
      style: { cardBg: 'linear-gradient(135deg, #1a1f3a 0%, #9D00FF 100%)' },
    },
    {
      id: 'taipei-mission-3',
      missionNumber: 3,
      title: '記憶節點 03 | 偽裝點',
      location: '西門町 / 寧夏夜市',
      emoji: '🌃',
      briefing: `記憶恢復進度: ▓▓▓░░░ 60%

任務提示：
「在人群中隱藏自己，
是特工的基本技能。

找到最熱鬧的地方，
拍下人潮，
記憶會繼續恢復。」`,
      task: '前往西門町或夜市，拍下熱鬧街景或美食',
      hint: '混入夜晚的人群中',
      unlockStory: `記憶閃回：
『你發現了驚人的真相：

「暗網」組織的首腦，
其實是...

[訊號干擾]

記憶被強制中斷。』

「下一個節點是關鍵，
在『歷史的交會點』。」`,
      reward: '記憶碎片 #3',
      style: { cardBg: 'linear-gradient(135deg, #1a1f3a 0%, #FF006E 100%)' },
    },
    {
      id: 'taipei-mission-4',
      missionNumber: 4,
      title: '記憶節點 04 | 時空錨點',
      location: '中正紀念堂 / 北門',
      emoji: '🏛️',
      briefing: `記憶恢復進度: ▓▓▓▓░░ 80%

任務提示：
「古蹟是城市的記憶，
也是你記憶的錨點。

在歷史建築前，
拍下照片，
真相即將浮現。」`,
      task: '前往中正紀念堂或北門，拍下古蹟建築',
      hint: '歷史建築是時間的見證',
      unlockStory: `[關鍵記憶恢復]

『「暗網」組織的首腦，
是你自己。

不，準確來說，
是你的 AI 複製體。

有人用 AI 技術複製了你，
你的任務，
就是找到並摧毀它。

但是...
你怎麼確定，
現在的你才是真的？』

「最後的記憶在『起點』，
也是『終點』。」`,
      reward: '記憶碎片 #4',
      style: { cardBg: 'linear-gradient(135deg, #1a1f3a 0%, #FFD700 100%)' },
    },
    {
      id: 'taipei-mission-5',
      missionNumber: 5,
      title: '記憶節點 05 | 終局',
      location: '台北車站大廳',
      emoji: '🚉',
      isFinal: true,
      briefing: `記憶恢復進度: ▓▓▓▓▓░ 95%

任務提示：
「回到起點。

在台北車站大廳中央，
拍下你的倒影，
最後的真相會揭曉。」`,
      task: '回到台北車站，拍下大廳或自己的倒影',
      hint: '終點就是起點',
      unlockStory: `[系統完全恢復]

記憶恢復進度: ▓▓▓▓▓▓ 100%

━━━━━━━━━━━━━━━━━━
真相大白
━━━━━━━━━━━━━━━━━━

特工代號：PHOENIX

「這只是一場測試。

真正的『暗網』組織並不存在，
你的記憶也沒有被清除，

這是 AI 情報局開發的
『沉浸式特工訓練系統』。

恭喜你，PHOENIX，
你通過了測試。

但記住：
在真實的任務中，
你永遠不知道，
誰才是真的。」

或者...
這段訊息本身，
也可能是假的？`,
      reward: '完整記憶',
    },
  ],
  epilogue: {
    title: '任務完成',
    achievementTitle: 'AI 特工 PHOENIX',
    achievements: [
      '✓ 恢復 5 個記憶節點',
      '✓ 完成特工訓練',
      '✓ 解鎖真相（？）',
    ],
    shareText: '我完成了「記憶代碼：AI特工」任務！',
  }
};
