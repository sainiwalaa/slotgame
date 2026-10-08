/**
 * Color Spin Match – 100 Levels
 * Complete Modular Arcade Slot Puzzle Game Engine
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, type, duration, gainStart = 0.15, gainEnd = 0.001) {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainStart, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(Math.max(gainEnd, 0.0001), this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio error suppression
      }
    }

    playClick() {
      this.playTone(600, 'triangle', 0.05, 0.1, 0.01);
    }

    playSpinTick() {
      this.playTone(320 + Math.random() * 80, 'sine', 0.04, 0.08, 0.01);
    }

    playReelStop(reelIndex) {
      const baseFreq = 220 + reelIndex * 50;
      this.playTone(baseFreq, 'triangle', 0.1, 0.2, 0.01);
    }

    playMatch(count) {
      if (!this.enabled || !this.ctx) return;
      const notes = [440, 554, 659, 880];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 'sine', 0.18, 0.15, 0.01);
        }, i * 70);
      });
    }

    playSuperMatch() {
      if (!this.enabled || !this.ctx) return;
      const notes = [523, 659, 784, 1046, 1318];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.22, 0.2, 0.01);
        }, i * 60);
      });
    }

    playMegaMatch() {
      if (!this.enabled || !this.ctx) return;
      const notes = [440, 554, 659, 880, 1108, 1318, 1760];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 'sawtooth', 0.28, 0.18, 0.01);
        }, i * 50);
      });
    }

    playCoin() {
      this.playTone(987, 'sine', 0.08, 0.15, 0.01);
      setTimeout(() => this.playTone(1318, 'sine', 0.12, 0.15, 0.01), 60);
    }

    playVictory() {
      if (!this.enabled || !this.ctx) return;
      const fanfare = [
        { f: 523, d: 0.12 }, { f: 659, d: 0.12 }, { f: 784, d: 0.16 },
        { f: 1046, d: 0.35 }
      ];
      let t = 0;
      fanfare.forEach(note => {
        setTimeout(() => this.playTone(note.f, 'triangle', note.d, 0.25, 0.01), t * 1000);
        t += note.d + 0.03;
      });
    }

    playDefeat() {
      this.playTone(350, 'sawtooth', 0.2, 0.18, 0.01);
      setTimeout(() => this.playTone(280, 'sawtooth', 0.35, 0.18, 0.01), 220);
    }
  }

  const sound = new SoundEngine();

  // --- PARTICLE SIMULATOR ---
  class ParticleEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.particles = [];
      this.active = false;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    burst(x, y, count = 25, colors = ['#facc15', '#38bdf8', '#ec4899', '#10b981']) {
      if (!this.ctx) return;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 7;
        this.particles.push({
          x: x || this.canvas.width / 2,
          y: y || this.canvas.height / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          radius: 3 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.015 + Math.random() * 0.02,
          gravity: 0.18
        });
      }
      if (!this.active) {
        this.active = true;
        this.loop();
      }
    }

    loop() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        requestAnimationFrame(() => this.loop());
      } else {
        this.active = false;
      }
    }
  }

  const particles = new ParticleEngine('particles-canvas');

  // --- THE 20 WORLD DEFINITIONS & THEMES ---
  const WORLD_THEMES = {
    water: {
      name: "Water World",
      icon: "💧",
      colors: ["#07192f", "#0c2d48", "#145da0"],
      primary: "#06b6d4",
      accent: "#38bdf8",
      rim: "#0284c7"
    },
    machine: {
      name: "Machine World",
      icon: "🔩",
      colors: ["#1e1b18", "#2d241e", "#443525"],
      primary: "#d97706",
      accent: "#f59e0b",
      rim: "#b45309"
    },
    water_machine: {
      name: "Water + Machine",
      icon: "⚙️💧",
      colors: ["#0f172a", "#1e293b", "#0369a1"],
      primary: "#38bdf8",
      accent: "#f59e0b",
      rim: "#0284c7"
    },
    fire: {
      name: "Fire World",
      icon: "🔥",
      colors: ["#2d0a0a", "#4a0e0e", "#7f1d1d"],
      primary: "#ef4444",
      accent: "#f97316",
      rim: "#b91c1c"
    },
    fire_water: {
      name: "Fire + Water",
      icon: "🔥💧",
      colors: ["#2d0e22", "#450a0a", "#0c2d48"],
      primary: "#f43f5e",
      accent: "#06b6d4",
      rim: "#e11d48"
    },
    ice: {
      name: "Ice World",
      icon: "❄️",
      colors: ["#081729", "#0f2b48", "#1e40af"],
      primary: "#67e8f9",
      accent: "#c084fc",
      rim: "#0284c7"
    },
    ice_fire: {
      name: "Ice + Fire",
      icon: "❄️🔥",
      colors: ["#1c0c29", "#2d0b1a", "#082f49"],
      primary: "#38bdf8",
      accent: "#f97316",
      rim: "#7c3aed"
    },
    forest: {
      name: "Forest World",
      icon: "🍃",
      colors: ["#052e16", "#14532d", "#166534"],
      primary: "#10b981",
      accent: "#84cc16",
      rim: "#059669"
    },
    forest_water: {
      name: "Forest + Water",
      icon: "🍃💧",
      colors: ["#064e3b", "#065f46", "#0284c7"],
      primary: "#34d399",
      accent: "#38bdf8",
      rim: "#059669"
    },
    candy: {
      name: "Candy World",
      icon: "🍭",
      colors: ["#2c0b24", "#4a044e", "#701a75"],
      primary: "#ec4899",
      accent: "#facc15",
      rim: "#db2777"
    },
    candy_water: {
      name: "Candy + Water",
      icon: "🍭💧",
      colors: ["#3b0764", "#4c0519", "#0369a1"],
      primary: "#f472b6",
      accent: "#38bdf8",
      rim: "#c026d3"
    },
    space: {
      name: "Space World",
      icon: "🪐",
      colors: ["#09090b", "#18181b", "#27272a"],
      primary: "#a855f7",
      accent: "#38bdf8",
      rim: "#7e22ce"
    },
    space_fire: {
      name: "Space + Fire",
      icon: "🚀🔥",
      colors: ["#180828", "#3b0764", "#7f1d1d"],
      primary: "#c084fc",
      accent: "#ef4444",
      rim: "#9333ea"
    },
    desert: {
      name: "Desert World",
      icon: "🏜️",
      colors: ["#291a0a", "#452205", "#78350f"],
      primary: "#f59e0b",
      accent: "#eab308",
      rim: "#d97706"
    },
    desert_water: {
      name: "Desert + Water",
      icon: "🏜️💧",
      colors: ["#2d1b0a", "#451a03", "#0e7490"],
      primary: "#fbbf24",
      accent: "#22d3ee",
      rim: "#b45309"
    },
    robot: {
      name: "Robot World",
      icon: "🤖",
      colors: ["#0f172a", "#1e293b", "#334155"],
      primary: "#06b6d4",
      accent: "#10b981",
      rim: "#0284c7"
    },
    robot_water: {
      name: "Robot + Water",
      icon: "🤖💧",
      colors: ["#082f49", "#0f172a", "#0284c7"],
      primary: "#38bdf8",
      accent: "#34d399",
      rim: "#0369a1"
    },
    rainbow: {
      name: "Rainbow World",
      icon: "🌈",
      colors: ["#1e1b4b", "#311042", "#4a044e"],
      primary: "#f43f5e",
      accent: "#facc15",
      rim: "#8b5cf6"
    },
    ultimate: {
      name: "Ultimate Mix",
      icon: "👑",
      colors: ["#111827", "#1f2937", "#374151"],
      primary: "#ec4899",
      accent: "#f59e0b",
      rim: "#6366f1"
    },
    finale: {
      name: "Grand Finale",
      icon: "🏆",
      colors: ["#0f172a", "#3b0764", "#701a75"],
      primary: "#facc15",
      accent: "#38bdf8",
      rim: "#e11d48"
    }
  };

  // --- 100 LEVEL CONFIGURATIONS GENERATOR (SPEC-PRECISE) ---
  function buildAll100Levels() {
    const list = [];

    // Helper to select symbol palette
    const symSets = {
      water: ['💧', '🫧', '🐟', '🐚', '⭐', '💎'],
      machine: ['🔩', '⚙️', '🔧', '🧲', '🔗', '🪙'],
      water_machine: ['💧', '🫧', '🐟', '🔩', '⚙️', '🧲', '💎'],
      fire: ['🔥', '🌋', '☄️', '💎', '☀️', '🪨'],
      fire_water: ['🔥', '💧', '🌋', '🐟', '💎', '☀️'],
      ice: ['❄️', '🧊', '💎', '🌙', '⭐', '⛄'],
      ice_fire: ['❄️', '🧊', '🔥', '🌋', '💎', '⭐'],
      forest: ['🍃', '🍎', '🌸', '🍄', '🐝', '💚'],
      forest_water: ['🍃', '🌸', '🐟', '💧', '🫧', '💚'],
      candy: ['🍭', '🍬', '🍩', '🍓', '🧁', '🍫'],
      candy_water: ['🍭', '🍬', '🍓', '💧', '🫧', '💎'],
      space: ['⭐', '🌙', '🪐', '🚀', '☄️', '💜'],
      space_fire: ['🚀', '⭐', '☄️', '🔥', '🌋', '💎'],
      desert: ['🌵', '☀️', '🏜️', '🦂', '🪙', '💎'],
      desert_water: ['🌵', '☀️', '💧', '🐚', '💎', '🪙'],
      robot: ['🤖', '⚙️', '🔋', '🔩', '🧲', '💡'],
      robot_water: ['🤖', '⚙️', '🔩', '💧', '🫧', '🔋'],
      rainbow: ['🌈', '⭐', '💎', '🦋', '☀️', '🌙'],
      ultimate: ['💧', '🔩', '🔥', '❄️', '🍭', '⭐', '🤖', '💎', '🌈'],
      finale: ['💧', '🔩', '🔥', '❄️', '🍭', '🚀', '🤖', '🌈', '💎']
    };

    const worldKeys = [
      'water', 'machine', 'water_machine', 'fire', 'fire_water',
      'ice', 'ice_fire', 'forest', 'forest_water', 'candy',
      'candy_water', 'space', 'space_fire', 'desert', 'desert_water',
      'robot', 'robot_water', 'rainbow', 'ultimate', 'finale'
    ];

    for (let i = 1; i <= 100; i++) {
      const worldIdx = Math.floor((i - 1) / 5);
      const themeKey = worldKeys[Math.min(worldIdx, worldKeys.length - 1)];
      const subLevel = ((i - 1) % 5) + 1;

      // Base reels: 3 for 1-4, 4 for 5-9, 5 for 10+, with scaling
      let reels = 3;
      if (i >= 5 && i <= 9) reels = 4;
      else if (i >= 10 && i < 20) reels = subLevel === 5 ? 5 : 4;
      else if (i >= 20 && i < 50) reels = subLevel >= 4 ? 5 : 4;
      else if (i >= 50) reels = 5;

      // Moves scaling: Starts at 10, slightly tightens, then eases for 5 reels
      let moves = 10;
      if (subLevel === 3 || subLevel === 4) moves = 9;
      if (reels === 5) moves = subLevel === 5 ? 12 : 10;
      if (i >= 90) moves = 11;
      if (i === 100) moves = 14;

      // Target scaling: Starts at 500, steadily escalates to 15,000+
      let baseTarget = 500 + (i - 1) * 220;
      if (i >= 10) baseTarget += (i - 10) * 80;
      if (i >= 50) baseTarget += (i - 50) * 120;
      if (i === 100) baseTarget = 25000;

      // Special mechanics tags
      const specialMechanics = [];
      if (themeKey === 'water' && i >= 4) specialMechanics.push('water_wild');
      if (themeKey === 'machine' && (i === 7 || i === 9)) specialMechanics.push('locked_screws');
      if (themeKey === 'machine' && i >= 8) specialMechanics.push('magnet_wild');
      if (themeKey === 'fire_water') specialMechanics.push('fire_vs_water');
      if (themeKey === 'ice_fire') specialMechanics.push('melt_freeze');
      if (themeKey === 'robot_water') specialMechanics.push('water_battery');
      if (themeKey === 'rainbow' || i >= 86) specialMechanics.push('rainbow_wild');
      if (i >= 90) specialMechanics.push('super_wild', 'locked_screws', 'mystery');
      if (i === 100) specialMechanics.push('all_specials');

      list.push({
        level: i,
        theme: themeKey,
        reels: reels,
        moves: moves,
        target: Math.round(baseTarget),
        symbols: symSets[themeKey] || symSets.water,
        mechanics: specialMechanics
      });
    }

    return list;
  }

  const LEVELS = buildAll100Levels();

  // --- GAME STATE ---
  const state = {
    currentLevel: 1,
    unlockedLevel: 1,
    coins: 500,
    score: 0,
    moves: 10,
    target: 500,
    combo: 0,
    isSpinning: false,
    autoSpin: false,
    completedLevels: {},
    levelStars: {},
    highScores: {},
    currentReelSymbols: [],
    lockedCells: {},
    soundOn: true
  };

  // --- DOM CACHE ---
  const DOM = {
    screenHome: document.getElementById('screen-home'),
    screenLevelSelect: document.getElementById('screen-level-select'),
    screenGame: document.getElementById('screen-game'),
    homeCoins: document.getElementById('home-coins'),
    homeStars: document.getElementById('home-stars'),
    homeLevelProgress: document.getElementById('home-level-progress'),
    homeSoundIcon: document.getElementById('home-sound-icon'),
    worldFilterBar: document.getElementById('world-filter-bar'),
    levelGrid: document.getElementById('level-grid'),
    navCoinVal: document.querySelector('.nav-coin-val'),
    hudThemeBadge: document.getElementById('hud-theme-badge'),
    hudLevelText: document.getElementById('hud-level-text'),
    hudCoins: document.getElementById('hud-coins'),
    hudTarget: document.getElementById('hud-target'),
    hudScore: document.getElementById('hud-score'),
    hudScoreFill: document.getElementById('hud-score-fill'),
    hudMoves: document.getElementById('hud-moves'),
    comboBanner: document.getElementById('combo-banner'),
    eventBanner: document.getElementById('event-banner'),
    slotCabinet: document.getElementById('slot-cabinet'),
    reelsContainer: document.getElementById('reels-container'),
    paylinesOverlay: document.getElementById('paylines-overlay'),
    cabinetMarquee: document.getElementById('cabinet-marquee'),
    btnSpin: document.getElementById('btn-spin'),
    btnAutoSpin: document.getElementById('btn-auto-spin'),
    autoStatus: document.getElementById('auto-status'),
    btnSoundToggleHome: document.getElementById('btn-sound-toggle-home'),
    btnSoundToggleGame: document.getElementById('btn-sound-toggle-game'),
    modalVictory: document.getElementById('modal-victory'),
    modalGameOver: document.getElementById('modal-gameover'),
    modalFinale: document.getElementById('modal-grand-finale'),
    modalHowToPlay: document.getElementById('modal-how-to-play'),
    victoryScore: document.getElementById('victory-score'),
    victoryMoves: document.getElementById('victory-moves'),
    victoryCoins: document.getElementById('victory-coins'),
    victoryStars: document.getElementById('victory-stars'),
    gameoverTarget: document.getElementById('gameover-target'),
    gameoverScore: document.getElementById('gameover-score')
  };

  // --- SAVE & LOAD SYSTEM (localStorage) ---
  function saveProgress() {
    try {
      const data = {
        unlockedLevel: state.unlockedLevel,
        currentLevel: state.currentLevel,
        coins: state.coins,
        completedLevels: state.completedLevels,
        levelStars: state.levelStars,
        highScores: state.highScores,
        soundOn: state.soundOn
      };
      localStorage.setItem('color_spin_match_save', JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem('color_spin_match_save');
      if (raw) {
        const data = JSON.parse(raw);
        state.unlockedLevel = Math.max(1, Math.min(100, data.unlockedLevel || 1));
        state.currentLevel = Math.max(1, Math.min(100, data.currentLevel || 1));
        state.coins = typeof data.coins === 'number' ? data.coins : 500;
        state.completedLevels = data.completedLevels || {};
        state.levelStars = data.levelStars || {};
        state.highScores = data.highScores || {};
        state.soundOn = data.soundOn !== undefined ? data.soundOn : true;
        sound.enabled = state.soundOn;
      }
    } catch (e) {
      console.warn('Could not load from localStorage:', e);
    }
  }

  // --- SCREEN NAVIGATION ---
  function showScreen(screenEl) {
    [DOM.screenHome, DOM.screenLevelSelect, DOM.screenGame].forEach(s => s.classList.remove('active'));
    screenEl.classList.add('active');
  }

  function showHome() {
    updateHomeStats();
    showScreen(DOM.screenHome);
  }

  function showLevelSelect() {
    renderLevelSelectGrid();
    showScreen(DOM.screenLevelSelect);
  }

  function showHowToPlay() {
    DOM.modalHowToPlay.classList.add('active');
  }

  function hideModals() {
    [DOM.modalVictory, DOM.modalGameOver, DOM.modalFinale, DOM.modalHowToPlay].forEach(m => m.classList.remove('active'));
  }

  // --- SOUND TOGGLE ---
  function toggleSound() {
    state.soundOn = !state.soundOn;
    sound.enabled = state.soundOn;
    const txt = state.soundOn ? '🔊' : '🔇';
    DOM.btnSoundToggleGame.textContent = txt;
    DOM.btnSoundToggleHome.innerHTML = `<span id="home-sound-icon">${txt}</span> Sound: ${state.soundOn ? 'ON' : 'OFF'}`;
    saveProgress();
  }

  // --- HOME HUD REFRESH ---
  function updateHomeStats() {
    DOM.homeCoins.textContent = state.coins;
    DOM.navCoinVal.textContent = state.coins;
    let totalStars = 0;
    Object.values(state.levelStars).forEach(s => totalStars += s);
    DOM.homeStars.textContent = `${totalStars} / 300`;
    DOM.homeLevelProgress.textContent = `Level ${state.unlockedLevel}`;
  }

  // --- LEVEL SELECT RENDERING ---
  function renderLevelSelectGrid() {
    DOM.navCoinVal.textContent = state.coins;
    DOM.worldFilterBar.innerHTML = '';
    DOM.levelGrid.innerHTML = '';

    const worldKeys = Object.keys(WORLD_THEMES);

    // Create World Filter Chips
    worldKeys.forEach((key, wIdx) => {
      const wInfo = WORLD_THEMES[key];
      const chip = document.createElement('button');
      chip.className = `filter-chip ${wIdx === 0 ? 'active' : ''}`;
      chip.textContent = `${wInfo.icon} ${wInfo.name}`;
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const targetSection = document.getElementById(`world-sec-${wIdx}`);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      DOM.worldFilterBar.appendChild(chip);
    });

    // Create 20 World Sections with 5 levels each
    worldKeys.forEach((key, wIdx) => {
      const wInfo = WORLD_THEMES[key];
      const startLvl = wIdx * 5 + 1;
      const endLvl = (wIdx + 1) * 5;

      const sec = document.createElement('div');
      sec.className = 'world-group-section';
      sec.id = `world-sec-${wIdx}`;

      const header = document.createElement('div');
      header.className = 'world-group-header';
      header.innerHTML = `
        <div class="world-group-title">
          <span>${wInfo.icon}</span>
          <span>${wInfo.name}</span>
        </div>
        <span class="world-range-tag">${startLvl}–${endLvl}</span>
      `;
      sec.appendChild(header);

      const cardsRow = document.createElement('div');
      cardsRow.className = 'level-cards-row';

      for (let l = startLvl; l <= endLvl; l++) {
        const isUnlocked = l <= state.unlockedLevel;
        const isCompleted = !!state.completedLevels[l];
        const isCurrent = l === state.currentLevel;
        const stars = state.levelStars[l] || 0;

        const card = document.createElement('button');
        card.className = `lvl-card ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`;
        card.disabled = !isUnlocked;

        let starsHtml = '';
        if (isCompleted) {
          starsHtml = `<div class="lvl-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>`;
        } else if (isUnlocked) {
          starsHtml = `<div class="lvl-stars">Play</div>`;
        } else {
          starsHtml = `<div class="lvl-stars">🔒</div>`;
        }

        card.innerHTML = `
          <span>${l < 10 ? '0' + l : l}</span>
          ${starsHtml}
        `;

        if (isUnlocked) {
          card.addEventListener('click', () => {
            sound.playClick();
            loadLevel(l);
          });
        }

        cardsRow.appendChild(card);
      }

      sec.appendChild(cardsRow);
      DOM.levelGrid.appendChild(sec);
    });
  }

  // --- LEVEL LOADER ---
  function loadLevel(lvlNum) {
    hideModals();
    state.currentLevel = Math.max(1, Math.min(100, lvlNum));
    const lvlConfig = LEVELS[state.currentLevel - 1];
    const theme = WORLD_THEMES[lvlConfig.theme] || WORLD_THEMES.water;

    state.score = 0;
    state.moves = lvlConfig.moves;
    state.target = lvlConfig.target;
    state.combo = 0;
    state.isSpinning = false;
    state.lockedCells = {};

    // Apply Dynamic Theme Styling
    applyTheme(theme);

    // Update HUD
    DOM.hudLevelText.textContent = `LEVEL ${state.currentLevel} / 100`;
    DOM.hudThemeBadge.textContent = `${theme.icon} ${theme.name}`;
    DOM.hudTarget.textContent = state.target.toLocaleString();
    DOM.hudScore.textContent = '0';
    DOM.hudScoreFill.style.width = '0%';
    DOM.hudMoves.textContent = state.moves;
    DOM.hudMoves.parentElement.classList.remove('danger');
    DOM.hudCoins.textContent = state.coins;
    DOM.cabinetMarquee.textContent = `TARGET: ${state.target} • MATCH TO SCORE!`;
    DOM.comboBanner.style.display = 'none';
    DOM.eventBanner.style.display = 'none';

    // Build Reels for this Level
    createReels(lvlConfig);

    showScreen(DOM.screenGame);
  }

  // --- THEME COLOR APPLICATION ---
  function applyTheme(theme) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--accent-gold', theme.accent);
    root.style.setProperty('--cabinet-border', theme.rim);
    root.style.setProperty('--cabinet-rim', theme.primary);
    root.style.setProperty('--bg-gradient', `linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[1]} 50%, ${theme.colors[2]} 100%)`);
  }

  // --- CREATE REELS (3, 4, OR 5) ---
  function createReels(lvlConfig) {
    DOM.reelsContainer.innerHTML = '';
    DOM.paylinesOverlay.innerHTML = '';
    const numReels = lvlConfig.reels;
    state.currentReelSymbols = [];

    for (let r = 0; r < numReels; r++) {
      const col = document.createElement('div');
      col.className = 'reel-column';
      col.dataset.reelIndex = r;

      const strip = document.createElement('div');
      strip.className = 'reel-strip';
      strip.dataset.reelIndex = r;

      // Reel row cells (3 rows visible)
      const reelColSymbols = [];
      for (let row = 0; row < 3; row++) {
        const sym = generateSymbol(lvlConfig);
        reelColSymbols.push(sym);

        const tile = createTileElement(sym, r, row);
        strip.appendChild(tile);
      }
      state.currentReelSymbols.push(reelColSymbols);

      col.appendChild(strip);
      DOM.reelsContainer.appendChild(col);
    }
  }

  function createTileElement(symbol, reel, row) {
    const tile = document.createElement('div');
    tile.className = 'slot-tile';
    tile.dataset.reel = reel;
    tile.dataset.row = row;

    if (symbol === '🌈' || symbol === '🌟') tile.classList.add('wild');
    if (symbol === '🌟') tile.classList.add('super-wild');

    const inner = document.createElement('div');
    inner.className = 'tile-inner';

    const span = document.createElement('span');
    span.className = 'tile-symbol';
    span.textContent = symbol;

    inner.appendChild(span);
    tile.appendChild(inner);
    return tile;
  }

  // --- SYMBOL GENERATOR WITH WILD & SPECIAL CHANCES ---
  function generateSymbol(lvlConfig) {
    const symbols = lvlConfig.symbols;
    const mechanics = lvlConfig.mechanics || [];

    // Special item chances based on level mechanics
    const rand = Math.random();

    // Rainbow Wild in late levels / rainbow world
    if (mechanics.includes('rainbow_wild') && rand < 0.08) {
      return '🌈';
    }

    // Super Wild
    if (mechanics.includes('super_wild') && rand < 0.06) {
      return '🌟';
    }

    // Standard Wild
    if (rand < 0.05) {
      return '🌈';
    }

    // Bomb
    if (rand < 0.08 && (lvlConfig.level >= 15 || mechanics.includes('all_specials'))) {
      return '💣';
    }

    // Mystery
    if (rand < 0.11 && mechanics.includes('mystery')) {
      return '❓';
    }

    // Random standard symbol from level palette
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  // --- SPIN REELS ---
  function spinReels() {
    if (state.isSpinning) return;
    if (state.moves <= 0) {
      checkGameOver();
      return;
    }

    sound.init();
    state.isSpinning = true;
    DOM.btnSpin.classList.add('disabled');
    DOM.paylinesOverlay.innerHTML = '';
    DOM.comboBanner.style.display = 'none';
    DOM.eventBanner.style.display = 'none';

    // Deduct Move
    state.moves--;
    DOM.hudMoves.textContent = state.moves;
    if (state.moves <= 3) {
      DOM.hudMoves.parentElement.classList.add('danger');
    }

    sound.playSpinTick();

    const lvlConfig = LEVELS[state.currentLevel - 1];
    const numReels = lvlConfig.reels;

    // Generate Final Stopping Symbols
    const nextReelSymbols = [];
    for (let r = 0; r < numReels; r++) {
      const colSymbols = [];
      for (let row = 0; row < 3; row++) {
        colSymbols.push(generateSymbol(lvlConfig));
      }
      nextReelSymbols.push(colSymbols);
    }

    // Animate Each Reel Strip
    const strips = DOM.reelsContainer.querySelectorAll('.reel-strip');
    const reelHeight = DOM.reelsContainer.clientHeight;
    const rowHeight = reelHeight / 3;

    strips.forEach((strip, reelIdx) => {
      strip.classList.add('spinning');

      // Populate extra buffer symbols for the rolling motion illusion
      const bufferSymbols = [];
      for (let i = 0; i < 12; i++) {
        bufferSymbols.push(lvlConfig.symbols[Math.floor(Math.random() * lvlConfig.symbols.length)]);
      }
      bufferSymbols.push(...nextReelSymbols[reelIdx]);

      // Temporary roll injection
      strip.innerHTML = '';
      bufferSymbols.forEach((sym, sIdx) => {
        const rowNum = sIdx >= bufferSymbols.length - 3 ? sIdx - (bufferSymbols.length - 3) : 0;
        const tile = createTileElement(sym, reelIdx, rowNum);
        strip.appendChild(tile);
      });

      // Animate roll via CSS transform
      const totalOffset = (bufferSymbols.length - 3) * rowHeight;
      strip.style.transition = 'none';
      strip.style.transform = 'translateY(0px)';

      // Force layout reflow
      void strip.offsetWidth;

      // Staggered stop timing: 600ms base + 220ms per subsequent reel
      const duration = 0.6 + reelIdx * 0.22;
      strip.style.transition = `transform ${duration}s cubic-bezier(0.12, 0.8, 0.32, 1)`;
      strip.style.transform = `translateY(-${totalOffset}px)`;

      // Reel Stop Sound and Settling
      setTimeout(() => {
        strip.classList.remove('spinning');
        sound.playReelStop(reelIdx);

        // Keep only final 3 cells
        strip.innerHTML = '';
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0px)';
        nextReelSymbols[reelIdx].forEach((finalSym, rowIdx) => {
          strip.appendChild(createTileElement(finalSym, reelIdx, rowIdx));
        });

        // When the final reel stops:
        if (reelIdx === numReels - 1) {
          state.currentReelSymbols = nextReelSymbols;
          evaluateSpinResults(lvlConfig);
        }
      }, duration * 1000);
    });
  }

  // --- EVALUATE SPIN MATCHES & CHAIN REACTIONS ---
  function evaluateSpinResults(lvlConfig) {
    const numReels = lvlConfig.reels;
    let matchPoints = 0;
    let totalCoinsEarned = 0;
    let bestMatchCount = 0;
    const winningTiles = new Set();
    const paylines = [];

    // Reveal Mystery Symbols first
    for (let r = 0; r < numReels; r++) {
      for (let row = 0; row < 3; row++) {
        if (state.currentReelSymbols[r][row] === '❓') {
          const highSym = lvlConfig.symbols[lvlConfig.symbols.length - 1];
          state.currentReelSymbols[r][row] = highSym;
          const tile = getTileEl(r, row);
          if (tile) {
            tile.querySelector('.tile-symbol').textContent = highSym;
            tile.classList.add('super-wild');
          }
        }
      }
    }

    // Check Special Inter-Element Mechanics (Fire vs Water, Water + Battery)
    checkElementInteractions(lvlConfig);

    // 1. Horizontal Lines (Row 0: Top, Row 1: Middle, Row 2: Bottom)
    for (let row = 0; row < 3; row++) {
      const lineSymbols = [];
      for (let r = 0; r < numReels; r++) {
        lineSymbols.push(state.currentReelSymbols[r][row]);
      }
      const matchRes = evaluateLine(lineSymbols);
      if (matchRes.matched) {
        matchPoints += matchRes.score;
        totalCoinsEarned += matchRes.coins;
        bestMatchCount = Math.max(bestMatchCount, matchRes.count);
        paylines.push({ type: 'row', row: row, count: matchRes.count });
        for (let r = 0; r < matchRes.count; r++) {
          winningTiles.add(`${r},${row}`);
        }
      }
    }

    // 2. Diagonal Lines (for 3 or 4 reels)
    if (numReels >= 3) {
      // Diagonal Top-Left to Bottom-Right
      const diag1 = [];
      for (let r = 0; r < Math.min(3, numReels); r++) {
        diag1.push(state.currentReelSymbols[r][r]);
      }
      const d1Res = evaluateLine(diag1);
      if (d1Res.matched) {
        matchPoints += d1Res.score;
        totalCoinsEarned += d1Res.coins;
        bestMatchCount = Math.max(bestMatchCount, d1Res.count);
        paylines.push({ type: 'diag1', count: d1Res.count });
        for (let r = 0; r < d1Res.count; r++) {
          winningTiles.add(`${r},${r}`);
        }
      }

      // Diagonal Bottom-Left to Top-Right
      const diag2 = [];
      for (let r = 0; r < Math.min(3, numReels); r++) {
        diag2.push(state.currentReelSymbols[r][2 - r]);
      }
      const d2Res = evaluateLine(diag2);
      if (d2Res.matched) {
        matchPoints += d2Res.score;
        totalCoinsEarned += d2Res.coins;
        bestMatchCount = Math.max(bestMatchCount, d2Res.count);
        paylines.push({ type: 'diag2', count: d2Res.count });
        for (let r = 0; r < d2Res.count; r++) {
          winningTiles.add(`${r},${2 - r}`);
        }
      }
    }

    // Highlight Winning Tiles
    winningTiles.forEach(coord => {
      const [r, row] = coord.split(',').map(Number);
      const tile = getTileEl(r, row);
      if (tile) {
        tile.classList.add('matched');
      }
    });

    // Draw Paylines
    drawPaylines(paylines, numReels);

    // Apply Combos & Multipliers
    if (matchPoints > 0) {
      state.combo++;
      const comboMult = 1 + (state.combo - 1) * 0.5;
      matchPoints = Math.round(matchPoints * comboMult);
      state.score += matchPoints;
      state.coins += totalCoinsEarned;

      // Update HUD
      updateScoreHUD();

      // Audio & Particle Effects based on match size
      if (bestMatchCount >= 5) {
        // Mega Match
        triggerMegaMatch(matchPoints, totalCoinsEarned);
      } else if (bestMatchCount === 4) {
        // Super Match
        triggerSuperMatch(matchPoints, totalCoinsEarned);
      } else {
        // Standard Match
        sound.playMatch(bestMatchCount);
        DOM.cabinetMarquee.textContent = `MATCH! +${matchPoints} PTS (+${totalCoinsEarned} 🪙)`;
      }

      // Display combo banner
      if (state.combo >= 2) {
        DOM.comboBanner.textContent = `COMBO x${state.combo}!`;
        DOM.comboBanner.style.display = 'block';
      }

      // Burst particles
      particles.burst(window.innerWidth / 2, window.innerHeight * 0.45, bestMatchCount * 8);

    } else {
      state.combo = 0;
      DOM.cabinetMarquee.textContent = 'NO MATCH • SPIN AGAIN!';
    }

    // Settle State
    state.isSpinning = false;
    DOM.btnSpin.classList.remove('disabled');

    // Check Level Clear or Game Over
    setTimeout(() => {
      if (state.score >= state.target) {
        completeLevel();
      } else if (state.moves <= 0) {
        gameOver();
      } else if (state.autoSpin) {
        setTimeout(spinReels, 900);
      }
    }, 700);
  }

  // --- EVALUATE A LINE OF SYMBOLS (WILD SUPPORT) ---
  function evaluateLine(symbols) {
    if (!symbols || symbols.length < 2) return { matched: false };

    // Find the base symbol (first non-wild)
    let targetSym = null;
    let hasSuperWild = false;

    for (let sym of symbols) {
      if (sym === '🌟') hasSuperWild = true;
      if (sym !== '🌈' && sym !== '🌟' && sym !== '💣' && sym !== '❓') {
        targetSym = sym;
        break;
      }
    }

    // If all are wilds, pick standard high score
    if (!targetSym) targetSym = symbols[0];

    // Count matching consecutive symbols from reel 0
    let matchCount = 0;
    for (let i = 0; i < symbols.length; i++) {
      const s = symbols[i];
      if (s === targetSym || s === '🌈' || s === '🌟') {
        matchCount++;
      } else {
        break;
      }
    }

    // Minimum match is 2 identical / wilds
    if (matchCount >= 2) {
      let score = 0;
      let coins = 0;

      if (matchCount === 2) {
        score = 80;
        coins = 4;
      } else if (matchCount === 3) {
        score = 250;
        coins = 12;
      } else if (matchCount === 4) {
        score = 650;
        coins = 35;
      } else if (matchCount >= 5) {
        score = 1600;
        coins = 90;
      }

      if (hasSuperWild) {
        score *= 2;
        coins *= 2;
      }

      return { matched: true, count: matchCount, score: score, coins: coins };
    }

    return { matched: false };
  }

  // --- ELEMENT INTERACTIONS (FIRE VS WATER, ROBOT WATER POWER) ---
  function checkElementInteractions(lvlConfig) {
    const symbolsFlat = state.currentReelSymbols.flat();
    const hasFire = symbolsFlat.includes('🔥') || symbolsFlat.includes('🌋');
    const hasWater = symbolsFlat.includes('💧') || symbolsFlat.includes('🫧');
    const hasIce = symbolsFlat.includes('❄️') || symbolsFlat.includes('🧊');
    const hasBattery = symbolsFlat.includes('🔋');
    const hasRobot = symbolsFlat.includes('🤖');

    if (lvlConfig.mechanics.includes('fire_vs_water') && hasFire && hasWater) {
      DOM.eventBanner.textContent = '⚡ STEAM FUSION CLASH! +300 PTS';
      DOM.eventBanner.style.display = 'block';
      state.score += 300;
      sound.playCoin();
      particles.burst(window.innerWidth / 2, window.innerHeight * 0.4, 20, ['#ef4444', '#06b6d4']);
    } else if (lvlConfig.mechanics.includes('melt_freeze') && hasFire && hasIce) {
      DOM.eventBanner.textContent = '🔥 FIRE MELTS ICE! +350 PTS';
      DOM.eventBanner.style.display = 'block';
      state.score += 350;
      sound.playCoin();
      particles.burst(window.innerWidth / 2, window.innerHeight * 0.4, 20, ['#ef4444', '#67e8f9']);
    } else if (lvlConfig.mechanics.includes('water_battery') && hasWater && (hasBattery || hasRobot)) {
      DOM.eventBanner.textContent = '⚡ HYDRO-POWER CHARGE! +400 PTS';
      DOM.eventBanner.style.display = 'block';
      state.score += 400;
      sound.playCoin();
      particles.burst(window.innerWidth / 2, window.innerHeight * 0.4, 25, ['#06b6d4', '#10b981']);
    }
  }

  // --- SPECIAL MATCH EFFECTS ---
  function triggerSuperMatch(points, coins) {
    sound.playSuperMatch();
    DOM.cabinetMarquee.textContent = `⭐ SUPER MATCH! +${points} PTS (+${coins} 🪙)`;
    document.body.classList.add('shake-screen');
    setTimeout(() => document.body.classList.remove('shake-screen'), 450);
  }

  function triggerMegaMatch(points, coins) {
    sound.playMegaMatch();
    DOM.cabinetMarquee.textContent = `💥 MEGA MATCH! +${points} PTS (+${coins} 🪙)`;
    document.body.classList.add('shake-screen');
    setTimeout(() => document.body.classList.remove('shake-screen'), 600);
    particles.burst(window.innerWidth / 2, window.innerHeight * 0.4, 60, ['#facc15', '#f43f5e', '#38bdf8', '#10b981']);
  }

  // --- DRAW SVG PAYLINES ---
  function drawPaylines(lines, numReels) {
    DOM.paylinesOverlay.innerHTML = '';
    if (!lines || lines.length === 0) return;

    const w = DOM.reelsContainer.clientWidth;
    const h = DOM.reelsContainer.clientHeight;
    const colW = w / numReels;
    const rowH = h / 3;

    lines.forEach((p, idx) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'payline-path');
      path.setAttribute('stroke', idx % 2 === 0 ? '#facc15' : '#ec4899');
      path.setAttribute('stroke-width', '4');

      let d = '';
      if (p.type === 'row') {
        const y = p.row * rowH + rowH / 2;
        d = `M 0,${y} L ${p.count * colW},${y}`;
      } else if (p.type === 'diag1') {
        d = `M 0,${rowH / 2} L ${colW * p.count},${p.count * rowH - rowH / 2}`;
      } else if (p.type === 'diag2') {
        d = `M 0,${h - rowH / 2} L ${colW * p.count},${h - (p.count * rowH - rowH / 2)}`;
      }

      path.setAttribute('d', d);
      DOM.paylinesOverlay.appendChild(path);
    });
  }

  function getTileEl(reel, row) {
    return DOM.reelsContainer.querySelector(`.slot-tile[data-reel="${reel}"][data-row="${row}"]`);
  }

  // --- SCORE HUD UPDATE ---
  function updateScoreHUD() {
    DOM.hudScore.textContent = state.score.toLocaleString();
    DOM.hudCoins.textContent = state.coins;
    const pct = Math.min(100, Math.round((state.score / state.target) * 100));
    DOM.hudScoreFill.style.width = `${pct}%`;
  }

  // --- LEVEL COMPLETE ---
  function completeLevel() {
    sound.playVictory();
    state.isSpinning = false;
    state.autoSpin = false;
    DOM.autoStatus.textContent = 'OFF';
    DOM.btnAutoSpin.classList.remove('active');

    // Calculate Stars based on moves left
    let stars = 1;
    if (state.moves >= 4) stars = 3;
    else if (state.moves >= 2) stars = 2;

    const earnedCoins = 50 + stars * 25 + state.moves * 10;
    state.coins += earnedCoins;

    // Save Progress
    state.completedLevels[state.currentLevel] = true;
    state.levelStars[state.currentLevel] = Math.max(state.levelStars[state.currentLevel] || 0, stars);
    state.highScores[state.currentLevel] = Math.max(state.highScores[state.currentLevel] || 0, state.score);

    if (state.currentLevel >= state.unlockedLevel && state.unlockedLevel < 100) {
      state.unlockedLevel = state.currentLevel + 1;
    }

    saveProgress();

    // Check if this is the Grand Finale Level 100!
    if (state.currentLevel === 100) {
      showGrandFinale();
      return;
    }

    // Show Victory Modal
    DOM.victoryScore.textContent = state.score.toLocaleString();
    DOM.victoryMoves.textContent = state.moves;
    DOM.victoryCoins.textContent = `+${earnedCoins} 🪙`;
    DOM.victoryStars.innerHTML = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

    particles.burst(window.innerWidth / 2, window.innerHeight * 0.45, 50);
    DOM.modalVictory.classList.add('active');
  }

  // --- GRAND FINALE (LEVEL 100 COMPLETE) ---
  function showGrandFinale() {
    state.coins += 5000;
    saveProgress();

    // Continuous Victory Fireworks
    particles.burst(window.innerWidth / 2, window.innerHeight * 0.3, 80);
    setTimeout(() => particles.burst(window.innerWidth * 0.3, window.innerHeight * 0.4, 60), 300);
    setTimeout(() => particles.burst(window.innerWidth * 0.7, window.innerHeight * 0.4, 60), 600);

    DOM.modalFinale.classList.add('active');
  }

  // --- GAME OVER ---
  function gameOver() {
    sound.playDefeat();
    state.isSpinning = false;
    state.autoSpin = false;
    DOM.autoStatus.textContent = 'OFF';
    DOM.btnAutoSpin.classList.remove('active');

    DOM.gameoverTarget.textContent = state.target.toLocaleString();
    DOM.gameoverScore.textContent = state.score.toLocaleString();
    DOM.modalGameOver.classList.add('active');
  }

  function restartLevel() {
    hideModals();
    loadLevel(state.currentLevel);
  }

  function nextLevel() {
    hideModals();
    if (state.currentLevel < 100) {
      loadLevel(state.currentLevel + 1);
    } else {
      showLevelSelect();
    }
  }

  // --- IN-GAME BOOSTERS ---
  function applyBooster(type) {
    if (state.isSpinning) return;

    if (type === 'moves') {
      if (state.coins >= 100) {
        state.coins -= 100;
        state.moves += 3;
        DOM.hudMoves.textContent = state.moves;
        DOM.hudMoves.parentElement.classList.remove('danger');
        DOM.hudCoins.textContent = state.coins;
        sound.playCoin();
        DOM.cabinetMarquee.textContent = '+3 MOVES ADDED!';
        saveProgress();
      } else {
        alert('Not enough coins! You need 100 coins.');
      }
    } else if (type === 'wild') {
      if (state.coins >= 200) {
        state.coins -= 200;
        DOM.hudCoins.textContent = state.coins;
        // Transform center tile of reel 1 into Rainbow Wild
        state.currentReelSymbols[1][1] = '🌈';
        const t = getTileEl(1, 1);
        if (t) {
          t.querySelector('.tile-symbol').textContent = '🌈';
          t.classList.add('wild');
        }
        sound.playCoin();
        particles.burst(window.innerWidth / 2, window.innerHeight * 0.45, 20);
        DOM.cabinetMarquee.textContent = 'RAINBOW WILD INJECTED!';
        saveProgress();
      } else {
        alert('Not enough coins! You need 200 coins.');
      }
    } else if (type === 'bomb') {
      if (state.coins >= 150) {
        state.coins -= 150;
        DOM.hudCoins.textContent = state.coins;
        sound.playSuperMatch();
        // Clear obstacles and grant bonus points
        state.score += 400;
        updateScoreHUD();
        DOM.cabinetMarquee.textContent = 'BOMB BLAST! +400 PTS!';
        particles.burst(window.innerWidth / 2, window.innerHeight * 0.45, 40);
        saveProgress();
      } else {
        alert('Not enough coins! You need 150 coins.');
      }
    }
  }

  // --- USER INTERFACE EVENTS & BINDINGS ---
  function initGame() {
    loadProgress();
    updateHomeStats();

    // Home Action Handlers
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = btn.dataset.action;
        sound.init();

        switch (action) {
          case 'play':
            sound.playClick();
            loadLevel(state.unlockedLevel);
            break;
          case 'level-select':
            sound.playClick();
            hideModals();
            showLevelSelect();
            break;
          case 'home':
            sound.playClick();
            hideModals();
            showHome();
            break;
          case 'how-to-play':
            sound.playClick();
            showHowToPlay();
            break;
          case 'toggle-sound':
            toggleSound();
            break;
          case 'spin':
            spinReels();
            break;
          case 'restart':
            sound.playClick();
            restartLevel();
            break;
          case 'next-level':
            sound.playClick();
            nextLevel();
            break;
          case 'close-modal':
            sound.playClick();
            hideModals();
            break;
          case 'toggle-auto':
            state.autoSpin = !state.autoSpin;
            DOM.autoStatus.textContent = state.autoSpin ? 'ON' : 'OFF';
            DOM.btnAutoSpin.classList.toggle('active', state.autoSpin);
            if (state.autoSpin && !state.isSpinning) {
              spinReels();
            }
            break;
        }
      });
    });

    // Booster Handlers
    document.querySelectorAll('[data-booster]').forEach(btn => {
      btn.addEventListener('click', () => {
        const b = btn.dataset.booster;
        if (b === 'continue') {
          hideModals();
          applyBooster('moves');
        } else {
          applyBooster(b);
        }
      });
    });

    // PC Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (DOM.screenGame.classList.contains('active')) {
          spinReels();
        } else if (DOM.screenHome.classList.contains('active')) {
          loadLevel(state.unlockedLevel);
        }
      } else if (e.code === 'KeyR') {
        if (DOM.screenGame.classList.contains('active')) {
          restartLevel();
        }
      } else if (e.code === 'Escape') {
        if (DOM.modalHowToPlay.classList.contains('active')) {
          hideModals();
        } else if (DOM.screenGame.classList.contains('active')) {
          showLevelSelect();
        } else if (DOM.screenLevelSelect.classList.contains('active')) {
          showHome();
        }
      }
    });

    // Prevent Double-Tap Zoom & Unwanted Touch Scrolling on Buttons
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  // Run Initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }

})();
