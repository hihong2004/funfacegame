/**
 * Face Crush - 遊戲邏輯模組
 * 
 * @description Match-3 消除遊戲核心邏輯
 * @version 1.0.0
 * @date 2024-12-31
 */

import { Storage } from '../../core/storage.js';
import { Analytics } from '../../core/analytics.js';
import { Ads } from '../../core/ads.js';
import GameEffects from './effects.js';

const FaceCrushGame = {
  // ========== 必要屬性 ==========
  id: 'face-crush',
  name: 'Face Crush',
  version: '1.0.0',
  isReady: false,
  isPlaying: false,
  isPaused: false,

  // ========== 遊戲狀態 ==========
  container: null,
  config: null,
  i18n: null,
  
  // 遊戲數據
  board: [],
  boardSize: 8,
  score: 0,
  level: 1,
  targetScore: 50,
  customImages: {},
  selectedTheme: 'birthday',
  matchCount: 0, // 追蹤匹配次數
  
  // 拖曳狀態
  draggedId: null,
  replacedId: null,
  
  // 遊戲計時器
  gameTimer: null,
  gameStartTime: null,
  
  // UI 元素
  elements: {
    gameArea: null,
    boardElement: null,
    scoreDisplay: null,
    levelDisplay: null,
    targetDisplay: null,
    progressBar: null
  },

  // 配色方案
  slotColors: [
    '#FF5733', // Slot 0: RED (主角位置)
    '#33FF57', // Green
    '#3357FF', // Blue
    '#F333FF', // Purple
    '#FF33A8', // Pink
    '#FFC300'  // Yellow
  ],

  // ========== 生命週期方法 ==========

  /**
   * 初始化遊戲
   */
  async init(container, options = {}) {
    try {
      console.log('[FaceCrush] Initializing game...');
      
      this.container = container;
      this.config = options.config;
      this.i18n = options.i18n;
      
      // 載入配置
      await this.loadConfig();
      
      // 載入已儲存的照片
      this.loadPhotos();
      
      // 載入已儲存的主題
      this.loadTheme();
      
      // 初始化特效系統
      GameEffects.init(this.container);
      
      // 建立遊戲 UI
      this.createGameUI();
      
      // 初始化棋盤
      this.resetBoard();
      
      this.isReady = true;
      console.log('[FaceCrush] Game initialized successfully');
      
      return true;
    } catch (error) {
      console.error('[FaceCrush] Initialization failed:', error);
      return false;
    }
  },

  /**
   * 載入遊戲配置
   */
  async loadConfig() {
    try {
      const response = await fetch('/plugins/face-crush/config.json');
      const gameConfig = await response.json();
      
      this.boardSize = gameConfig.settings.boardSize;
      this.slotColors = gameConfig.settings.slotColors;
      
      console.log('[FaceCrush] Config loaded:', gameConfig);
    } catch (error) {
      console.warn('[FaceCrush] Failed to load config, using defaults:', error);
    }
  },

  /**
   * 載入已儲存的照片
   */
  loadPhotos() {
    const savedPhotos = Storage.get('photos');
    if (savedPhotos && Array.isArray(savedPhotos)) {
      savedPhotos.forEach((photo, index) => {
        if (photo && photo.data) {
          this.customImages[index] = photo.data;
        }
      });
      console.log('[FaceCrush] Loaded photos:', Object.keys(this.customImages).length);
    }
  },

  /**
   * 載入已儲存的主題
   */
  loadTheme() {
    const savedTheme = Storage.get('theme');
    if (savedTheme) {
      this.selectedTheme = savedTheme;
      console.log('[FaceCrush] Loaded theme:', savedTheme);
    }
  },

  /**
   * 開始遊戲
   */
  async start() {
    if (!this.isReady) {
      console.error('[FaceCrush] Game not ready!');
      return false;
    }

    console.log('[FaceCrush] Starting game...');
    
    // 檢查是否要顯示前置廣告（僅第一次）
    if (this.level === 1) {
      const shouldShowPreroll = Ads && Ads.shouldShow && Ads.shouldShow('preroll');
      if (shouldShowPreroll) {
        console.log('[FaceCrush] Showing preroll ad...');
        try {
          await Ads.show('preroll');
          Analytics.track('ad_shown', {
            game_id: this.id,
            ad_type: 'preroll',
            level: this.level
          });
        } catch (error) {
          console.warn('[FaceCrush] Preroll ad failed:', error);
        }
      }
    }
    
    this.isPlaying = true;
    this.isPaused = false;
    this.gameStartTime = Date.now();
    
    // 開始遊戲循環
    this.startGameLoop();
    
    // 追蹤遊戲開始（增強版）
    Analytics.track('game_start', {
      game_id: this.id,
      theme: this.selectedTheme,
      level: this.level,
      custom_images_count: Object.keys(this.customImages).length,
      target_score: this.targetScore
    });
    
    return true;
  },

  /**
   * 暫停遊戲
   */
  pause() {
    if (!this.isPlaying || this.isPaused) return;
    
    this.isPaused = true;
    this.stopGameLoop();
    
    Analytics.track('game_pause', {
      game_id: this.id,
      level: this.level,
      score: this.score,
      play_time: Date.now() - this.gameStartTime
    });
    
    console.log('[FaceCrush] Game paused');
  },

  /**
   * 繼續遊戲
   */
  resume() {
    if (!this.isPaused) return;
    
    this.isPaused = false;
    this.startGameLoop();
    
    Analytics.track('game_resume', {
      game_id: this.id,
      level: this.level,
      score: this.score
    });
    
    console.log('[FaceCrush] Game resumed');
  },

  /**
   * 銷毀遊戲
   */
  destroy() {
    console.log('[FaceCrush] Destroying game...');
    
    // 追蹤遊戲結束
    if (this.isPlaying) {
      const playTime = Date.now() - this.gameStartTime;
      Analytics.track('game_end', {
        game_id: this.id,
        level: this.level,
        score: this.score,
        play_time: playTime,
        reason: 'destroy'
      });
    }
    
    this.stopGameLoop();
    
    // 清理 UI
    if (this.container) {
      this.container.innerHTML = '';
    }
    
    // 重置狀態
    this.isReady = false;
    this.isPlaying = false;
    this.isPaused = false;
    this.board = [];
    this.score = 0;
    
    console.log('[FaceCrush] Game destroyed');
  },

  // ========== 遊戲邏輯 ==========

  /**
   * 建立隨機棋盤
   */
  createRandomBoard() {
    const board = [];
    const totalCells = this.boardSize * this.boardSize;
    
    for (let i = 0; i < totalCells; i++) {
      const randomColor = Math.floor(Math.random() * this.slotColors.length);
      board.push(randomColor);
    }
    
    return board;
  },

  /**
   * 重置棋盤
   */
  resetBoard() {
    this.board = this.createRandomBoard();
    this.score = 0;
    this.matchCount = 0; // 重置匹配計數
    this.updateUI();
  },

  /**
   * 檢查縱向三連消
   */
  checkForColumnOfThree(board) {
    let didChange = false;
    let scoreToAdd = 0;
    let matchedImage = null;
    const width = this.boardSize;
    const maxIndex = width * (width - 2) - 1; // 8x8 棋盤 = 47

    for (let i = 0; i <= maxIndex; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = board[i];
      const isBlank = board[i] === -1;

      if (columnOfThree.every(square => board[square] === decidedColor && !isBlank)) {
        // 檢查是否有自訂圖片
        if (this.customImages[decidedColor] && !matchedImage) {
          matchedImage = {
            image: this.customImages[decidedColor],
            colorIndex: decidedColor
          };
        }

        // 清除三連消的格子
        columnOfThree.forEach(square => (board[square] = -1));
        scoreToAdd += 3;
        didChange = true;
      }
    }

    return { didChange, scoreToAdd, matchedImage };
  },

  /**
   * 檢查橫向三連消
   */
  checkForRowOfThree(board) {
    let didChange = false;
    let scoreToAdd = 0;
    let matchedImage = null;
    const width = this.boardSize;
    const totalCells = width * width;

    for (let i = 0; i < totalCells; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = board[i];
      const isBlank = board[i] === -1;

      // 排除跨行的情況（每行的最後兩個位置）
      const notValid = [];
      for (let row = 0; row < width; row++) {
        notValid.push(row * width + width - 2);  // 倒數第二個
        notValid.push(row * width + width - 1);  // 最後一個
      }
      if (notValid.includes(i)) continue;

      if (rowOfThree.every(square => board[square] === decidedColor && !isBlank)) {
        // 檢查是否有自訂圖片
        if (this.customImages[decidedColor] && !matchedImage) {
          matchedImage = {
            image: this.customImages[decidedColor],
            colorIndex: decidedColor
          };
        }

        // 清除三連消的格子
        rowOfThree.forEach(square => (board[square] = -1));
        scoreToAdd += 3;
        didChange = true;
      }
    }

    return { didChange, scoreToAdd, matchedImage };
  },

  /**
   * 方塊下落填補空缺
   */
  moveIntoSquareBelow(board) {
    let didChange = false;
    const width = this.boardSize;
    const maxIndex = width * (width - 1) - 1; // 不包含最後一行

    for (let i = 0; i <= maxIndex; i++) {
      // 建立第一行的索引陣列
      const firstRow = [];
      for (let j = 0; j < width; j++) {
        firstRow.push(j);
      }
      const isFirstRow = firstRow.includes(i);

      // 如果是第一行且為空，生成新方塊
      if (isFirstRow && board[i] === -1) {
        const randomNumber = Math.floor(Math.random() * this.slotColors.length);
        board[i] = randomNumber;
        didChange = true;
      }

      // 如果下方為空，將當前方塊下移
      if (board[i + width] === -1) {
        board[i + width] = board[i];
        board[i] = -1;
        didChange = true;
      }
    }

    return didChange;
  },

  /**
   * 遊戲主循環
   */
  gameLoop() {
    if (!this.isPlaying || this.isPaused) return;

    const newBoard = [...this.board];

    // 檢查消除
    const colResult = this.checkForColumnOfThree(newBoard);
    const rowResult = this.checkForRowOfThree(newBoard);

    // 顯示匹配特效
    const matchedImage = colResult.matchedImage || rowResult.matchedImage;
    if (matchedImage) {
      this.showMatchEffect(matchedImage);
    }

    // 更新分數
    if (colResult.didChange || rowResult.didChange) {
      this.score += colResult.scoreToAdd + rowResult.scoreToAdd;
      this.matchCount++;
      
      // 每 10 次匹配追蹤一次（避免過於頻繁）
      if (this.matchCount % 10 === 0) {
        Analytics.track('match_milestone', {
          game_id: this.id,
          level: this.level,
          match_count: this.matchCount,
          score: this.score
        });
      }
      
      this.board = newBoard;
      this.updateUI();
      this.checkLevelComplete();
      return;
    }

    // 方塊下落
    const moveResult = this.moveIntoSquareBelow(newBoard);
    if (moveResult) {
      this.board = newBoard;
      this.updateUI();
    }
  },

  /**
   * 開始遊戲循環
   */
  startGameLoop() {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
    this.gameTimer = setInterval(() => this.gameLoop(), 100);
  },

  /**
   * 停止遊戲循環
   */
  stopGameLoop() {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
  },

  /**
   * 顯示匹配特效
   */
  showMatchEffect(matchData) {
    GameEffects.showMatchEffect(matchData.image, this.selectedTheme);
    
    // 震動回饋
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  },

  /**
   * 檢查關卡完成
   */
  checkLevelComplete() {
    if (this.score >= this.targetScore) {
      this.levelComplete();
    }
  },

  /**
   * 關卡完成
   */
  levelComplete() {
    this.pause();
    
    const playTime = Date.now() - this.gameStartTime;
    
    // 顯示過關特效
    GameEffects.showWinModal({
      level: this.level,
      score: this.score,
      customImages: this.customImages,
      theme: this.selectedTheme,
      onNextLevel: () => this.nextLevel(),
      onShare: () => this.openShareModal()
    });
    
    // 追蹤關卡完成
    Analytics.track('level_complete', {
      game_id: this.id,
      level: this.level,
      score: this.score,
      time: playTime,
      theme: this.selectedTheme
    });
  },

  /**
   * 下一關
   */
  async nextLevel() {
    // 每 3 關顯示插頁廣告
    if (this.level % 3 === 0) {
      const shouldShowInterstitial = Ads && Ads.shouldShow && Ads.shouldShow('interstitial');
      if (shouldShowInterstitial) {
        console.log('[FaceCrush] Showing interstitial ad...');
        try {
          await Ads.show('interstitial');
          Analytics.track('ad_shown', {
            game_id: this.id,
            ad_type: 'interstitial',
            level: this.level
          });
        } catch (error) {
          console.warn('[FaceCrush] Interstitial ad failed:', error);
        }
      }
    }
    
    this.level++;
    this.targetScore = this.level * 30 + 20;
    this.resetBoard();
    await this.start();
  },

  /**
   * 打開分享彈窗
   */
  openShareModal() {
    GameEffects.showShareModal({
      theme: this.selectedTheme,
      level: this.level,
      score: this.score,
      customImages: this.customImages
    });
  },

  // ========== 拖曳處理 ==========

  /**
   * 開始拖曳
   */
  handleDragStart(index) {
    this.draggedId = index;
  },

  /**
   * 拖曳進入
   */
  handleDragEnter(index) {
    this.replacedId = index;
  },

  /**
   * 拖曳結束
   */
  handleDragEnd() {
    if (this.draggedId === null || this.replacedId === null) {
      this.draggedId = null;
      this.replacedId = null;
      return;
    }

    const width = this.boardSize;
    const validMoves = [
      this.draggedId - 1,
      this.draggedId - width,
      this.draggedId + 1,
      this.draggedId + width
    ];

    const validMove = validMoves.includes(this.replacedId);

    if (validMove) {
      // 交換方塊
      const newBoard = [...this.board];
      const temp = newBoard[this.draggedId];
      newBoard[this.draggedId] = newBoard[this.replacedId];
      newBoard[this.replacedId] = temp;
      this.board = newBoard;
      this.updateUI();
    }

    this.draggedId = null;
    this.replacedId = null;
  },

  // ========== UI 相關 ==========

  /**
   * 建立遊戲 UI
   */
  createGameUI() {
    this.container.innerHTML = `
      <div class="face-crush-game">
        <!-- 遊戲主要區域 -->
        <div id="game-area" class="game-area">
          <!-- 分數與進度 -->
          <div class="game-stats">
            <div class="level-info">
              <span class="label">Level</span>
              <span id="level-display" class="value">${this.level}</span>
            </div>
            <div class="score-info">
              <span class="label">Score</span>
              <span id="score-display" class="value">${this.score}</span>
            </div>
            <div class="target-info">
              <span class="label">Target</span>
              <span id="target-display" class="value">${this.targetScore}</span>
            </div>
          </div>

          <!-- 進度條 -->
          <div class="progress-container">
            <div id="progress-bar" class="progress-bar" style="width: 0%"></div>
          </div>

          <!-- 遊戲棋盤 -->
          <div id="board" class="game-board"></div>
        </div>

        <!-- 特效容器 -->
        <div id="effects-container" class="effects-container"></div>
      </div>
    `;

    // 儲存 UI 元素參考
    this.elements.gameArea = document.getElementById('game-area');
    this.elements.boardElement = document.getElementById('board');
    this.elements.scoreDisplay = document.getElementById('score-display');
    this.elements.levelDisplay = document.getElementById('level-display');
    this.elements.targetDisplay = document.getElementById('target-display');
    this.elements.progressBar = document.getElementById('progress-bar');

    // 渲染棋盤
    this.renderBoard();
  },

  /**
   * 渲染棋盤
   */
  renderBoard() {
    if (!this.elements.boardElement) return;

    const boardHTML = this.board.map((colorIndex, index) => {
      if (colorIndex === -1) {
        return '<div class="cell empty"></div>';
      }

      const hasCustomImage = this.customImages[colorIndex];
      const backgroundColor = this.slotColors[colorIndex];

      return `
        <div 
          class="cell ${colorIndex === 0 ? 'target-cell' : ''}"
          data-index="${index}"
          draggable="true"
          style="background-color: ${hasCustomImage ? 'transparent' : backgroundColor}"
        >
          ${hasCustomImage 
            ? `<img src="${this.customImages[colorIndex]}" class="cell-image" alt="custom" />`
            : `<div class="cell-color"></div>`
          }
        </div>
      `;
    }).join('');

    this.elements.boardElement.innerHTML = boardHTML;

    // 綁定拖曳事件
    this.bindDragEvents();
  },

  /**
   * 綁定拖曳事件
   */
  bindDragEvents() {
    const cells = this.elements.boardElement.querySelectorAll('.cell');
    
    cells.forEach((cell, index) => {
      cell.addEventListener('dragstart', () => this.handleDragStart(index));
      cell.addEventListener('dragenter', () => this.handleDragEnter(index));
      cell.addEventListener('dragend', () => this.handleDragEnd());
      cell.addEventListener('dragover', (e) => e.preventDefault());
    });
  },

  /**
   * 更新 UI
   */
  updateUI() {
    // 更新分數
    if (this.elements.scoreDisplay) {
      this.elements.scoreDisplay.textContent = this.score;
    }

    // 更新關卡
    if (this.elements.levelDisplay) {
      this.elements.levelDisplay.textContent = this.level;
    }

    // 更新目標
    if (this.elements.targetDisplay) {
      this.elements.targetDisplay.textContent = this.targetScore;
    }

    // 更新進度條
    if (this.elements.progressBar) {
      const progress = Math.min((this.score / this.targetScore) * 100, 100);
      this.elements.progressBar.style.width = `${progress}%`;
    }

    // 重新渲染棋盤
    this.renderBoard();
  },

  // ========== 事件回調 ==========

  /**
   * 照片上傳完成
   */
  onPhotoUploaded(photos) {
    console.log('[FaceCrush] Photos uploaded:', photos);
    
    if (photos && Array.isArray(photos)) {
      photos.forEach((photo, index) => {
        if (photo && photo.data) {
          this.customImages[index] = photo.data;
        }
      });
      
      this.updateUI();
    }
  },

  /**
   * 主題選擇完成
   */
  onThemeSelected(theme) {
    console.log('[FaceCrush] Theme selected:', theme);
    this.selectedTheme = theme;
    Storage.set('theme', theme);
  }
};

export default FaceCrushGame;
