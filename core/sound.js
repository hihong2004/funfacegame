/**
 * Fun Face Game - Sound Effects Module
 * 使用 Web Audio API 生成遊戲音效
 */

const SoundManager = {
  // Audio Context
  ctx: null,
  enabled: true,
  volume: 0.5,
  
  // 初始化
  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      console.log('[Sound] Initialized');
    } catch (e) {
      console.warn('[Sound] Web Audio API not supported');
      this.enabled = false;
    }
  },
  
  // 確保 AudioContext 已啟動（需要用戶互動後才能播放）
  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },
  
  // 播放音調
  playTone(frequency, duration, type = 'sine', gainValue = null) {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    
    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    const vol = gainValue !== null ? gainValue : this.volume;
    gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    oscillator.start(this.ctx.currentTime);
    oscillator.stop(this.ctx.currentTime + duration);
  },
  
  // ========== 遊戲音效 ==========
  
  // 點擊/選擇
  click() {
    this.playTone(800, 0.1, 'sine', 0.3);
  },
  
  // 消除音效
  match() {
    this.playTone(523, 0.1, 'sine');  // C5
    setTimeout(() => this.playTone(659, 0.1, 'sine'), 50);  // E5
    setTimeout(() => this.playTone(784, 0.15, 'sine'), 100); // G5
  },
  
  // 連鎖消除
  combo(level = 1) {
    const baseFreq = 523 + (level * 50);
    this.playTone(baseFreq, 0.1, 'sine');
    setTimeout(() => this.playTone(baseFreq * 1.25, 0.1, 'sine'), 60);
    setTimeout(() => this.playTone(baseFreq * 1.5, 0.15, 'sine'), 120);
    setTimeout(() => this.playTone(baseFreq * 2, 0.2, 'sine'), 180);
  },
  
  // 交換音效
  swap() {
    this.playTone(400, 0.08, 'sine', 0.2);
    setTimeout(() => this.playTone(500, 0.08, 'sine', 0.2), 50);
  },
  
  // 無效移動
  invalid() {
    this.playTone(200, 0.15, 'sawtooth', 0.2);
  },
  
  // 掉落音效
  drop() {
    this.playTone(300, 0.05, 'sine', 0.15);
  },
  
  // 過關音效
  levelComplete() {
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.4), i * 100);
    });
  },
  
  // 遊戲結束
  gameOver() {
    this.playTone(400, 0.3, 'sawtooth', 0.3);
    setTimeout(() => this.playTone(300, 0.3, 'sawtooth', 0.3), 200);
    setTimeout(() => this.playTone(200, 0.5, 'sawtooth', 0.3), 400);
  },
  
  // 按鈕音效
  button() {
    this.playTone(600, 0.08, 'sine', 0.25);
  },
  
  // 獎勵音效
  reward() {
    const notes = [784, 988, 1175, 1568]; // G5, B5, D6, G6
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.35), i * 80);
    });
  },
  
  // 主角消除（特殊音效）
  mainCharacterMatch() {
    // 更豐富的音效
    this.playTone(523, 0.1, 'sine', 0.4);
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.4), 50);
    setTimeout(() => this.playTone(784, 0.1, 'sine', 0.4), 100);
    setTimeout(() => this.playTone(1047, 0.2, 'triangle', 0.5), 150);
  },
  
  // 設定音量
  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
  },
  
  // 開關音效
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  },
  
  // 靜音
  mute() {
    this.enabled = false;
  },
  
  // 取消靜音
  unmute() {
    this.enabled = true;
  }
};

// 自動初始化
if (typeof window !== 'undefined') {
  // 等待用戶第一次互動後初始化
  const initOnInteraction = () => {
    SoundManager.init();
    document.removeEventListener('click', initOnInteraction);
    document.removeEventListener('touchstart', initOnInteraction);
  };
  document.addEventListener('click', initOnInteraction);
  document.addEventListener('touchstart', initOnInteraction);
}

// 導出
export { SoundManager };
export default SoundManager;
