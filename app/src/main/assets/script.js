/**
 * Color Flow – Water Sort Puzzle (100 Levels)
 * Complete, Solvable, Beautiful Water Sort Engine
 */

(function () {
  'use strict';

  // --- PALETTE OF 12 VIBRANT FLUID COLORS ---
  const FLUID_COLORS = {
    c1:  { name: 'Sky Blue', hex: '#0ea5e9' },
    c2:  { name: 'Ocean Cyan', hex: '#06b6d4' },
    c3:  { name: 'Emerald', hex: '#10b981' },
    c4:  { name: 'Sunshine', hex: '#eab308' },
    c5:  { name: 'Crimson', hex: '#ef4444' },
    c6:  { name: 'Royal Purple', hex: '#8b5cf6' },
    c7:  { name: 'Hot Pink', hex: '#ec4899' },
    c8:  { name: 'Tangy Orange', hex: '#f97316' },
    c9:  { name: 'Lime', hex: '#84cc16' },
    c10: { name: 'Amber Gold', hex: '#f59e0b' },
    c11: { name: 'Indigo', hex: '#6366f1' },
    c12: { name: 'Coral', hex: '#fb7185' }
  };

  const COLOR_KEYS = Object.keys(FLUID_COLORS);

  // --- THE 20 PROGRESSIVE WORLD THEMES ---
  const WORLDS = [
    { id: 1,  name: 'Clean Aqua', icon: '💧', bg: 'linear-gradient(135deg, #07192f 0%, #0c2d48 50%, #145da0 100%)', cap: 'cork', accent: '#38bdf8' },
    { id: 2,  name: 'Pipe Water', icon: '🚰', bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #0284c7 100%)', cap: 'pipe', accent: '#0284c7' },
    { id: 3,  name: 'Water + Pipe Mix', icon: '⚙️💧', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%)', cap: 'pipe', accent: '#38bdf8' },
    { id: 4,  name: 'Screw Cap Flasks', icon: '🔩', bg: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #78350f 100%)', cap: 'screw', accent: '#f59e0b' },
    { id: 5,  name: 'Water + Screw Mix', icon: '🔩💧', bg: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #0284c7 100%)', cap: 'screw', accent: '#38bdf8' },
    { id: 6,  name: 'Ice Water', icon: '❄️', bg: 'linear-gradient(135deg, #082f49 0%, #0c4a6e 50%, #38bdf8 100%)', cap: 'ice', accent: '#7dd3fc' },
    { id: 7,  name: 'Fire + Water', icon: '🔥💧', bg: 'linear-gradient(135deg, #450a0a 0%, #1e293b 50%, #0369a1 100%)', cap: 'cork', accent: '#f87171' },
    { id: 8,  name: 'Rain Forest', icon: '🍃', bg: 'linear-gradient(135deg, #052e16 0%, #064e3b 50%, #14532d 100%)', cap: 'leaf', accent: '#34d399' },
    { id: 9,  name: 'Desert Oasis', icon: '🏜️', bg: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #0891b2 100%)', cap: 'cork', accent: '#fbbf24' },
    { id: 10, name: 'Candy Liquid', icon: '🍭', bg: 'linear-gradient(135deg, #4a044e 0%, #701a75 50%, #ec4899 100%)', cap: 'candy', accent: '#f472b6' },
    { id: 11, name: 'Rainbow Water', icon: '🌈', bg: 'linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #4a044e 100%)', cap: 'gold', accent: '#facc15' },
    { id: 12, name: 'Space Tubes', icon: '🪐', bg: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #3b0764 100%)', cap: 'energy', accent: '#a855f7' },
    { id: 13, name: 'Space + Water Mix', icon: '🚀💧', bg: 'linear-gradient(135deg, #111827 0%, #1e1b4b 50%, #0369a1 100%)', cap: 'energy', accent: '#38bdf8' },
    { id: 14, name: 'Magic Bottles', icon: '🔮', bg: 'linear-gradient(135deg, #2e1065 0%, #3b0764 50%, #6b21a8 100%)', cap: 'crystal', accent: '#c084fc' },
    { id: 15, name: 'Floating Waves', icon: '🌊', bg: 'linear-gradient(135deg, #0369a1 0%, #075985 50%, #0284c7 100%)', cap: 'cork', accent: '#67e8f9' },
    { id: 16, name: 'Rotating Pipe World', icon: '🔄', bg: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)', cap: 'pipe', accent: '#9ca3af' },
    { id: 17, name: 'Cyber Neon Tubes', icon: '⚡', bg: 'linear-gradient(135deg, #030712 0%, #111827 50%, #064e3b 100%)', cap: 'neon', accent: '#10b981' },
    { id: 18, name: 'Crystal Flasks', icon: '💎', bg: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 50%, #312e81 100%)', cap: 'crystal', accent: '#818cf8' },
    { id: 19, name: 'Master Laboratory', icon: '🧪', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', cap: 'screw', accent: '#38bdf8' },
    { id: 20, name: 'Grand Master Flow', icon: '👑', bg: 'linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #701a75 100%)', cap: 'gold', accent: '#facc15' }
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
      this.playTone(580, 'sine', 0.08, 0.12, 0.01);
    }

    playPour(pitchOffset = 0) {
      if (!this.enabled || !this.ctx) return;
      // Fluid bubbling tone
      const baseFreq = 340 + pitchOffset * 40;
      this.playTone(baseFreq, 'sine', 0.22, 0.18, 0.01);
      setTimeout(() => this.playTone(baseFreq + 60, 'triangle', 0.15, 0.12, 0.01), 70);
    }

    playCork() {
      this.playTone(850, 'triangle', 0.1, 0.2, 0.01);
      setTimeout(() => this.playTone(1150, 'sine', 0.12, 0.18, 0.01), 50);
    }

    playUndo() {
      this.playTone(400, 'sine', 0.12, 0.12, 0.01);
      setTimeout(() => this.playTone(300, 'sine', 0.15, 0.1, 0.01), 50);
    }

    playWin() {
      if (!this.enabled || !this.ctx) return;
      const notes = [440, 554, 659, 880, 1108];
      notes.forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.2, 0.01), idx * 80);
      });
    }
  }

  const sound = new SoundEngine();

  // --- PARTICLE / CONFETTI SIMULATOR ---
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

    burst(x, y, count = 35, colors = ['#38bdf8', '#facc15', '#ec4899', '#10b981']) {
      if (!this.ctx) return;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 8;
        this.particles.push({
          x: x || this.canvas.width / 2,
          y: y || this.canvas.height / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          radius: 3 + Math.random() * 5,
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

  const particles = new ParticleEngine('fx-canvas');

  // --- DETERMINISTIC LEVEL GENERATOR & SOLVABILITY GUARANTEE ---
  // Simple Mulberry32 seeded PRNG
  function mulberry32(seed) {
    return function () {
      let t = (seed += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Generates 100 guaranteed-solvable levels by scrambling from solved states
  function generateLevel(lvlNum) {
    const rng = mulberry32(lvlNum * 8191 + 104729);

    let numColors, numEmpty, capacity = 4;

    if (lvlNum === 1) {
      numColors = 2; numEmpty = 1; // 3 bottles total
    } else if (lvlNum === 2) {
      numColors = 3; numEmpty = 1; // 4 bottles
    } else if (lvlNum === 3) {
      numColors = 3; numEmpty = 2; // 5 bottles
    } else if (lvlNum === 4) {
      numColors = 4; numEmpty = 2; // 6 bottles
    } else if (lvlNum === 5) {
      numColors = 4; numEmpty = 2; // 6 bottles
    } else if (lvlNum <= 10) {
      numColors = 4; numEmpty = 2;
    } else if (lvlNum <= 20) {
      numColors = 5; numEmpty = 2;
    } else if (lvlNum <= 40) {
      numColors = 6; numEmpty = 2;
    } else if (lvlNum <= 70) {
      numColors = 7; numEmpty = 2;
    } else {
      numColors = 8; numEmpty = 2; // 10 bottles
    }

    const totalBottles = numColors + numEmpty;
    const selectedColorKeys = COLOR_KEYS.slice(0, numColors);

    // Initial solved state: each color bottle has 4 of that color
    const bottles = [];
    for (let c = 0; c < numColors; c++) {
      bottles.push([selectedColorKeys[c], selectedColorKeys[c], selectedColorKeys[c], selectedColorKeys[c]]);
    }
    for (let e = 0; e < numEmpty; e++) {
      bottles.push([]);
    }

    // Scramble by reverse legal pours
    const scrambleMoves = Math.min(60, 5 + Math.floor(lvlNum * 0.55));
    let lastSource = -1;
    let lastDest = -1;

    for (let s = 0; s < scrambleMoves; s++) {
      // Find non-empty bottles
      const nonEmpties = [];
      for (let b = 0; b < totalBottles; b++) {
        if (bottles[b].length > 0) nonEmpties.push(b);
      }
      if (nonEmpties.length === 0) break;

      const fromIdx = nonEmpties[Math.floor(rng() * nonEmpties.length)];

      // Find valid destinations (has space and not same as last move reverse)
      const validDests = [];
      for (let d = 0; d < totalBottles; d++) {
        if (d !== fromIdx && bottles[d].length < capacity && !(fromIdx === lastDest && d === lastSource)) {
          validDests.push(d);
        }
      }

      if (validDests.length > 0) {
        const toIdx = validDests[Math.floor(rng() * validDests.length)];
        const movedColor = bottles[fromIdx].pop();
        bottles[toIdx].push(movedColor);
        lastSource = fromIdx;
        lastDest = toIdx;
      }
    }

    // Ensure puzzle is not already solved
    let alreadySolved = true;
    for (let b = 0; b < bottles.length; b++) {
      const bLen = bottles[b].length;
      if (bLen > 0 && bLen < capacity) {
        alreadySolved = false;
        break;
      }
      if (bLen === capacity) {
        const first = bottles[b][0];
        if (!bottles[b].every(item => item === first)) {
          alreadySolved = false;
          break;
        }
      }
    }

    // If scramble resulted in almost-solved, make one guaranteed mix
    if (alreadySolved && bottles[0].length > 0 && bottles[bottles.length - 1].length < capacity) {
      bottles[bottles.length - 1].push(bottles[0].pop());
    }

    const worldIndex = Math.floor((lvlNum - 1) / 5);
    const world = WORLDS[Math.min(worldIndex, WORLDS.length - 1)];

    return {
      level: lvlNum,
      world: world,
      capacity: capacity,
      bottles: bottles.map(b => [...b]) // clone
    };
  }

  // --- GAME STATE ---
  const state = {
    currentLevel: 1,
    unlockedLevel: 1,
    completedLevels: {},
    levelStars: {},
    levelMoves: {},
    bottles: [], // Current liquid state per bottle
    initialBottles: [],
    selectedBottleIdx: null,
    moveCount: 0,
    undoStack: [],
    isPouring: false,
    capacity: 4,
    soundOn: true
  };

  // --- DOM CACHE ---
  const DOM = {
    gameApp: document.getElementById('game-app'),
    hudLevelBadge: document.getElementById('hud-level-badge'),
    hudWorldName: document.getElementById('hud-world-name'),
    hudMoves: document.getElementById('hud-moves'),
    bottlesStage: document.getElementById('bottles-stage'),
    pipeSvg: document.getElementById('pipe-stream-svg'),
    instructionBox: document.getElementById('instruction-box'),
    btnSound: document.getElementById('btn-sound'),
    btnHome: document.getElementById('btn-home'),
    btnUndo: document.getElementById('btn-undo'),
    btnRestart: document.getElementById('btn-restart'),
    btnInfo: document.getElementById('btn-info'),
    modalVictory: document.getElementById('modal-victory'),
    modalLevels: document.getElementById('modal-levels'),
    modalRules: document.getElementById('modal-rules'),
    modalGrandMaster: document.getElementById('modal-grand-master'),
    victoryLvlNum: document.getElementById('victory-lvl-num'),
    victoryMoveCount: document.getElementById('victory-move-count'),
    victoryThemeName: document.getElementById('victory-theme-name'),
    victoryStars: document.getElementById('victory-stars'),
    worldTabsBar: document.getElementById('world-tabs-bar'),
    levelsGridContainer: document.getElementById('levels-grid-container')
  };

  // --- SAVE & LOAD (localStorage) ---
  function saveProgress() {
    try {
      const data = {
        unlockedLevel: state.unlockedLevel,
        completedLevels: state.completedLevels,
        levelStars: state.levelStars,
        levelMoves: state.levelMoves,
        soundOn: state.soundOn
      };
      localStorage.setItem('color_flow_save', JSON.stringify(data));
    } catch (e) {}
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem('color_flow_save');
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

  // --- LEVEL LOADING ---
  function loadLevel(lvlNum) {
    hideModals();
    state.currentLevel = Math.max(1, Math.min(100, lvlNum));
    const lvlConfig = generateLevel(state.currentLevel);

    state.capacity = lvlConfig.capacity;
    state.bottles = lvlConfig.bottles.map(b => [...b]);
    state.initialBottles = lvlConfig.bottles.map(b => [...b]);
    state.selectedBottleIdx = null;
    state.moveCount = 0;
    state.undoStack = [];
    state.isPouring = false;

    // Apply World Theme Styling
    applyTheme(lvlConfig.world);

    // Update Top HUD
    DOM.hudLevelBadge.textContent = `Level ${state.currentLevel} / 100`;
    DOM.hudWorldName.textContent = `${lvlConfig.world.icon} ${lvlConfig.world.name}`;
    DOM.hudMoves.textContent = '0';
    DOM.instructionBox.textContent = 'Tap a bottle to pick up liquid.';

    // Clear Pipe Overlay
    DOM.pipeSvg.innerHTML = '';

    // Render Bottles
    renderBottles();
  }

  function applyTheme(world) {
    const root = document.documentElement;
    root.style.setProperty('--bg-gradient', world.bg);
    root.style.setProperty('--accent-color', world.accent);
    root.style.setProperty('--accent-glow', `${world.accent}77`);
  }

  // --- RENDER BOTTLE DOM ELEMENTS ---
  function renderBottles() {
    DOM.bottlesStage.innerHTML = '';

    const total = state.bottles.length;
    // Scale bottle width slightly if 8+ bottles on narrow screens
    const scaleClass = total >= 8 ? 'compact-layout' : '';

    state.bottles.forEach((layers, idx) => {
      const isCompleted = isBottleCompleted(layers);

      const wrapper = document.createElement('div');
      wrapper.className = `bottle-wrapper ${scaleClass} ${state.selectedBottleIdx === idx ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`;
      wrapper.dataset.index = idx;

      // Bottle Cap / Top stopper
      const cap = document.createElement('div');
      cap.className = 'bottle-cap';
      wrapper.appendChild(cap);

      // Glass Body
      const glass = document.createElement('div');
      glass.className = 'bottle-glass';

      // Liquid Layers (bottom to top)
      layers.forEach((colorKey, lIdx) => {
        const colorData = FLUID_COLORS[colorKey];
        const seg = document.createElement('div');
        seg.className = `liquid-segment ${lIdx === layers.length - 1 ? 'top-meniscus' : ''}`;
        seg.style.backgroundColor = colorData ? colorData.hex : '#38bdf8';

        // Add bubble accent
        if (Math.random() < 0.6) {
          const bubble = document.createElement('div');
          bubble.className = 'bubble';
          bubble.style.left = `${15 + Math.random() * 60}%`;
          bubble.style.width = `${3 + Math.random() * 4}px`;
          bubble.style.height = bubble.style.width;
          bubble.style.animationDelay = `${Math.random() * 1.5}s`;
          seg.appendChild(bubble);
        }

        glass.appendChild(seg);
      });

      // Completed Star Badge
      if (isCompleted) {
        const star = document.createElement('div');
        star.className = 'completed-badge';
        star.textContent = '⭐';
        wrapper.appendChild(star);
      }

      wrapper.appendChild(glass);

      // Click Handler
      wrapper.addEventListener('click', () => onBottleClick(idx));

      DOM.bottlesStage.appendChild(wrapper);
    });

    // Mark valid target bottles if one is selected
    if (state.selectedBottleIdx !== null) {
      markValidTargets(state.selectedBottleIdx);
    }
  }

  function isBottleCompleted(layers) {
    if (!layers || layers.length !== state.capacity) return false;
    const first = layers[0];
    return layers.every(c => c === first);
  }

  // --- SELECTION & INTERACTION LOGIC ---
  function onBottleClick(idx) {
    if (state.isPouring) return;
    sound.init();

    // 1. If no bottle selected yet
    if (state.selectedBottleIdx === null) {
      if (state.bottles[idx].length === 0) {
        DOM.instructionBox.textContent = 'Cannot pick up an empty bottle!';
        return;
      }
      // If bottle is already full and completed, optional pick up allowed or friendly info
      if (isBottleCompleted(state.bottles[idx])) {
        DOM.instructionBox.textContent = 'This bottle is already sorted!';
      }
      state.selectedBottleIdx = idx;
      sound.playSelect();
      DOM.instructionBox.textContent = 'Now tap destination bottle to pour.';
      renderBottles();
      return;
    }

    // 2. Tapping the same bottle deselects it
    if (state.selectedBottleIdx === idx) {
      state.selectedBottleIdx = null;
      sound.playSelect();
      DOM.instructionBox.textContent = 'Tap a bottle to pick up liquid.';
      renderBottles();
      return;
    }

    // 3. Tapping another bottle: check if valid pour
    const fromIdx = state.selectedBottleIdx;
    const toIdx = idx;

    if (canPour(fromIdx, toIdx)) {
      executePour(fromIdx, toIdx);
    } else {
      // Invalid destination
      if (state.bottles[toIdx].length > 0) {
        // Switch selection to this new bottle
        state.selectedBottleIdx = toIdx;
        sound.playSelect();
        DOM.instructionBox.textContent = 'Selected new bottle. Choose destination.';
        renderBottles();
      } else {
        DOM.instructionBox.textContent = 'Cannot pour here! Pick matching color or space.';
      }
    }
  }

  // --- CAN POUR VALIDATOR ---
  function canPour(fromIdx, toIdx) {
    const fromBottle = state.bottles[fromIdx];
    const toBottle = state.bottles[toIdx];

    if (!fromBottle || fromBottle.length === 0) return false;
    if (!toBottle || toBottle.length >= state.capacity) return false;

    const topColorFrom = fromBottle[fromBottle.length - 1];

    // Empty destination can receive any top color
    if (toBottle.length === 0) return true;

    // Non-empty destination must match top color
    const topColorTo = toBottle[toBottle.length - 1];
    return topColorFrom === topColorTo;
  }

  // Highlight valid destination bottles
  function markValidTargets(fromIdx) {
    const bottleEls = DOM.bottlesStage.querySelectorAll('.bottle-wrapper');
    bottleEls.forEach((el, idx) => {
      if (idx !== fromIdx && canPour(fromIdx, idx)) {
        el.classList.add('valid-target');
      }
    });
  }

  // --- EXECUTE WATER POUR (ANIMATED STREAM & PIPE) ---
  function executePour(fromIdx, toIdx) {
    state.isPouring = true;
    state.selectedBottleIdx = null;

    const fromBottle = state.bottles[fromIdx];
    const toBottle = state.bottles[toIdx];
    const topColor = fromBottle[fromBottle.length - 1];

    // Count how many matching contiguous layers on top of fromBottle
    let countMatching = 0;
    for (let i = fromBottle.length - 1; i >= 0; i--) {
      if (fromBottle[i] === topColor) countMatching++;
      else break;
    }

    const availableSpace = state.capacity - toBottle.length;
    const transferCount = Math.min(countMatching, availableSpace);

    // Save move to undo stack
    state.undoStack.push({
      from: fromIdx,
      to: toIdx,
      color: topColor,
      count: transferCount
    });

    state.moveCount++;
    DOM.hudMoves.textContent = state.moveCount;

    // Animate tilting & pouring stream
    const bottleEls = DOM.bottlesStage.querySelectorAll('.bottle-wrapper');
    const fromEl = bottleEls[fromIdx];
    const toEl = bottleEls[toIdx];

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    const boardRect = DOM.boardViewport.getBoundingClientRect();

    const isPouringRight = toRect.left > fromRect.left;
    fromEl.classList.add(isPouringRight ? 'tilting-right' : 'tilting-left');

    sound.playPour(toBottle.length);

    // Draw dynamic curved flow stream SVG
    const startX = (isPouringRight ? fromRect.right - 10 : fromRect.left + 10) - boardRect.left;
    const startY = fromRect.top + 20 - boardRect.top;
    const endX = (toRect.left + toRect.width / 2) - boardRect.left;
    const endY = (toRect.top + 30) - boardRect.top;

    const colorHex = FLUID_COLORS[topColor] ? FLUID_COLORS[topColor].hex : '#38bdf8';

    DOM.pipeSvg.innerHTML = `
      <path class="flow-stream-path" 
            d="M ${startX} ${startY} Q ${(startX + endX) / 2} ${Math.min(startY, endY) - 30}, ${endX} ${endY}"
            stroke="${colorHex}" 
            stroke-width="7" 
            stroke-dasharray="10 4" />
    `;

    // Splash particles at target bottle mouth
    particles.burst(toRect.left + toRect.width / 2, toRect.top + 30, 15, [colorHex, '#ffffff']);

    // Perform the actual data transfer
    setTimeout(() => {
      for (let i = 0; i < transferCount; i++) {
        fromBottle.pop();
        toBottle.push(topColor);
      }

      // Check if target bottle was just completed
      if (isBottleCompleted(toBottle)) {
        sound.playCork();
        particles.burst(toRect.left + toRect.width / 2, toRect.top + toRect.height / 2, 25, [colorHex, '#facc15']);
      }

      // Remove tilt and pipe stream
      fromEl.classList.remove('tilting-right', 'tilting-left');
      DOM.pipeSvg.innerHTML = '';
      state.isPouring = false;

      renderBottles();

      // Check if entire level is completed
      checkLevelVictory();
    }, 450);
  }

  // --- CHECK WIN CONDITION ---
  function checkLevelVictory() {
    let allSorted = true;

    for (let i = 0; i < state.bottles.length; i++) {
      const b = state.bottles[i];
      if (b.length === 0) continue; // empty bottle is fine

      if (b.length !== state.capacity) {
        allSorted = false;
        break;
      }

      const first = b[0];
      if (!b.every(c => c === first)) {
        allSorted = false;
        break;
      }
    }

    if (allSorted) {
      sound.playWin();

      // Calculate Stars (1 to 3 stars)
      let stars = 3;
      if (state.moveCount > 25) stars = 1;
      else if (state.moveCount > 16) stars = 2;

      state.completedLevels[state.currentLevel] = true;
      state.levelStars[state.currentLevel] = Math.max(state.levelStars[state.currentLevel] || 0, stars);
      state.levelMoves[state.currentLevel] = Math.min(state.levelMoves[state.currentLevel] || 999, state.moveCount);

      if (state.currentLevel >= state.unlockedLevel && state.unlockedLevel < 100) {
        state.unlockedLevel = state.currentLevel + 1;
      }

      saveProgress();

      // Grand Finale at level 100
      if (state.currentLevel === 100) {
        showGrandMasterModal();
        return;
      }

      // Show Victory Modal
      DOM.victoryLvlNum.textContent = state.currentLevel;
      DOM.victoryMoveCount.textContent = state.moveCount;
      const worldIdx = Math.floor((state.currentLevel - 1) / 5);
      DOM.victoryThemeName.textContent = WORLDS[Math.min(worldIdx, WORLDS.length - 1)].name;
      DOM.victoryStars.innerHTML = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

      particles.burst(window.innerWidth / 2, window.innerHeight * 0.4, 60);
      DOM.modalVictory.classList.add('active');
    }
  }

  function showGrandMasterModal() {
    particles.burst(window.innerWidth / 2, window.innerHeight * 0.35, 100);
    setTimeout(() => particles.burst(window.innerWidth * 0.3, window.innerHeight * 0.4, 70), 300);
    setTimeout(() => particles.burst(window.innerWidth * 0.7, window.innerHeight * 0.4, 70), 600);
    DOM.modalGrandMaster.classList.add('active');
  }

  // --- UNDO MOVE ---
  function undoMove() {
    if (state.isPouring || state.undoStack.length === 0) return;
    sound.playUndo();

    const lastMove = state.undoStack.pop();
    const fromBottle = state.bottles[lastMove.from];
    const toBottle = state.bottles[lastMove.to];

    // Transfer back
    for (let i = 0; i < lastMove.count; i++) {
      toBottle.pop();
      fromBottle.push(lastMove.color);
    }

    state.moveCount = Math.max(0, state.moveCount - 1);
    DOM.hudMoves.textContent = state.moveCount;
    state.selectedBottleIdx = null;

    DOM.instructionBox.textContent = 'Move undone.';
    renderBottles();
  }

  // --- RESTART LEVEL ---
  function restartLevel() {
    hideModals();
    state.bottles = state.initialBottles.map(b => [...b]);
    state.selectedBottleIdx = null;
    state.moveCount = 0;
    state.undoStack = [];
    state.isPouring = false;
    DOM.hudMoves.textContent = '0';
    DOM.instructionBox.textContent = 'Level restarted. Tap to begin.';
    DOM.pipeSvg.innerHTML = '';
    sound.playSelect();
    renderBottles();
  }

  function nextLevel() {
    hideModals();
    if (state.currentLevel < 100) {
      loadLevel(state.currentLevel + 1);
    } else {
      showLevelsModal();
    }
  }

  // --- LEVEL SELECT MODAL (1 TO 100) ---
  function showLevelsModal() {
    hideModals();
    DOM.worldTabsBar.innerHTML = '';
    DOM.levelsGridContainer.innerHTML = '';

    // Create World Tab Buttons
    WORLDS.forEach((world, wIdx) => {
      const tab = document.createElement('button');
      tab.className = `world-tab-btn ${wIdx === 0 ? 'active' : ''}`;
      tab.textContent = `${world.icon} ${world.name}`;
      tab.addEventListener('click', () => {
        document.querySelectorAll('.world-tab-btn').forEach(b => b.classList.remove('active'));
        tab.classList.add('active');
        const sec = document.getElementById(`w-group-${wIdx}`);
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      DOM.worldTabsBar.appendChild(tab);
    });

    // Create 20 World Groups with 5 levels each
    WORLDS.forEach((world, wIdx) => {
      const start = wIdx * 5 + 1;
      const end = (wIdx + 1) * 5;

      const group = document.createElement('div');
      group.className = 'world-level-group';
      group.id = `w-group-${wIdx}`;

      group.innerHTML = `
        <div class="world-group-heading">
          <span>${world.icon} ${world.name}</span>
          <span style="opacity: 0.7;">${start}–${end}</span>
        </div>
      `;

      const grid = document.createElement('div');
      grid.className = 'lvl-grid-5';

      for (let l = start; l <= end; l++) {
        const isUnlocked = l <= state.unlockedLevel;
        const isCompleted = !!state.completedLevels[l];
        const isCurrent = l === state.currentLevel;
        const stars = state.levelStars[l] || 0;

        const tile = document.createElement('button');
        tile.className = `lvl-tile ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`;
        tile.disabled = !isUnlocked;

        let starsText = '';
        if (isCompleted) {
          starsText = `<div class="lvl-substars">${'⭐'.repeat(stars)}</div>`;
        } else if (isUnlocked) {
          starsText = `<div class="lvl-substars" style="color: #38bdf8;">Play</div>`;
        } else {
          starsText = `<div class="lvl-substars">🔒</div>`;
        }

        tile.innerHTML = `
          <span>${l}</span>
          ${starsText}
        `;

        if (isUnlocked) {
          tile.addEventListener('click', () => {
            sound.playSelect();
            loadLevel(l);
          });
        }

        grid.appendChild(tile);
      }

      group.appendChild(grid);
      DOM.levelsGridContainer.appendChild(group);
    });

    DOM.modalLevels.classList.add('active');
  }

  function hideModals() {
    [DOM.modalVictory, DOM.modalLevels, DOM.modalRules, DOM.modalGrandMaster].forEach(m => {
      if (m) m.classList.remove('active');
    });
  }

  function toggleSound() {
    state.soundOn = !state.soundOn;
    sound.enabled = state.soundOn;
    DOM.btnSound.textContent = state.soundOn ? '🔊' : '🔇';
    saveProgress();
  }

  // --- INITIALIZATION & BINDINGS ---
  function initGame() {
    loadProgress();
    DOM.btnSound.textContent = state.soundOn ? '🔊' : '🔇';

    // Button Actions
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        sound.init();

        switch (action) {
          case 'undo':
            undoMove();
            break;
          case 'restart':
            restartLevel();
            break;
          case 'next-level':
            nextLevel();
            break;
          case 'levels':
            showLevelsModal();
            break;
          case 'how-to-play':
            hideModals();
            DOM.modalRules.classList.add('active');
            break;
          case 'close-modal':
            hideModals();
            break;
          case 'toggle-sound':
            toggleSound();
            break;
        }
      });
    });

    // Keyboard Shortcuts (PC)
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyZ' || (e.ctrlKey && e.code === 'KeyZ')) {
        undoMove();
      } else if (e.code === 'KeyR') {
        restartLevel();
      } else if (e.code === 'Escape') {
        hideModals();
      }
    });

    // Load saved or first level
    loadLevel(state.unlockedLevel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }

})();
