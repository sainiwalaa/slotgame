/**
 * Color Flow Puzzle Adventure (100+ Levels)
 * Complete 10-World Multi-Mechanic Engine
 * Real Fluid, Screws, Balls, Gems, Sweets, Potions, Cyber Cells, Gears & Cosmic Orbs
 */

(function () {
  'use strict';

  // --- PALETTE OF 12 VIBRANT COLOR DEFINITIONS ---
  const PALETTE = {
    c1:  { id: 'c1',  name: 'Sky Blue',        hex: '#0ea5e9', secondary: '#38bdf8' },
    c2:  { id: 'c2',  name: 'Crimson Red',     hex: '#ef4444', secondary: '#f87171' },
    c3:  { id: 'c3',  name: 'Emerald Green',   hex: '#10b981', secondary: '#34d399' },
    c4:  { id: 'c4',  name: 'Sunshine Yellow', hex: '#eab308', secondary: '#facc15' },
    c5:  { id: 'c5',  name: 'Royal Purple',    hex: '#8b5cf6', secondary: '#a78bfa' },
    c6:  { id: 'c6',  name: 'Tangy Orange',    hex: '#f97316', secondary: '#fb923c' },
    c7:  { id: 'c7',  name: 'Hot Pink',        hex: '#ec4899', secondary: '#f472b6' },
    c8:  { id: 'c8',  name: 'Ocean Cyan',      hex: '#06b6d4', secondary: '#22d3ee' },
    c9:  { id: 'c9',  name: 'Lime Green',      hex: '#84cc16', secondary: '#a3e635' },
    c10: { id: 'c10', name: 'Amber Gold',      hex: '#f59e0b', secondary: '#fbbf24' },
    c11: { id: 'c11', name: 'Deep Indigo',     hex: '#6366f1', secondary: '#818cf8' },
    c12: { id: 'c12', name: 'Coral Pink',      hex: '#fb7185', secondary: '#fda4af' }
  };

  const COLOR_KEYS = Object.keys(PALETTE);

  // --- 10 COHESIVE WORLDS WITH UNIQUE MECHANICS & VISUALS ---
  const WORLDS = [
    {
      id: 1,
      name: 'Water Sort',
      icon: '💧',
      itemType: 'water',
      vesselClass: 'vessel-water-bottle',
      bg: 'linear-gradient(135deg, #07192f 0%, #0c2d48 50%, #145da0 100%)',
      accent: '#38bdf8',
      desc: 'Classic Color Water Sort with transparent glass flasks and fluid pour streams.',
      soundType: 'pour',
      glyphs: { c1: '💧', c2: '🔴', c3: '🟢', c4: '🟡', c5: '🟣', c6: '🟠', c7: '🌸', c8: '🌊', c9: '🍃', c10: '⭐', c11: '💎', c12: '🫧' }
    },
    {
      id: 2,
      name: 'Screw & Bolt Sort',
      icon: '🔩',
      itemType: 'screw',
      vesselClass: 'vessel-screw-tray',
      bg: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
      accent: '#f59e0b',
      desc: 'Heavy mechanical workshop: Sort metallic screws, threaded bolts, hex nuts, and washers.',
      soundType: 'screw',
      glyphs: { c1: '🔩', c2: '⚙️', c3: '🔧', c4: '🪙', c5: '🧲', c6: '🔗', c7: '🛠️', c8: '⚙️', c9: '🔩', c10: '🪙', c11: '🔧', c12: '🧲' }
    },
    {
      id: 3,
      name: 'Color Ball Sort',
      icon: '⚪',
      itemType: 'ball',
      vesselClass: 'vessel-ball-tube',
      bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
      accent: '#818cf8',
      desc: 'Glossy 3D marbles and bouncy glass spheres in transparent cylindrical tubes.',
      soundType: 'marble',
      glyphs: { c1: '🔵', c2: '🔴', c3: '🟢', c4: '🟡', c5: '🟣', c6: '🟠', c7: '🩷', c8: '🩵', c9: '🟢', c10: '🟡', c11: '🟣', c12: '⚪' }
    },
    {
      id: 4,
      name: 'Crystal Gem Sort',
      icon: '💎',
      itemType: 'gem',
      vesselClass: 'vessel-gem-jar',
      bg: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 50%, #4c1d95 100%)',
      accent: '#c084fc',
      desc: 'Faceted sparkling gemstones and glowing crystal sands in enchanted crystal jars.',
      soundType: 'crystal',
      glyphs: { c1: '💎', c2: '💍', c3: '🔮', c4: '🔶', c5: '🔷', c6: '✨', c7: '💖', c8: '💠', c9: '🟢', c10: '⭐', c11: '💜', c12: '🔆' }
    },
    {
      id: 5,
      name: 'Sweet Donut Sort',
      icon: '🍩',
      itemType: 'donut',
      vesselClass: 'vessel-sweet-jar',
      bg: 'linear-gradient(135deg, #4a044e 0%, #701a75 50%, #a21caf 100%)',
      accent: '#f472b6',
      desc: 'Pastry confectionery shop: Organize glazed donuts, macarons, and candy jelly rings.',
      soundType: 'sweet',
      glyphs: { c1: '🍩', c2: '🧁', c3: '🍬', c4: '🍭', c5: '🍓', c6: '🍰', c7: '🍪', c8: '🍧', c9: '🍡', c10: '🍯', c11: '🍫', c12: '🍮' }
    },
    {
      id: 6,
      name: 'Alchemy Potions',
      icon: '🔮',
      itemType: 'potion',
      vesselClass: 'vessel-potion-flask',
      bg: 'linear-gradient(135deg, #2e1065 0%, #3b0764 50%, #581c87 100%)',
      accent: '#a855f7',
      desc: 'Witches & Wizards potion flasks: Sort swirling elemental magical fluids and runes.',
      soundType: 'magic',
      glyphs: { c1: '🔥', c2: '❄️', c3: '⚡', c4: '🌿', c5: '💜', c6: '🌟', c7: '✨', c8: '🌊', c9: '🍃', c10: '☀️', c11: '🌙', c12: '👁️' }
    },
    {
      id: 7,
      name: 'Cyber Neon Cells',
      icon: '⚡',
      itemType: 'cyber',
      vesselClass: 'vessel-cyber-cell',
      bg: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)',
      accent: '#10b981',
      desc: 'High-tech neon energy batteries: Transfer pulsing plasma energy cores and circuit cells.',
      soundType: 'cyber',
      glyphs: { c1: '🔋', c2: '⚡', c3: '❇️', c4: '🔆', c5: '🟣', c6: '🔶', c7: '💠', c8: '🌐', c9: '🟢', c10: '🟡', c11: '🔷', c12: '🔴' }
    },
    {
      id: 8,
      name: 'Gears & Clockwork',
      icon: '⚙️',
      itemType: 'gear',
      vesselClass: 'vessel-gear-column',
      bg: 'linear-gradient(135deg, #292524 0%, #44403c 50%, #78350f 100%)',
      accent: '#d97706',
      desc: 'Steampunk clockwork pillars: Interlocking brass, bronze, copper, and chrome cogs.',
      soundType: 'gear',
      glyphs: { c1: '⚙️', c2: '🔩', c3: '🔧', c4: '🪙', c5: '🔗', c6: '🕰️', c7: '🛠️', c8: '⚙️', c9: '🔩', c10: '🪙', c11: '🔧', c12: '⏳' }
    },
    {
      id: 9,
      name: 'Cosmic Star Cores',
      icon: '🪐',
      itemType: 'cosmic',
      vesselClass: 'vessel-cosmic-pod',
      bg: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #3b0764 100%)',
      accent: '#c084fc',
      desc: 'Zero-gravity anti-grav chambers: Floating planetary orbs, miniature suns, and star cores.',
      soundType: 'cosmic',
      glyphs: { c1: '☀️', c2: '🪐', c3: '🌙', c4: '⭐', c5: '🌌', c6: '☄️', c7: '🌍', c8: '🛸', c9: '✨', c10: '🌟', c11: '🌑', c12: '🌠' }
    },
    {
      id: 10,
      name: 'Grand Master Hybrid',
      icon: '👑',
      itemType: 'master',
      vesselClass: 'vessel-master-relic',
      bg: 'linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #701a75 100%)',
      accent: '#facc15',
      desc: 'The ultimate royal challenge: Royal gilded chalices with crowns, gems, and ancient artifacts.',
      soundType: 'master',
      glyphs: { c1: '👑', c2: '🏆', c3: '💎', c4: '⚜️', c5: '🔮', c6: '🗝️', c7: '🛡️', c8: '🗡️', c9: '🥇', c10: '⭐', c11: '💍', c12: '🌟' }
    }
  ];

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
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
      } catch (e) {}
    }

    playSelect() {
      this.playTone(520, 'sine', 0.08, 0.14, 0.01);
    }

    playMove(worldSoundType, layerIdx = 0) {
      if (!this.enabled || !this.ctx) return;
      const baseFreq = 340 + layerIdx * 45;

      switch (worldSoundType) {
        case 'pour':
          this.playTone(baseFreq, 'sine', 0.22, 0.2, 0.01);
          setTimeout(() => this.playTone(baseFreq + 65, 'triangle', 0.15, 0.15, 0.01), 60);
          break;
        case 'screw':
          this.playTone(420, 'triangle', 0.07, 0.22, 0.01);
          setTimeout(() => this.playTone(680, 'sine', 0.12, 0.2, 0.01), 40);
          setTimeout(() => this.playTone(540, 'triangle', 0.09, 0.15, 0.01), 90);
          break;
        case 'marble':
          this.playTone(720, 'triangle', 0.08, 0.25, 0.01);
          setTimeout(() => this.playTone(950, 'sine', 0.1, 0.2, 0.01), 45);
          break;
        case 'crystal':
          this.playTone(880, 'sine', 0.2, 0.22, 0.01);
          setTimeout(() => this.playTone(1320, 'triangle', 0.25, 0.18, 0.01), 50);
          break;
        case 'sweet':
          this.playTone(380, 'sine', 0.1, 0.22, 0.01);
          setTimeout(() => this.playTone(520, 'sine', 0.14, 0.18, 0.01), 40);
          break;
        case 'magic':
          this.playTone(660, 'sine', 0.18, 0.2, 0.01);
          setTimeout(() => this.playTone(990, 'triangle', 0.22, 0.18, 0.01), 60);
          setTimeout(() => this.playTone(1480, 'sine', 0.25, 0.14, 0.01), 120);
          break;
        case 'cyber':
          this.playTone(850, 'sawtooth', 0.08, 0.15, 0.01);
          setTimeout(() => this.playTone(1100, 'sine', 0.14, 0.18, 0.01), 40);
          break;
        case 'gear':
          this.playTone(320, 'square', 0.06, 0.16, 0.01);
          setTimeout(() => this.playTone(480, 'triangle', 0.1, 0.2, 0.01), 50);
          break;
        case 'cosmic':
          this.playTone(520, 'sine', 0.25, 0.18, 0.01);
          setTimeout(() => this.playTone(780, 'sine', 0.3, 0.15, 0.01), 80);
          break;
        case 'master':
          this.playTone(600, 'triangle', 0.16, 0.22, 0.01);
          setTimeout(() => this.playTone(900, 'sine', 0.22, 0.2, 0.01), 60);
          setTimeout(() => this.playTone(1200, 'sine', 0.28, 0.18, 0.01), 130);
          break;
        default:
          this.playTone(baseFreq, 'sine', 0.2, 0.18, 0.01);
      }
    }

    playInvalid() {
      this.playTone(200, 'sawtooth', 0.14, 0.14, 0.01);
    }

    playCork() {
      this.playTone(820, 'triangle', 0.1, 0.22, 0.01);
      setTimeout(() => this.playTone(1240, 'sine', 0.16, 0.2, 0.01), 50);
    }

    playUndo() {
      this.playTone(400, 'sine', 0.09, 0.12, 0.01);
      setTimeout(() => this.playTone(280, 'sine', 0.14, 0.09, 0.01), 40);
    }

    playWin() {
      if (!this.enabled || !this.ctx) return;
      const notes = [440, 554, 659, 880, 1108];
      notes.forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.22, 0.01), idx * 75);
      });
    }
  }

  const sound = new SoundEngine();

  // --- PARTICLE / CONFETTI ENGINE ---
  class ParticleEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas ? this.canvas.getContext('2d', { willReadFrequently: true }) : null;
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

    burst(x, y, count = 30, colors = ['#38bdf8', '#facc15', '#ec4899', '#10b981']) {
      if (!this.ctx) return;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 7;
        this.particles.push({
          x: x || this.canvas.width / 2,
          y: y || this.canvas.height / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          radius: 3 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.016 + Math.random() * 0.02,
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

  const particles = new ParticleEngine('fx-canvas');

  // --- SEEDED PRNG FOR GUARANTEED SOLVABLE 100 LEVELS ---
  function mulberry32(seed) {
    return function () {
      let t = (seed += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function getLevelConfig(lvlNum) {
    const rng = mulberry32(lvlNum * 7919 + 54321);
    const capacity = 4;

    let numColors, numEmpty;

    // Difficulty curve based on level
    if (lvlNum === 1) {
      numColors = 2; numEmpty = 1; // 3 containers
    } else if (lvlNum === 2) {
      numColors = 3; numEmpty = 1; // 4 containers
    } else if (lvlNum === 3) {
      numColors = 3; numEmpty = 2; // 5 containers
    } else if (lvlNum <= 5) {
      numColors = 4; numEmpty = 1; // 5 containers
    } else if (lvlNum <= 10) {
      numColors = 4; numEmpty = 2; // 6 containers
    } else if (lvlNum <= 20) {
      numColors = 5; numEmpty = 2; // 7 containers (World 2 Screws)
    } else if (lvlNum <= 30) {
      numColors = 5; numEmpty = 2; // 7 containers (World 3 Balls)
    } else if (lvlNum <= 50) {
      numColors = 6; numEmpty = 2; // 8 containers
    } else if (lvlNum <= 80) {
      numColors = 7; numEmpty = 2; // 9 containers
    } else {
      numColors = 8; numEmpty = 2; // 10 containers (Mastery)
    }

    const totalContainers = numColors + numEmpty;
    const selectedColors = COLOR_KEYS.slice(0, numColors);

    // Initial solved configuration
    const containers = [];
    for (let c = 0; c < numColors; c++) {
      containers.push([selectedColors[c], selectedColors[c], selectedColors[c], selectedColors[c]]);
    }
    for (let e = 0; e < numEmpty; e++) {
      containers.push([]);
    }

    // Scramble backwards through valid inverse moves to guarantee solvability
    const scrambleSteps = Math.min(65, 4 + Math.floor(lvlNum * 0.65));
    let lastFrom = -1;
    let lastTo = -1;

    for (let step = 0; step < scrambleSteps; step++) {
      const nonEmpties = [];
      for (let b = 0; b < totalContainers; b++) {
        if (containers[b].length > 0) nonEmpties.push(b);
      }
      if (nonEmpties.length === 0) break;

      const fromIdx = nonEmpties[Math.floor(rng() * nonEmpties.length)];

      const validDests = [];
      for (let d = 0; d < totalContainers; d++) {
        if (d !== fromIdx && containers[d].length < capacity && !(fromIdx === lastTo && d === lastFrom)) {
          validDests.push(d);
        }
      }

      if (validDests.length > 0) {
        const toIdx = validDests[Math.floor(rng() * validDests.length)];
        const movedColor = containers[fromIdx].pop();
        containers[toIdx].push(movedColor);
        lastFrom = fromIdx;
        lastTo = toIdx;
      }
    }

    // Crisp handcrafted starting state for Level 1
    if (lvlNum === 1) {
      containers[0] = ['c1', 'c2', 'c1', 'c2'];
      containers[1] = ['c2', 'c1', 'c2', 'c1'];
      containers[2] = [];
    }

    // Determine current World (10 worlds, 10 levels each)
    const worldIdx = Math.min(WORLDS.length - 1, Math.floor((lvlNum - 1) / 10));
    const world = WORLDS[worldIdx];

    return {
      level: lvlNum,
      world: world,
      capacity: capacity,
      containers: containers.map(b => [...b])
    };
  }

  // --- GAME STATE ---
  const state = {
    currentLevel: 1,
    unlockedLevel: 1,
    completedLevels: {},
    levelStars: {},
    levelMoves: {},
    containers: [],
    initialContainers: [],
    selectedIdx: null,
    moveCount: 0,
    undoStack: [],
    isMoving: false,
    capacity: 4,
    currentWorld: WORLDS[0],
    soundOn: true
  };

  // --- DOM CACHE ---
  const DOM = {
    gameApp: document.getElementById('game-app'),
    hudLevelText: document.getElementById('hud-level-text'),
    hudWorldText: document.getElementById('hud-world-text'),
    hudWorldProgress: document.getElementById('hud-world-progress'),
    hudMovesCount: document.getElementById('hud-moves-count'),
    hudFooterTip: document.getElementById('hud-footer-tip'),
    toastMessage: document.getElementById('toast-message'),
    boardArea: document.getElementById('board-area'),
    puzzleStage: document.getElementById('puzzle-stage'),
    streamSvg: document.getElementById('stream-overlay-svg'),
    btnSoundToggle: document.getElementById('btn-sound-toggle'),
    soundIcon: document.getElementById('sound-icon'),
    btnUndo: document.getElementById('btn-undo'),
    btnRestart: document.getElementById('btn-restart'),
    btnHint: document.getElementById('btn-hint'),
    btnRules: document.getElementById('btn-rules'),
    btnLevelsModal: document.getElementById('btn-levels-modal'),
    modalVictory: document.getElementById('modal-victory'),
    modalWorldUnlock: document.getElementById('modal-world-unlock'),
    modalLevels: document.getElementById('modal-levels'),
    modalRules: document.getElementById('modal-rules'),
    modalGrandMaster: document.getElementById('modal-grand-master'),
    victoryLevelNum: document.getElementById('victory-level-num'),
    victoryMovesNum: document.getElementById('victory-moves-num'),
    victoryWorldName: document.getElementById('victory-world-name'),
    victoryStars: document.getElementById('victory-stars'),
    unlockWorldIcon: document.getElementById('unlock-world-icon'),
    unlockWorldTitle: document.getElementById('unlock-world-title'),
    unlockWorldDesc: document.getElementById('unlock-world-desc'),
    worldTabsBar: document.getElementById('world-tabs-bar'),
    levelsScrollArea: document.getElementById('levels-scroll-area'),
    rulesModalTitle: document.getElementById('rules-modal-title'),
    rulesModalContent: document.getElementById('rules-modal-content')
  };

  // --- TOAST NOTIFICATIONS ---
  function showToast(msg, type = 'normal') {
    if (!DOM.toastMessage) return;
    DOM.toastMessage.textContent = msg;
    DOM.toastMessage.className = 'toast-message';
    if (type === 'error') DOM.toastMessage.classList.add('error');
    if (type === 'hint') DOM.toastMessage.classList.add('hint');
  }

  // --- PROGRESS STORAGE ---
  function saveProgress() {
    try {
      const data = {
        unlockedLevel: state.unlockedLevel,
        completedLevels: state.completedLevels,
        levelStars: state.levelStars,
        levelMoves: state.levelMoves,
        soundOn: state.soundOn
      };
      localStorage.setItem('color_flow_adventure_save', JSON.stringify(data));
    } catch (e) {}
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem('color_flow_adventure_save');
      if (raw) {
        const data = JSON.parse(raw);
        state.unlockedLevel = Math.max(1, Math.min(100, data.unlockedLevel || 1));
        state.completedLevels = data.completedLevels || {};
        state.levelStars = data.levelStars || {};
        state.levelMoves = data.levelMoves || {};
        state.soundOn = data.soundOn !== undefined ? data.soundOn : true;
        sound.enabled = state.soundOn;
      }
    } catch (e) {}
  }

  // --- LEVEL LOADER ---
  function loadLevel(lvlNum) {
    hideModals();
    state.currentLevel = Math.max(1, lvlNum);
    const config = getLevelConfig(state.currentLevel);

    state.currentWorld = config.world;
    state.capacity = config.capacity;
    state.containers = config.containers.map(c => [...c]);
    state.initialContainers = config.containers.map(c => [...c]);
    state.selectedIdx = null;
    state.moveCount = 0;
    state.undoStack = [];
    state.isMoving = false;

    // Apply World Theme CSS variables
    applyWorldTheme(config.world);

    // Update HUD display
    DOM.hudLevelText.textContent = `LEVEL ${state.currentLevel} / 100`;
    DOM.hudWorldText.textContent = `${config.world.icon} World ${config.world.id}: ${config.world.name}`;
    
    // World progress fill: 1-10 within current world
    const worldStep = ((state.currentLevel - 1) % 10) + 1;
    DOM.hudWorldProgress.style.width = `${worldStep * 10}%`;

    DOM.hudMovesCount.textContent = '0';
    showToast(`Tap an object or container to select`);

    if (DOM.streamSvg) DOM.streamSvg.innerHTML = '';
    renderBoard();
  }

  function applyWorldTheme(world) {
    const root = document.documentElement;
    root.style.setProperty('--bg-gradient', world.bg);
    root.style.setProperty('--accent-color', world.accent);
    root.style.setProperty('--accent-glow', `${world.accent}66`);
  }

  // --- RENDER DYNAMIC PUZZLE BOARD ACCORDING TO CURRENT WORLD ---
  function renderBoard() {
    if (!DOM.puzzleStage) return;
    DOM.puzzleStage.innerHTML = '';

    const world = state.currentWorld;
    const totalCount = state.containers.length;
    DOM.puzzleStage.classList.toggle('dense', totalCount >= 8);

    state.containers.forEach((layers, idx) => {
      const isCompleted = isContainerCompleted(layers);

      const slot = document.createElement('div');
      slot.className = `slot-container ${state.selectedIdx === idx ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`;
      slot.dataset.index = idx;

      // Outer Vessel Shell styled according to World theme
      const vessel = document.createElement('div');
      vessel.className = `vessel-shell ${world.vesselClass}`;

      // Render items inside vessel from bottom to top
      layers.forEach((colorKey, lIdx) => {
        const colorData = PALETTE[colorKey] || PALETTE.c1;
        const itemNode = createItemNode(world, colorData, colorKey, lIdx === layers.length - 1);
        vessel.appendChild(itemNode);
      });

      // Completion Star badge
      if (isCompleted) {
        const star = document.createElement('div');
        star.className = 'complete-star';
        star.textContent = '⭐';
        slot.appendChild(star);
      }

      slot.appendChild(vessel);

      // Label below container
      const label = document.createElement('span');
      label.className = 'container-label';
      label.textContent = `#${idx + 1}`;
      slot.appendChild(label);

      // Animated Guide Finger on Level 1 start
      if (state.currentLevel === 1 && state.moveCount === 0) {
        if (state.selectedIdx === null && idx === 0) {
          const finger = document.createElement('div');
          finger.className = 'start-guide-finger';
          finger.textContent = '👆';
          slot.appendChild(finger);
        } else if (state.selectedIdx === 0 && idx === 2) {
          const finger = document.createElement('div');
          finger.className = 'start-guide-finger';
          finger.textContent = '👇';
          slot.appendChild(finger);
        }
      }

      // Robust multi-device tap & click handler
      let lastTap = 0;
      const onSlotTap = (e) => {
        if (e) {
          e.stopPropagation();
        }
        const now = Date.now();
        if (now - lastTap < 200) return;
        lastTap = now;
        onContainerTapped(idx);
      };

      slot.addEventListener('click', onSlotTap);
      slot.addEventListener('touchend', onSlotTap, { passive: true });
      slot.addEventListener('pointerup', onSlotTap, { passive: true });

      DOM.puzzleStage.appendChild(slot);
    });

    // Mark valid target containers when a container is selected
    if (state.selectedIdx !== null) {
      markValidTargets(state.selectedIdx);
    }
  }

  // Helper to create world-specific item node
  function createItemNode(world, colorData, colorKey, isTop) {
    const node = document.createElement('div');
    const glyph = world.glyphs[colorKey] || '●';

    switch (world.itemType) {
      case 'water': {
        node.className = `liquid-layer ${isTop ? 'top-layer' : ''}`;
        node.style.backgroundColor = colorData.hex;
        if (Math.random() < 0.6) {
          const bubble = document.createElement('div');
          bubble.className = 'bubble-dot';
          bubble.style.left = `${20 + Math.random() * 55}%`;
          bubble.style.width = `${3 + Math.random() * 4}px`;
          bubble.style.height = bubble.style.width;
          bubble.style.animationDelay = `${Math.random() * 1.5}s`;
          node.appendChild(bubble);
        }
        break;
      }
      case 'screw': {
        node.className = 'screw-item';
        node.style.background = `linear-gradient(135deg, ${colorData.secondary}, ${colorData.hex})`;
        node.innerHTML = `
          <span class="screw-glyph">${glyph}</span>
          <span class="screw-threads"></span>
        `;
        break;
      }
      case 'ball': {
        node.className = 'ball-item';
        node.style.background = `radial-gradient(circle at 35% 35%, ${colorData.secondary}, ${colorData.hex} 80%)`;
        break;
      }
      case 'gem': {
        node.className = 'gem-item';
        node.style.background = `linear-gradient(135deg, ${colorData.secondary}, ${colorData.hex})`;
        node.innerHTML = `<span class="gem-sparkle">${glyph}</span>`;
        break;
      }
      case 'donut': {
        node.className = 'donut-item';
        node.style.background = `linear-gradient(135deg, ${colorData.secondary}, ${colorData.hex})`;
        node.innerHTML = `<span>${glyph}</span>`;
        break;
      }
      case 'potion': {
        node.className = 'potion-layer potion-aura';
        node.style.background = `linear-gradient(90deg, ${colorData.hex}cc, ${colorData.secondary}dd)`;
        node.innerHTML = `<span>${glyph}</span>`;
        break;
      }
      case 'cyber': {
        node.className = 'cyber-core';
        node.style.background = `linear-gradient(135deg, ${colorData.hex}, #042f2e)`;
        node.style.borderColor = colorData.secondary;
        node.innerHTML = `<span>${glyph}</span>`;
        break;
      }
      case 'gear': {
        node.className = 'gear-cog-item';
        node.style.background = `linear-gradient(135deg, ${colorData.secondary}, ${colorData.hex})`;
        node.innerHTML = `<span>${glyph}</span>`;
        break;
      }
      case 'cosmic': {
        node.className = 'cosmic-orb';
        node.style.background = `radial-gradient(circle at 35% 35%, ${colorData.secondary}, ${colorData.hex} 85%)`;
        node.innerHTML = `<span>${glyph}</span>`;
        break;
      }
      case 'master': {
        node.className = 'relic-item';
        node.style.background = `linear-gradient(135deg, ${colorData.secondary}, ${colorData.hex})`;
        node.innerHTML = `<span>${glyph}</span>`;
        break;
      }
      default: {
        node.className = 'liquid-layer';
        node.style.backgroundColor = colorData.hex;
      }
    }

    return node;
  }

  function isContainerCompleted(layers) {
    if (!layers || layers.length !== state.capacity) return false;
    const first = layers[0];
    return layers.every(c => c === first);
  }

  // --- TOUCH & SELECTION INTERACTION ---
  function onContainerTapped(idx) {
    if (state.isMoving) return;
    sound.init();

    // Clear any active hint pulses
    clearHints();

    // 1. No container selected yet -> Select source
    if (state.selectedIdx === null) {
      if (state.containers[idx].length === 0) {
        sound.playInvalid();
        showToast(`Slot #${idx + 1} is empty! Pick one with items.`, 'error');
        shakeContainer(idx);
        return;
      }

      state.selectedIdx = idx;
      sound.playSelect();
      showToast(`Selected #${idx + 1}. Tap destination to transfer.`);
      renderBoard();
      return;
    }

    // 2. Tapped the same container -> Deselect
    if (state.selectedIdx === idx) {
      state.selectedIdx = null;
      sound.playSelect();
      showToast('Deselected. Tap a container to pick up items.');
      renderBoard();
      return;
    }

    // 3. Tapped destination container -> Validate & Move
    const fromIdx = state.selectedIdx;
    const toIdx = idx;

    const fromCont = state.containers[fromIdx];
    const toCont = state.containers[toIdx];

    // Check capacity
    if (toCont.length >= state.capacity) {
      sound.playInvalid();
      showToast(`Cannot move: Slot #${toIdx + 1} is full!`, 'error');
      shakeContainer(toIdx);
      return;
    }

    // Check color / type matching rule
    const fromTopColor = fromCont[fromCont.length - 1];
    if (toCont.length > 0) {
      const toTopColor = toCont[toCont.length - 1];
      if (fromTopColor !== toTopColor) {
        sound.playInvalid();
        showToast("Cannot move: Colors/Items don't match!", 'error');
        shakeContainer(toIdx);
        return;
      }
    }

    // Valid move!
    executeTransfer(fromIdx, toIdx);
  }

  function shakeContainer(idx) {
    if (!DOM.puzzleStage) return;
    const slots = DOM.puzzleStage.querySelectorAll('.slot-container');
    const targetSlot = slots[idx];
    if (targetSlot) {
      targetSlot.classList.remove('shake-invalid');
      void targetSlot.offsetWidth; // Force reflow
      targetSlot.classList.add('shake-invalid');
      setTimeout(() => targetSlot.classList.remove('shake-invalid'), 400);
    }
  }

  function markValidTargets(fromIdx) {
    if (!DOM.puzzleStage) return;
    const fromCont = state.containers[fromIdx];
    if (!fromCont || fromCont.length === 0) return;
    const fromTopColor = fromCont[fromCont.length - 1];

    const slots = DOM.puzzleStage.querySelectorAll('.slot-container');
    slots.forEach((s, idx) => {
      if (idx !== fromIdx) {
        const dest = state.containers[idx];
        if (dest.length < state.capacity) {
          if (dest.length === 0 || dest[dest.length - 1] === fromTopColor) {
            s.classList.add('valid-target');
          }
        }
      }
    });
  }

  // --- EXECUTE TRANSFER WITH WORLD-SPECIFIC ANIMATION ---
  function executeTransfer(fromIdx, toIdx) {
    state.isMoving = true;
    state.selectedIdx = null;

    const fromCont = state.containers[fromIdx];
    const toCont = state.containers[toIdx];
    const topColor = fromCont[fromCont.length - 1];

    // Count consecutive matching items from top of source container
    let matchingCount = 0;
    for (let i = fromCont.length - 1; i >= 0; i--) {
      if (fromCont[i] === topColor) matchingCount++;
      else break;
    }

    const availableSpace = state.capacity - toCont.length;
    const transferCount = Math.min(matchingCount, availableSpace);

    // Save to Undo stack
    state.undoStack.push({
      from: fromIdx,
      to: toIdx,
      color: topColor,
      count: transferCount
    });

    state.moveCount++;
    DOM.hudMovesCount.textContent = state.moveCount;
    showToast(`Transferring from #${fromIdx + 1} to #${toIdx + 1}...`);

    const slots = DOM.puzzleStage.querySelectorAll('.slot-container');
    const fromSlot = slots[fromIdx];
    const toSlot = slots[toIdx];

    const fromRect = fromSlot.getBoundingClientRect();
    const toRect = toSlot.getBoundingClientRect();
    const boardRect = DOM.boardArea.getBoundingClientRect();

    const world = state.currentWorld;
    sound.playMove(world.soundType, toCont.length);

    const colorData = PALETTE[topColor] || PALETTE.c1;

    // A. For Water: Tilt and render curved SVG fluid stream
    if (world.itemType === 'water') {
      const pouringRight = toRect.left > fromRect.left;
      fromSlot.classList.add(pouringRight ? 'tilting-right' : 'tilting-left');

      const startX = (pouringRight ? fromRect.right - 14 : fromRect.left + 14) - boardRect.left;
      const startY = fromRect.top + 20 - boardRect.top;
      const endX = (toRect.left + toRect.width / 2) - boardRect.left;
      const endY = (toRect.top + 35) - boardRect.top;

      DOM.streamSvg.innerHTML = `
        <path class="stream-path" 
              d="M ${startX} ${startY} Q ${(startX + endX) / 2} ${Math.min(startY, endY) - 40}, ${endX} ${endY}"
              stroke="${colorData.hex}" 
              stroke-width="8" 
              stroke-dasharray="12 4" />
      `;

      particles.burst(toRect.left + toRect.width / 2, toRect.top + 35, 14, [colorData.hex, '#ffffff']);
    } else {
      // B. For Solid Objects (Screws, Balls, Gems, Donuts, Runes, Cells, Gears, Orbs, Relics):
      // Animate flying projectile across the stage
      const projectile = document.createElement('div');
      projectile.className = 'flying-projectile';
      projectile.style.left = `${fromRect.left + fromRect.width / 2 - 20}px`;
      projectile.style.top = `${fromRect.top + 10}px`;

      const previewItem = createItemNode(world, colorData, topColor, true);
      previewItem.style.width = '40px';
      previewItem.style.height = '40px';
      projectile.appendChild(previewItem);
      document.body.appendChild(projectile);

      // Trigger translate animation towards destination
      const dx = (toRect.left + toRect.width / 2) - (fromRect.left + fromRect.width / 2);
      const dy = (toRect.top + 15) - (fromRect.top + 10);

      requestAnimationFrame(() => {
        projectile.style.transform = `translate(${dx}px, ${dy}px) rotate(360deg)`;
      });

      // Cleanup flying projectile after animation completes
      setTimeout(() => {
        if (projectile.parentNode) projectile.parentNode.removeChild(projectile);
      }, 340);

      particles.burst(toRect.left + toRect.width / 2, toRect.top + 35, 12, [colorData.hex, colorData.secondary]);
    }

    // Complete data transfer after animation delay
    setTimeout(() => {
      for (let i = 0; i < transferCount; i++) {
        fromCont.pop();
        toCont.push(topColor);
      }

      // Check if target container is now completed
      if (isContainerCompleted(toCont)) {
        sound.playCork();
        particles.burst(toRect.left + toRect.width / 2, toRect.top + toRect.height / 2, 28, [colorData.hex, '#facc15', '#ffffff']);
      }

      fromSlot.classList.remove('tilting-right', 'tilting-left');
      if (DOM.streamSvg) DOM.streamSvg.innerHTML = '';
      state.isMoving = false;

      renderBoard();
      showToast('Tap an object or container to select');

      checkLevelVictory();
    }, 380);
  }

  // --- CHECK WIN CONDITION ---
  function checkLevelVictory() {
    let won = true;

    for (let i = 0; i < state.containers.length; i++) {
      const cont = state.containers[i];
      if (cont.length === 0) continue; // empty container is fine

      if (cont.length !== state.capacity) {
        won = false;
        break;
      }

      const firstColor = cont[0];
      if (!cont.every(c => c === firstColor)) {
        won = false;
        break;
      }
    }

    if (won) {
      sound.playWin();

      let stars = 3;
      if (state.moveCount > 24) stars = 1;
      else if (state.moveCount > 16) stars = 2;

      state.completedLevels[state.currentLevel] = true;
      state.levelStars[state.currentLevel] = Math.max(state.levelStars[state.currentLevel] || 0, stars);
      state.levelMoves[state.currentLevel] = Math.min(state.levelMoves[state.currentLevel] || 999, state.moveCount);

      if (state.currentLevel >= state.unlockedLevel && state.unlockedLevel < 100) {
        state.unlockedLevel = state.currentLevel + 1;
      }

      saveProgress();

      // Check if player completed Level 100
      if (state.currentLevel === 100) {
        particles.burst(window.innerWidth / 2, window.innerHeight * 0.35, 100, ['#facc15', '#ec4899', '#38bdf8', '#10b981']);
        DOM.modalGrandMaster.classList.add('active');
        return;
      }

      // Check if completing the final level of a World (Level 10, 20, 30, etc.)
      if (state.currentLevel % 10 === 0 && state.currentLevel < 100) {
        const nextWorldIdx = state.currentLevel / 10;
        if (nextWorldIdx < WORLDS.length) {
          const nextWorld = WORLDS[nextWorldIdx];
          DOM.unlockWorldIcon.textContent = nextWorld.icon;
          DOM.unlockWorldTitle.textContent = `WORLD ${nextWorld.id}: ${nextWorld.name.toUpperCase()}`;
          DOM.unlockWorldDesc.textContent = nextWorld.desc;
          particles.burst(window.innerWidth / 2, window.innerHeight * 0.4, 60, [nextWorld.accent, '#facc15', '#ffffff']);
          DOM.modalWorldUnlock.classList.add('active');
          return;
        }
      }

      // Standard Level Victory Modal
      DOM.victoryLevelNum.textContent = state.currentLevel;
      DOM.victoryMovesNum.textContent = state.moveCount;
      DOM.victoryWorldName.textContent = state.currentWorld.name;
      DOM.victoryStars.innerHTML = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

      particles.burst(window.innerWidth / 2, window.innerHeight * 0.4, 50);
      DOM.modalVictory.classList.add('active');
    }
  }

  // --- HINT ENGINE ---
  function showHint() {
    if (state.isMoving) return;
    clearHints();

    // Look for any valid move in current board
    for (let fromIdx = 0; fromIdx < state.containers.length; fromIdx++) {
      const fromCont = state.containers[fromIdx];
      if (fromCont.length === 0) continue;

      // Skip already solved containers
      if (isContainerCompleted(fromCont)) continue;

      const topColor = fromCont[fromCont.length - 1];

      for (let toIdx = 0; toIdx < state.containers.length; toIdx++) {
        if (toIdx === fromIdx) continue;
        const toCont = state.containers[toIdx];

        if (toCont.length < state.capacity) {
          if (toCont.length === 0 || toCont[toCont.length - 1] === topColor) {
            // Found a valid move! Highlight containers
            highlightHint(fromIdx, toIdx);
            sound.playSelect();
            showToast(`💡 Hint: Move from #${fromIdx + 1} to #${toIdx + 1}!`, 'hint');
            return;
          }
        }
      }
    }

    showToast('No obvious moves available. Try undoing or restart!', 'error');
  }

  function highlightHint(fromIdx, toIdx) {
    if (!DOM.puzzleStage) return;
    const slots = DOM.puzzleStage.querySelectorAll('.slot-container');
    if (slots[fromIdx]) slots[fromIdx].classList.add('hint-source');
    if (slots[toIdx]) slots[toIdx].classList.add('hint-dest');
  }

  function clearHints() {
    if (!DOM.puzzleStage) return;
    DOM.puzzleStage.querySelectorAll('.slot-container').forEach(s => {
      s.classList.remove('hint-source', 'hint-dest');
    });
  }

  // --- UNDO MOVE ---
  function undoMove() {
    if (state.isMoving || state.undoStack.length === 0) return;
    sound.playUndo();
    clearHints();

    const last = state.undoStack.pop();
    const fromCont = state.containers[last.from];
    const toCont = state.containers[last.to];

    for (let i = 0; i < last.count; i++) {
      toCont.pop();
      fromCont.push(last.color);
    }

    state.moveCount = Math.max(0, state.moveCount - 1);
    DOM.hudMovesCount.textContent = state.moveCount;
    state.selectedIdx = null;

    showToast('Move undone.');
    renderBoard();
  }

  // --- RESTART LEVEL ---
  function restartLevel() {
    hideModals();
    clearHints();
    state.containers = state.initialContainers.map(c => [...c]);
    state.selectedIdx = null;
    state.moveCount = 0;
    state.undoStack = [];
    state.isMoving = false;
    DOM.hudMovesCount.textContent = '0';
    if (DOM.streamSvg) DOM.streamSvg.innerHTML = '';
    showToast('Level restarted. Tap to begin.');
    sound.playSelect();
    renderBoard();
  }

  function nextLevel() {
    hideModals();
    if (state.currentLevel < 100) {
      loadLevel(state.currentLevel + 1);
    } else {
      showLevelsModal();
    }
  }

  // --- 100 LEVEL SELECT MODAL (10 WORLDS) ---
  function showLevelsModal() {
    hideModals();
    DOM.worldTabsBar.innerHTML = '';
    DOM.levelsScrollArea.innerHTML = '';

    const currentWorldIdx = Math.floor((state.currentLevel - 1) / 10);

    WORLDS.forEach((world, wIdx) => {
      const tab = document.createElement('button');
      tab.className = `tab-btn ${wIdx === currentWorldIdx ? 'active' : ''}`;
      tab.textContent = `${world.icon} World ${world.id}`;
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        tab.classList.add('active');
        const block = document.getElementById(`w-block-${wIdx}`);
        if (block) block.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      DOM.worldTabsBar.appendChild(tab);
    });

    WORLDS.forEach((world, wIdx) => {
      const start = wIdx * 10 + 1;
      const end = (wIdx + 1) * 10;

      const block = document.createElement('div');
      block.className = 'world-block';
      block.id = `w-block-${wIdx}`;

      block.innerHTML = `
        <div class="world-block-head">
          <span>${world.icon} World ${world.id}: ${world.name}</span>
          <span style="opacity: 0.75;">Levels ${start}–${end}</span>
        </div>
      `;

      const grid = document.createElement('div');
      grid.className = 'levels-grid';

      for (let l = start; l <= end; l++) {
        const isUnlocked = l <= state.unlockedLevel;
        const isCompleted = !!state.completedLevels[l];
        const isCurrent = l === state.currentLevel;
        const stars = state.levelStars[l] || 0;

        const cell = document.createElement('button');
        cell.className = `level-cell ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`;
        cell.disabled = !isUnlocked;

        let starsText = '';
        if (isCompleted) {
          starsText = `<div class="lvl-stars-mini">${'⭐'.repeat(stars)}</div>`;
        } else if (isUnlocked) {
          starsText = `<div class="lvl-stars-mini" style="color:#38bdf8;">Play</div>`;
        } else {
          starsText = `<div class="lvl-stars-mini">🔒</div>`;
        }

        cell.innerHTML = `
          <span>${l}</span>
          ${starsText}
        `;

        if (isUnlocked) {
          cell.addEventListener('click', (e) => {
            e.preventDefault();
            sound.playSelect();
            loadLevel(l);
          });
        }

        grid.appendChild(cell);
      }

      block.appendChild(grid);
      DOM.levelsScrollArea.appendChild(block);
    });

    DOM.modalLevels.classList.add('active');
  }

  // --- RULES MODAL POPULATION ---
  function showRulesModal() {
    hideModals();
    const world = state.currentWorld;
    DOM.rulesModalTitle.textContent = `${world.icon} World ${world.id}: ${world.name}`;

    DOM.rulesModalContent.innerHTML = `
      <div class="rule-box">
        <span class="r-icon">🎯</span>
        <div>
          <strong>Goal:</strong>
          <p>Organize all items so each container holds only one uniform color or type!</p>
        </div>
      </div>
      <div class="rule-box">
        <span class="r-icon">${world.icon}</span>
        <div>
          <strong>Current Mechanic:</strong>
          <p>${world.desc}</p>
        </div>
      </div>
      <div class="rule-box">
        <span class="r-icon">👆</span>
        <div>
          <strong>Controls:</strong>
          <p>Tap a container to select, then tap another container to transfer matching top items.</p>
        </div>
      </div>
      <div class="rule-box">
        <span class="r-icon">↶</span>
        <div>
          <strong>Undo & Hints:</strong>
          <p>Stuck? Tap ↶ Undo to reverse your step or 💡 Hint to highlight a valid move.</p>
        </div>
      </div>
    `;

    DOM.modalRules.classList.add('active');
  }

  function hideModals() {
    [DOM.modalVictory, DOM.modalWorldUnlock, DOM.modalLevels, DOM.modalRules, DOM.modalGrandMaster].forEach(m => {
      if (m) m.classList.remove('active');
    });
  }

  function toggleSound() {
    state.soundOn = !state.soundOn;
    sound.enabled = state.soundOn;
    DOM.soundIcon.textContent = state.soundOn ? '🔊' : '🔇';
    saveProgress();
  }

  // --- INITIALIZATION ---
  function initGame() {
    loadProgress();
    if (DOM.soundIcon) DOM.soundIcon.textContent = state.soundOn ? '🔊' : '🔇';

    // Action button listeners
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const action = btn.dataset.action;
        sound.init();

        switch (action) {
          case 'undo':
            undoMove();
            break;
          case 'restart':
            restartLevel();
            break;
          case 'hint':
            showHint();
            break;
          case 'next-level':
            nextLevel();
            break;
          case 'open-levels':
            showLevelsModal();
            break;
          case 'open-rules':
            showRulesModal();
            break;
          case 'close-modal':
            hideModals();
            break;
          case 'toggle-sound':
            toggleSound();
            break;
          case 'start-endless':
            hideModals();
            loadLevel(101);
            break;
        }
      });
    });

    // Keyboard shortcuts for PC
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyZ' || (e.ctrlKey && e.code === 'KeyZ')) {
        undoMove();
      } else if (e.code === 'KeyR') {
        restartLevel();
      } else if (e.code === 'KeyH') {
        showHint();
      } else if (e.code === 'Escape') {
        hideModals();
      }
    });

    // Prevent pinch-to-zoom and unwanted double tap zoom
    document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });

    // Fallback: If player taps anywhere on the board area when no container is selected yet
    if (DOM.boardArea) {
      DOM.boardArea.addEventListener('click', (e) => {
        if (e.target.closest('.slot-container') || e.target.closest('button')) return;
        if (state.selectedIdx === null && state.containers.length > 0) {
          for (let i = 0; i < state.containers.length; i++) {
            if (state.containers[i].length > 0) {
              onContainerTapped(i);
              break;
            }
          }
        }
      });
    }

    // Load initial level
    loadLevel(state.unlockedLevel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }

})();
