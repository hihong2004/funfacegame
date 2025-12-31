/**
 * Fun Face Game - 全域設定檔
 * 
 * @description 所有全域設定都在這裡統一管理
 * @version 1.0.0
 * @date 2024-12-30
 * 
 * ⚠️ 警告：修改此檔案前請先閱讀 PROJECT_RULES.md
 * ⚠️ 修改任何設定都需要謹慎評估影響範圍
 */

const Config = {
  /**
   * ==========================================
   * 網站基本資訊
   * ==========================================
   */
  site: {
    // 網站名稱
    name: 'Fun Face Game',
    
    // 網站標語
    tagline: '讓每張臉都變得有趣！',
    
    // 網站版本號（遵循語義化版本）
    version: '1.0.0',
    
    // 網域
    domain: 'funfacegame.com',
    
    // 網站 URL（開發時為空，部署時自動設定）
    url: typeof window !== 'undefined' ? window.location.origin : '',
    
    // 作者資訊
    author: 'Fun Face Game Team',
    
    // 版權資訊
    copyright: `© ${new Date().getFullYear()} Fun Face Game. All rights reserved.`,
    
    // 預設語言
    defaultLanguage: 'en',
    
    // 支援的語言列表（8 種語言）
    supportedLanguages: ['en', 'zh-TW', 'zh-CN', 'ja', 'de', 'es', 'id', 'vi']
  },

  /**
   * ==========================================
   * 已註冊的遊戲外掛清單
   * ==========================================
   * 
   * 說明：
   * - enabled: true = 已完成開發，顯示在大廳
   * - enabled: false = 開發中或尚未啟用，顯示 "Coming Soon"
   * - priority: P0（高優先級）、P1（中優先級）、P2（低優先級）
   */
  games: [
    {
      id: 'face-crush',
      name: {
        en: 'Face Crush',
        'zh-TW': '臉部粉碎',
        'zh-CN': '脸部粉碎',
        ja: '顔クラッシュ',
        de: 'Gesichts-Crush',
        es: 'Cara Aplastada',
        id: 'Wajah Hancur',
        vi: 'Nghiền Mặt'
      },
      description: {
        en: 'Match 3 faces to crush them!',
        'zh-TW': '消除三個相同的臉！',
        'zh-CN': '消除三个相同的脸！',
        ja: '3つの同じ顔を消そう！',
        de: 'Verbinde 3 Gesichter!',
        es: '¡Combina 3 caras!',
        id: 'Cocokkan 3 wajah!',
        vi: 'Ghép 3 khuôn mặt!'
      },
      type: 'match-3',
      icon: '🎮',
      path: '/plugins/face-crush/index.html',
      enabled: true,  // Face Crush 已開發完成
      premium: false,
      priority: 'P0',
      version: '1.0.0'
    },
    {
      id: 'face-slicer',
      name: {
        en: 'Face Slicer',
        'zh-TW': '臉部切切樂',
        'zh-CN': '脸部切切乐',
        ja: '顔スライサー',
        de: 'Gesichts-Schneider',
        es: 'Cortador de Caras',
        id: 'Pemotong Wajah',
        vi: 'Cắt Mặt'
      },
      description: {
        en: 'Slice the faces like fruits!',
        'zh-TW': '像切水果一樣切臉！',
        'zh-CN': '像切水果一样切脸！',
        ja: 'フルーツのように顔を切る！',
        de: 'Schneide Gesichter wie Früchte!',
        es: '¡Corta las caras como frutas!',
        id: 'Potong wajah seperti buah!',
        vi: 'Cắt mặt như trái cây!'
      },
      type: 'slice',
      icon: '✂️',
      path: '/plugins/face-slicer/index.html',
      enabled: false,  // 待開發
      premium: false,
      priority: 'P0',
      version: '0.0.0'
    },
    {
      id: 'whac-a-face',
      name: {
        en: 'Whac-A-Face',
        'zh-TW': '打臉鼠',
        'zh-CN': '打脸鼠',
        ja: 'もぐらたたき顔',
        de: 'Gesichts-Hammerspiel',
        es: 'Golpea la Cara',
        id: 'Pukul Wajah',
        vi: 'Đập Mặt'
      },
      description: {
        en: 'Whack the faces as they pop up!',
        'zh-TW': '打擊冒出來的臉！',
        'zh-CN': '打击冒出来的脸！',
        ja: '現れる顔を叩く！',
        de: 'Schlage die Gesichter!',
        es: '¡Golpea las caras!',
        id: 'Pukul wajah yang muncul!',
        vi: 'Đập những khuôn mặt!'
      },
      type: 'whack-a-mole',
      icon: '🔨',
      path: '/plugins/whac-a-face/index.html',
      enabled: false,  // 待開發
      premium: false,
      priority: 'P0',
      version: '0.0.0'
    },
    {
      id: 'face-pop',
      name: {
        en: 'Face Pop',
        'zh-TW': '臉部氣球',
        'zh-CN': '脸部气球',
        ja: '顔バルーン',
        de: 'Gesichts-Balloon',
        es: 'Globo de Cara',
        id: 'Balon Wajah',
        vi: 'Bong Bóng Mặt'
      },
      description: {
        en: 'Pop the face balloons!',
        'zh-TW': '戳破臉部氣球！',
        'zh-CN': '戳破脸部气球！',
        ja: '顔の風船を割る！',
        de: 'Platze die Gesichts-Ballons!',
        es: '¡Revienta los globos!',
        id: 'Pecahkan balon wajah!',
        vi: 'Nổ bong bóng mặt!'
      },
      type: 'pop',
      icon: '🎈',
      path: '/plugins/face-pop/index.html',
      enabled: false,  // 待開發
      premium: false,
      priority: 'P1',
      version: '0.0.0'
    },
    {
      id: 'face-stack',
      name: {
        en: 'Face Stack',
        'zh-TW': '臉部疊疊樂',
        'zh-CN': '脸部叠叠乐',
        ja: '顔積み',
        de: 'Gesichts-Stapel',
        es: 'Apila Caras',
        id: 'Tumpuk Wajah',
        vi: 'Xếp Mặt'
      },
      description: {
        en: 'Stack the faces as high as possible!',
        'zh-TW': '盡可能疊高臉部！',
        'zh-CN': '尽可能叠高脸部！',
        ja: '顔をできるだけ高く積む！',
        de: 'Staple Gesichter so hoch wie möglich!',
        es: '¡Apila las caras lo más alto posible!',
        id: 'Tumpuk wajah setinggi mungkin!',
        vi: 'Xếp mặt cao nhất có thể!'
      },
      type: 'stack',
      icon: '📚',
      path: '/plugins/face-stack/index.html',
      enabled: false,  // 待開發
      premium: false,
      priority: 'P1',
      version: '0.0.0'
    },
    {
      id: 'face-memory',
      name: {
        en: 'Face Memory',
        'zh-TW': '臉部記憶',
        'zh-CN': '脸部记忆',
        ja: '顔記憶',
        de: 'Gesichts-Memory',
        es: 'Memoria de Caras',
        id: 'Memori Wajah',
        vi: 'Trí Nhớ Mặt'
      },
      description: {
        en: 'Match the face pairs!',
        'zh-TW': '配對相同的臉！',
        'zh-CN': '配对相同的脸！',
        ja: '同じ顔をペアにする！',
        de: 'Finde die Gesichts-Paare!',
        es: '¡Encuentra los pares!',
        id: 'Cocokkan pasangan wajah!',
        vi: 'Ghép đôi khuôn mặt!'
      },
      type: 'memory',
      icon: '🧠',
      path: '/plugins/face-memory/index.html',
      enabled: false,  // 待開發
      premium: false,
      priority: 'P1',
      version: '0.0.0'
    }
  ],

  /**
   * ==========================================
   * 已註冊的主題清單
   * ==========================================
   */
  themes: [
    {
      id: 'birthday',
      name: {
        en: '🎂 Birthday Party',
        'zh-TW': '🎂 生日派對',
        'zh-CN': '🎂 生日派对',
        ja: '🎂 誕生日パーティー',
        de: '🎂 Geburtstagsfeier',
        es: '🎂 Fiesta de Cumpleaños',
        id: '🎂 Pesta Ulang Tahun',
        vi: '🎂 Tiệc Sinh Nhật'
      },
      effectType: 'cake-smash',
      premium: false,
      enabled: true
    },
    {
      id: 'romance',
      name: {
        en: '💖 Romance',
        'zh-TW': '💖 浪漫告白',
        'zh-CN': '💖 浪漫告白',
        ja: '💖 ロマンス',
        de: '💖 Romantik',
        es: '💖 Romance',
        id: '💖 Romansa',
        vi: '💖 Lãng Mạn'
      },
      effectType: 'heart-surround',
      premium: false,
      enabled: true
    },
    {
      id: 'party',
      name: {
        en: '🎉 Party',
        'zh-TW': '🎉 歡樂派對',
        'zh-CN': '🎉 欢乐派对',
        ja: '🎉 パーティー',
        de: '🎉 Party',
        es: '🎉 Fiesta',
        id: '🎉 Pesta',
        vi: '🎉 Tiệc Tùng'
      },
      effectType: 'confetti',
      premium: false,
      enabled: true
    },
    {
      id: 'pet',
      name: {
        en: '🐾 Pet',
        'zh-TW': '🐾 萌寵',
        'zh-CN': '🐾 萌宠',
        ja: '🐾 ペット',
        de: '🐾 Haustier',
        es: '🐾 Mascota',
        id: '🐾 Hewan Peliharaan',
        vi: '🐾 Thú Cưng'
      },
      effectType: 'paw-prints',
      premium: false,
      enabled: true
    },
    {
      id: 'prank',
      name: {
        en: '⚡ Prank',
        'zh-TW': '⚡ 整人',
        'zh-CN': '⚡ 整人',
        ja: '⚡ いたずら',
        de: '⚡ Streich',
        es: '⚡ Broma',
        id: '⚡ Prank',
        vi: '⚡ Chơi Khăm'
      },
      effectType: 'lightning-face',
      premium: false,
      enabled: true
    }
  ],

  /**
   * ==========================================
   * 廣告系統設定
   * ==========================================
   */
  ads: {
    // 廣告系統是否啟用
    enabled: false,  // 目前階段：false，上線後改為 true
    
    // Google AdSense 發布者 ID（預留）
    // 取得方式：https://www.google.com/adsense/
    adsenseId: null,  // 例如: 'ca-pub-1234567890123456'
    
    // Ad Placement API 設定（預留）
    adPlacementAPI: {
      enabled: false,
      endpoint: null  // 例如: 'https://api.adnetwork.com/v1'
    },
    
    // 廣告顯示頻率設定
    frequency: {
      preroll: 'every_session',      // 前置廣告：每次進入遊戲
      interstitial: 'every_3_levels', // 插頁廣告：每 3 關
      banner: 'always'                // 橫幅廣告：持續顯示
    },
    
    // 廣告位置設定
    placements: {
      lobby: {
        banner: true,           // 大廳橫幅廣告
        bannerId: 'ad-lobby'
      },
      game: {
        banner: true,           // 遊戲中橫幅廣告
        bannerId: 'ad-game',
        preroll: true,          // 遊戲開始前廣告
        interstitial: true,     // 關卡間插頁廣告
        reward: true            // 激勵廣告（復活）
      }
    }
  },

  /**
   * ==========================================
   * 付費系統設定（預留）
   * ==========================================
   */
  payment: {
    // 付費系統是否啟用
    enabled: false,  // 第一階段不啟用
    
    // 支付服務提供商（預留）
    provider: null,  // 例如: 'stripe', 'paypal', 'paddle'
    
    // API 金鑰（預留，實際使用時應從環境變數讀取）
    apiKey: null,
    
    // 付費項目清單
    products: [
      {
        id: 'remove_ads',
        name: {
          en: 'Remove Ads',
          'zh-TW': '移除廣告',
          'zh-CN': '移除广告',
          ja: '広告を削除',
          de: 'Werbung entfernen',
          es: 'Eliminar anuncios',
          id: 'Hapus iklan',
          vi: 'Xóa quảng cáo'
        },
        price: 2.99,
        currency: 'USD',
        type: 'permanent',  // permanent | consumable | subscription
        description: {
          en: 'Remove all ads forever',
          'zh-TW': '永久移除所有廣告',
          'zh-CN': '永久移除所有广告',
          ja: 'すべての広告を永久に削除',
          de: 'Alle Anzeigen dauerhaft entfernen',
          es: 'Eliminar todos los anuncios para siempre',
          id: 'Hapus semua iklan selamanya',
          vi: 'Xóa tất cả quảng cáo vĩnh viễn'
        }
      },
      {
        id: 'theme_pack_1',
        name: {
          en: 'Premium Theme Pack',
          'zh-TW': '進階主題包',
          'zh-CN': '进阶主题包',
          ja: 'プレミアムテーマパック',
          de: 'Premium-Themenpaket',
          es: 'Pack de temas premium',
          id: 'Paket tema premium',
          vi: 'Gói chủ đề cao cấp'
        },
        price: 0.99,
        currency: 'USD',
        type: 'permanent',
        description: {
          en: 'Unlock baby and horror themes',
          'zh-TW': '解鎖寶貝和嚇人主題',
          'zh-CN': '解锁宝贝和吓人主题',
          ja: 'ベビーとホラーテーマのロック解除',
          de: 'Baby- und Horror-Themen freischalten',
          es: 'Desbloquear temas de bebé y terror',
          id: 'Buka tema bayi dan horor',
          vi: 'Mở khóa chủ đề em bé và kinh dị'
        }
      },
      {
        id: 'effect_pack_1',
        name: {
          en: 'Premium Effects Pack',
          'zh-TW': '進階特效包',
          'zh-CN': '进阶特效包',
          ja: 'プレミアムエフェクトパック',
          de: 'Premium-Effektpaket',
          es: 'Pack de efectos premium',
          id: 'Paket efek premium',
          vi: 'Gói hiệu ứng cao cấp'
        },
        price: 0.99,
        currency: 'USD',
        type: 'permanent',
        description: {
          en: 'Unlock special game effects',
          'zh-TW': '解鎖特殊遊戲特效',
          'zh-CN': '解锁特殊游戏特效',
          ja: '特別なゲームエフェクトのロック解除',
          de: 'Spezielle Spieleffekte freischalten',
          es: 'Desbloquear efectos especiales',
          id: 'Buka efek game khusus',
          vi: 'Mở khóa hiệu ứng đặc biệt'
        }
      }
    ]
  },

  /**
   * ==========================================
   * API 設定（後端預留）
   * ==========================================
   */
  api: {
    // 後端 API 基礎 URL
    // null = 使用本地儲存（localStorage）
    // 有值 = 呼叫後端 API
    baseUrl: null,  // 例如: 'https://api.funfacegame.com/v1'
    
    // API 版本
    version: 'v1',
    
    // 請求超時時間（毫秒）
    timeout: 10000,
    
    // 重試次數
    retryAttempts: 3,
    
    // API 端點
    endpoints: {
      user: '/user',
      scores: '/scores',
      leaderboard: '/leaderboard',
      purchases: '/purchases',
      sync: '/sync'
    }
  },

  /**
   * ==========================================
   * Google Analytics 4 設定
   * ==========================================
   */
  analytics: {
    // GA4 是否啟用
    enabled: false,  // 開發階段：false，上線後：true
    
    // GA4 評估 ID（預留）
    // 取得方式：https://analytics.google.com/
    measurementId: null,  // 例如: 'G-XXXXXXXXXX'
    
    // 追蹤的事件類型
    trackEvents: {
      pageView: true,
      gameStart: true,
      gameComplete: true,
      levelComplete: true,
      share: true,
      adShow: true,
      purchase: true,
      pwaInstall: true,
      languageChange: true
    },
    
    // 開發模式（在 console 輸出事件）
    debugMode: true
  },

  /**
   * ==========================================
   * 功能開關
   * ==========================================
   */
  features: {
    // PWA 功能
    pwa: {
      enabled: true,
      installPrompt: true  // 顯示安裝提示
    },
    
    // 照片上傳
    photoUpload: {
      enabled: true,
      maxPhotos: 6,               // 最多上傳 6 張
      maxFileSize: 5 * 1024 * 1024,  // 5MB
      compressQuality: 0.8,       // 壓縮品質 0-1
      outputFormat: 'jpeg',       // 輸出格式
      outputSize: 400             // 輸出尺寸（像素）
    },
    
    // 分享功能
    share: {
      enabled: true,
      platforms: ['instagram', 'facebook', 'tiktok', 'download', 'link'],
      watermark: true  // 分享圖片加浮水印
    },
    
    // 音效
    sound: {
      enabled: false,  // 第一階段不啟用
      defaultVolume: 0.5
    },
    
    // 震動回饋（手機）
    vibration: {
      enabled: true,
      patterns: {
        tap: 50,
        match: [50, 100, 50],
        levelComplete: [100, 200, 100]
      }
    },
    
    // 離線支援
    offline: {
      enabled: true,
      cacheStrategy: 'cache-first'  // cache-first | network-first
    }
  },

  /**
   * ==========================================
   * 儲存設定
   * ==========================================
   */
  storage: {
    // localStorage 鍵名前綴
    prefix: 'funfacegame_',
    
    // 資料版本（用於遷移）
    version: '1.0',
    
    // 資料鍵名
    keys: {
      language: 'language',
      photos: 'photos',
      scores: 'scores',
      purchases: 'purchases',
      settings: 'settings',
      theme: 'theme'
    },
    
    // 快取過期時間（毫秒）
    cacheExpiration: {
      photos: 7 * 24 * 60 * 60 * 1000,    // 7 天
      scores: 30 * 24 * 60 * 60 * 1000,   // 30 天
      settings: Infinity                   // 永不過期
    }
  },

  /**
   * ==========================================
   * 開發/除錯設定
   * ==========================================
   */
  debug: {
    // 是否為開發模式
    enabled: true,  // 部署時設為 false
    
    // Console 日誌等級
    logLevel: 'debug',  // 'debug' | 'info' | 'warn' | 'error' | 'none'
    
    // 顯示效能監控
    showPerformance: true,
    
    // 顯示 FPS 計數器
    showFPS: true,
    
    // 跳過廣告（僅開發模式）
    skipAds: true,
    
    // 解鎖所有付費內容（僅開發模式）
    unlockAllPremium: false
  },

  /**
   * ==========================================
   * 輔助方法
   * ==========================================
   */
  
  /**
   * 取得已啟用的遊戲清單
   * @returns {Array} 已啟用的遊戲陣列
   */
  getEnabledGames: function() {
    return this.games.filter(game => game.enabled);
  },

  /**
   * 取得遊戲資訊
   * @param {string} gameId - 遊戲 ID
   * @returns {Object|null} 遊戲資訊物件或 null
   */
  getGame: function(gameId) {
    return this.games.find(game => game.id === gameId) || null;
  },

  /**
   * 取得已啟用的主題清單
   * @returns {Array} 已啟用的主題陣列
   */
  getEnabledThemes: function() {
    return this.themes.filter(theme => theme.enabled);
  },

  /**
   * 取得主題資訊
   * @param {string} themeId - 主題 ID
   * @returns {Object|null} 主題資訊物件或 null
   */
  getTheme: function(themeId) {
    return this.themes.find(theme => theme.id === themeId) || null;
  },

  /**
   * 檢查是否為開發模式
   * @returns {boolean}
   */
  isDevelopment: function() {
    return this.debug.enabled;
  },

  /**
   * 檢查是否為生產模式
   * @returns {boolean}
   */
  isProduction: function() {
    return !this.debug.enabled;
  },

  /**
   * 取得完整的 API URL
   * @param {string} endpoint - API 端點
   * @returns {string|null} 完整的 URL 或 null（使用本地儲存）
   */
  getApiUrl: function(endpoint) {
    if (!this.api.baseUrl) {
      return null;
    }
    return `${this.api.baseUrl}${endpoint}`;
  },

  /**
   * 記錄日誌（根據設定的日誌等級）
   * @param {string} level - 日誌等級
   * @param {string} message - 訊息
   * @param {*} data - 額外資料
   */
  log: function(level, message, data) {
    if (!this.debug.enabled) return;
    
    const levels = ['debug', 'info', 'warn', 'error', 'none'];
    const currentLevelIndex = levels.indexOf(this.debug.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    if (messageLevelIndex >= currentLevelIndex) {
      const prefix = '[' + this.site.name + ']';
      const timestamp = new Date().toISOString();
      
      switch (level) {
        case 'debug':
          console.debug(prefix + ' [DEBUG] ' + timestamp + ':', message, data || '');
          break;
        case 'info':
          console.info(prefix + ' [INFO] ' + timestamp + ':', message, data || '');
          break;
        case 'warn':
          console.warn(prefix + ' [WARN] ' + timestamp + ':', message, data || '');
          break;
        case 'error':
          console.error(prefix + ' [ERROR] ' + timestamp + ':', message, data || '');
          break;
      }
    }
  }
};

// 凍結設定物件，防止意外修改（開發模式除外）
if (!Config.debug.enabled) {
  Object.freeze(Config);
}

// 輸出設定物件
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Config;
}

// 在開發模式下，將 Config 掛載到 window 方便除錯
if (Config.debug.enabled && typeof window !== 'undefined') {
  window.Config = Config;
  Config.log('info', 'Config loaded', {
    version: Config.site.version,
    enabledGames: Config.getEnabledGames().length,
    enabledThemes: Config.getEnabledThemes().length
  });
}
