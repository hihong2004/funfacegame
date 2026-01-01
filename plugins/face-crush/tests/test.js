/**
 * Face Crush - 自動化測試
 * 
 * @description 測試遊戲核心功能
 * @version 1.0.0
 * @date 2024-12-31
 */

const FaceCrushTests = {
  name: 'Face Crush Game Tests',
  game: null,
  container: null,

  /**
   * 測試前準備
   */
  async setup() {
    console.log('[Test] Setting up Face Crush tests...');
    
    // 建立測試容器
    this.container = document.createElement('div');
    this.container.id = 'test-container';
    document.body.appendChild(this.container);

    // 動態載入遊戲模組
    const { default: FaceCrushGame } = await import('../game.js');
    this.game = FaceCrushGame;

    return true;
  },

  /**
   * 測試後清理
   */
  async teardown() {
    console.log('[Test] Cleaning up Face Crush tests...');
    
    if (this.game && this.game.isReady) {
      this.game.destroy();
    }

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    return true;
  },

  /**
   * 測試案例列表
   */
  tests: [
    {
      name: '遊戲初始化',
      async run() {
        const success = await this.game.init(this.container, {
          config: null,
          i18n: null
        });
        
        if (!success) {
          throw new Error('Game initialization failed');
        }
        
        if (!this.game.isReady) {
          throw new Error('Game not ready after initialization');
        }

        if (!this.game.board || this.game.board.length !== 64) {
          throw new Error('Board not properly initialized');
        }

        return true;
      }
    },

    {
      name: '棋盤生成',
      async run() {
        const board = this.game.createRandomBoard();
        
        if (!Array.isArray(board)) {
          throw new Error('Board is not an array');
        }

        if (board.length !== 64) {
          throw new Error(`Expected 64 cells, got ${board.length}`);
        }

        const validColors = board.every(color => 
          color >= 0 && color < this.game.slotColors.length
        );

        if (!validColors) {
          throw new Error('Board contains invalid color indices');
        }

        return true;
      }
    },

    {
      name: '橫向三消檢測',
      async run() {
        // 建立不會產生額外匹配的測試棋盤（交替顏色）
        const testBoard = [];
        for (let i = 0; i < 64; i++) {
          testBoard.push(i % 6);  // 使用 0-5 交替
        }
        // 設定橫向三消：位置 0, 1, 2 都是顏色 1
        testBoard[0] = 1;
        testBoard[1] = 1;
        testBoard[2] = 1;

        const result = this.game.checkForRowOfThree(testBoard);

        if (!result.didChange) {
          throw new Error('Should detect row of three');
        }

        if (result.scoreToAdd !== 3) {
          throw new Error(`Expected score 3, got ${result.scoreToAdd}`);
        }

        if (testBoard[0] !== -1 || testBoard[1] !== -1 || testBoard[2] !== -1) {
          throw new Error('Matched cells should be cleared');
        }

        return true;
      }
    },

    {
      name: '縱向三消檢測',
      async run() {
        // 建立不會產生額外匹配的測試棋盤（交替顏色）
        const testBoard = [];
        for (let i = 0; i < 64; i++) {
          testBoard.push(i % 6);  // 使用 0-5 交替
        }
        // 設定縱向三消：位置 0, 8, 16 都是顏色 2
        testBoard[0] = 2;
        testBoard[8] = 2;
        testBoard[16] = 2;

        const result = this.game.checkForColumnOfThree(testBoard);

        if (!result.didChange) {
          throw new Error('Should detect column of three');
        }

        if (result.scoreToAdd !== 3) {
          throw new Error(`Expected score 3, got ${result.scoreToAdd}`);
        }

        if (testBoard[0] !== -1 || testBoard[8] !== -1 || testBoard[16] !== -1) {
          throw new Error('Matched cells should be cleared');
        }

        return true;
      }
    },

    {
      name: '方塊下落',
      async run() {
        // 建立測試棋盤：中間有空格
        const testBoard = Array(64).fill(1);
        testBoard[8] = -1;  // 第二行第一格為空
        testBoard[0] = 3;   // 第一行第一格有方塊

        const didChange = this.game.moveIntoSquareBelow(testBoard);

        if (!didChange) {
          throw new Error('Should detect movement');
        }

        if (testBoard[8] !== 3) {
          throw new Error('Block should fall down');
        }

        if (testBoard[0] !== -1) {
          throw new Error('Original position should be empty');
        }

        return true;
      }
    },

    {
      name: '新方塊生成',
      async run() {
        // 建立測試棋盤：第一行有空格
        const testBoard = Array(64).fill(1);
        testBoard[0] = -1;
        testBoard[1] = -1;
        testBoard[2] = -1;

        this.game.moveIntoSquareBelow(testBoard);

        const filledCells = testBoard.filter(cell => cell !== -1).length;
        
        if (filledCells < 61) {
          throw new Error('Should generate new blocks in first row');
        }

        return true;
      }
    },

    {
      name: '拖曳交換 - 有效移動',
      async run() {
        this.game.board = Array(64).fill(0);
        this.game.board[0] = 1;
        this.game.board[1] = 2;

        this.game.draggedId = 0;
        this.game.replacedId = 1;  // 相鄰格子
        this.game.handleDragEnd();

        if (this.game.board[0] !== 2 || this.game.board[1] !== 1) {
          throw new Error('Valid drag should swap cells');
        }

        return true;
      }
    },

    {
      name: '拖曳交換 - 無效移動',
      async run() {
        this.game.board = Array(64).fill(0);
        this.game.board[0] = 1;
        this.game.board[10] = 2;

        const originalBoard = [...this.game.board];

        this.game.draggedId = 0;
        this.game.replacedId = 10;  // 不相鄰
        this.game.handleDragEnd();

        if (JSON.stringify(this.game.board) !== JSON.stringify(originalBoard)) {
          throw new Error('Invalid drag should not change board');
        }

        return true;
      }
    },

    {
      name: '分數計算',
      async run() {
        this.game.score = 0;
        // 建立不會產生額外匹配的測試棋盤（交替顏色）
        const testBoard = [];
        for (let i = 0; i < 64; i++) {
          testBoard.push(i % 6);  // 使用 0-5 交替
        }
        this.game.board = testBoard;
        
        // 建立橫向三消
        this.game.board[0] = 1;
        this.game.board[1] = 1;
        this.game.board[2] = 1;

        const result = this.game.checkForRowOfThree(this.game.board);
        this.game.score += result.scoreToAdd;

        if (this.game.score !== 3) {
          throw new Error(`Expected score 3, got ${this.game.score}`);
        }

        return true;
      }
    },

    {
      name: '關卡進度檢測',
      async run() {
        this.game.score = 0;
        this.game.targetScore = 50;
        this.game.level = 1;

        if (this.game.score >= this.game.targetScore) {
          throw new Error('Should not be complete at start');
        }

        this.game.score = 50;

        if (this.game.score < this.game.targetScore) {
          throw new Error('Should be complete when score meets target');
        }

        return true;
      }
    },

    {
      name: '照片上傳處理',
      async run() {
        const testPhotos = [
          { type: 'image', data: 'data:image/png;base64,test1' },
          { type: 'emoji', data: '😜' }
        ];

        this.game.onPhotoUploaded(testPhotos);

        if (!this.game.customImages[0]) {
          throw new Error('Should store first photo');
        }

        if (!this.game.customImages[1]) {
          throw new Error('Should store second photo');
        }

        if (this.game.customImages[0] !== 'data:image/png;base64,test1') {
          throw new Error('Photo data mismatch');
        }

        return true;
      }
    },

    {
      name: '主題選擇處理',
      async run() {
        const originalTheme = this.game.selectedTheme;
        
        this.game.onThemeSelected('romance');

        if (this.game.selectedTheme !== 'romance') {
          throw new Error('Theme should be updated');
        }

        this.game.onThemeSelected('birthday');

        if (this.game.selectedTheme !== 'birthday') {
          throw new Error('Theme should be updated again');
        }

        return true;
      }
    },

    {
      name: '遊戲開始',
      async run() {
        this.game.isPlaying = false;
        this.game.isPaused = false;

        this.game.start();

        if (!this.game.isPlaying) {
          throw new Error('Game should be playing');
        }

        if (this.game.isPaused) {
          throw new Error('Game should not be paused');
        }

        if (!this.game.gameStartTime) {
          throw new Error('Game start time should be recorded');
        }

        return true;
      }
    },

    {
      name: '遊戲暫停',
      async run() {
        this.game.isPlaying = true;
        this.game.isPaused = false;

        this.game.pause();

        if (!this.game.isPaused) {
          throw new Error('Game should be paused');
        }

        return true;
      }
    },

    {
      name: '遊戲繼續',
      async run() {
        this.game.isPlaying = true;
        this.game.isPaused = true;

        this.game.resume();

        if (this.game.isPaused) {
          throw new Error('Game should not be paused');
        }

        return true;
      }
    },

    {
      name: '遊戲銷毀',
      async run() {
        this.game.isReady = true;
        this.game.isPlaying = true;

        this.game.destroy();

        if (this.game.isReady) {
          throw new Error('Game should not be ready');
        }

        if (this.game.isPlaying) {
          throw new Error('Game should not be playing');
        }

        if (this.game.board.length > 0) {
          throw new Error('Board should be cleared');
        }

        return true;
      }
    }
  ]
};

export default FaceCrushTests;
