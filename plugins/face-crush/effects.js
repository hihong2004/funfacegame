/**
 * Face Crush - 特效系統
 * 
 * @description 處理遊戲中的視覺特效
 * @version 1.0.0
 * @date 2024-12-31
 */

import { Analytics } from '../../core/analytics.js';

const GameEffects = {
  container: null,
  currentEffect: null,

  /**
   * 初始化特效系統
   */
  init(container) {
    this.container = container;
    console.log('[GameEffects] Effects system initialized');
  },

  /**
   * 顯示匹配特效（當三個相同的臉被消除時）
   */
  showMatchEffect(imageData, theme) {
    // 移除現有特效
    this.clearEffect();

    const effectHtml = `
      <div class="match-effect-overlay" id="match-effect">
        <div class="match-effect-content">
          <div class="face-circle">
            <img src="${imageData}" alt="Matched face" class="matched-image" />
            <div class="pulse-ring"></div>
          </div>
          <div class="lightning-strike">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="yellow" stroke="orange" />
            </svg>
          </div>
        </div>
      </div>
    `;

    const effectElement = document.createElement('div');
    effectElement.innerHTML = effectHtml;
    this.container.appendChild(effectElement.firstElementChild);

    // 自動移除特效
    setTimeout(() => this.clearEffect(), 800);
  },

  /**
   * 顯示勝利彈窗
   */
  showWinModal({ level, score, customImages, theme, onNextLevel, onShare }) {
    const themeConfig = this.getThemeConfig(theme);
    const targetImage = customImages[0] || null;

    const modalHtml = `
      <div class="win-modal-overlay" id="win-modal">
        <div class="win-modal">
          <h2 class="win-title">Level Up!</h2>
          <p class="win-subtitle">Level ${level} Complete</p>

          <div class="win-image-container" id="win-image">
            ${targetImage 
              ? `<img src="${targetImage}" alt="Target" class="win-target-image" />`
              : `<div class="win-placeholder">🎯</div>`
            }
            <div class="win-effect-icon">${themeConfig.effectIcon}</div>
            <div class="share-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
            </div>
          </div>

          <p class="win-message">${themeConfig.winMessage}</p>

          <div class="win-buttons">
            <button class="btn-share" id="btn-share">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Share with Friends
            </button>
            <button class="btn-next-level" id="btn-next-level">
              Next Level
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHtml;
    this.container.appendChild(modalElement.firstElementChild);

    // 綁定事件
    document.getElementById('btn-share').onclick = () => {
      this.closeWinModal();
      if (onShare) onShare();
    };

    document.getElementById('btn-next-level').onclick = () => {
      this.closeWinModal();
      if (onNextLevel) onNextLevel();
    };

    document.getElementById('win-image').onclick = () => {
      if (onShare) onShare();
    };
  },

  /**
   * 關閉勝利彈窗
   */
  closeWinModal() {
    const modal = document.getElementById('win-modal');
    if (modal) {
      modal.remove();
    }
  },

  /**
   * 顯示分享彈窗
   */
  showShareModal({ theme, level, score, customImages }) {
    const themeConfig = this.getThemeConfig(theme);
    const targetImage = customImages[0] || null;

    const modalHtml = `
      <div class="share-modal-overlay" id="share-modal">
        <div class="share-modal">
          <button class="close-btn" id="close-share">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <h2 class="share-title">Show Off!</h2>

          <div class="share-preview">
            <div class="share-watermark">
              <div class="watermark-logo">⚡</div>
              <span class="watermark-text">Face Crush</span>
            </div>

            <div class="share-image-container">
              ${targetImage 
                ? `<img src="${targetImage}" alt="Target" class="share-target-image" />`
                : `<div class="share-placeholder">🎯</div>`
              }
              <div class="share-effect-icon">${themeConfig.effectIcon}</div>
            </div>

            <div class="share-info">
              <p class="share-message">${themeConfig.winMessage}</p>
              <p class="share-stats">LEVEL ${level} CLEARED • SCORE ${score}</p>
            </div>
          </div>

          <div class="share-platforms">
            <button class="platform-btn instagram" data-platform="instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>Stories</span>
            </button>

            <button class="platform-btn tiktok" data-platform="tiktok">
              <div class="tiktok-logo">
                <span style="color: #00f2ea;">Tik</span><span style="color: #ff0050;">Tok</span>
              </div>
              <span>Share</span>
            </button>

            <button class="platform-btn facebook" data-platform="facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              <span>Feed</span>
            </button>
          </div>

          <div class="share-actions">
            <button class="action-btn" id="copy-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <span>Copy Link</span>
            </button>

            <button class="action-btn" id="download-image">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHtml;
    this.container.appendChild(modalElement.firstElementChild);

    // 綁定事件
    this.bindShareEvents(theme, level, score);
  },

  /**
   * 綁定分享事件
   */
  bindShareEvents(theme, level, score) {
    // 關閉按鈕
    const closeBtn = document.getElementById('close-share');
    if (closeBtn) {
      closeBtn.onclick = () => this.closeShareModal();
    }

    // 平台分享按鈕
    const platformBtns = document.querySelectorAll('.platform-btn');
    platformBtns.forEach(btn => {
      btn.onclick = () => {
        const platform = btn.dataset.platform;
        this.shareToPlatform(platform, theme, level, score);
      };
    });

    // 複製連結
    const copyLinkBtn = document.getElementById('copy-link');
    if (copyLinkBtn) {
      copyLinkBtn.onclick = () => this.copyShareLink();
    }

    // 下載圖片
    const downloadBtn = document.getElementById('download-image');
    if (downloadBtn) {
      downloadBtn.onclick = () => this.downloadImage();
    }
  },

  /**
   * 分享到平台
   */
  shareToPlatform(platform, theme, level, score) {
    console.log(`[GameEffects] Sharing to ${platform}`);
    
    // 追蹤分享事件
    Analytics.track('share', {
      game_id: 'face-crush',
      platform: platform,
      theme: theme,
      level: level,
      score: score
    });

    // 模擬分享（實際實作需要整合各平台 SDK）
    alert(`已開啟 ${platform.toUpperCase()} APP 並帶入圖片與文案！(模擬)`);
  },

  /**
   * 複製分享連結
   */
  copyShareLink() {
    const link = 'https://facecrush.game/share/12345';
    navigator.clipboard.writeText(link).then(() => {
      // 追蹤複製連結
      Analytics.track('share', {
        game_id: 'face-crush',
        platform: 'copy_link'
      });
      
      // 顯示複製成功提示
      const copyBtn = document.getElementById('copy-link');
      if (copyBtn) {
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Copied!</span>
        `;
        
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
        }, 2000);
      }
    });
  },

  /**
   * 下載圖片
   */
  downloadImage() {
    console.log('[GameEffects] Downloading image...');
    
    // 追蹤下載
    Analytics.track('share', {
      game_id: 'face-crush',
      platform: 'download'
    });
    
    alert('下載功能即將推出！');
  },

  /**
   * 關閉分享彈窗
   */
  closeShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) {
      modal.remove();
    }
  },

  /**
   * 清除當前特效
   */
  clearEffect() {
    const effect = document.getElementById('match-effect');
    if (effect) {
      effect.remove();
    }
  },

  /**
   * 取得主題配置
   */
  getThemeConfig(themeId) {
    const themes = {
      birthday: {
        effectIcon: '🎂',
        winMessage: 'Happy Birthday! 🎂'
      },
      romance: {
        effectIcon: '💖',
        winMessage: 'I love you! 💖'
      },
      party: {
        effectIcon: '🎉',
        winMessage: "Let's Party! 🎉"
      },
      pet: {
        effectIcon: '🐾',
        winMessage: "You're pawsome! 🐾"
      },
      prank: {
        effectIcon: '⚡',
        winMessage: 'Gotcha! ⚡'
      }
    };

    return themes[themeId] || themes.birthday;
  }
};

export default GameEffects;
