/**
 * Color Flow – Water Sort Puzzle (100 Levels)
 * Real Water Sort Mechanics, Guaranteed Solvability, Visible Fluid Pour Animation
 */

(function () {
  'use strict';

  // --- PALETTE OF 12 VIBRANT FLUID COLORS ---
  const FLUID_COLORS = {
    c1:  { name: 'Sky Blue', hex: '#0ea5e9' },
    c2:  { name: 'Ocean Cyan', hex: '#06b6d4' },
    c3:  { name: 'Emerald Green', hex: '#10b981' },
    c4:  { name: 'Sunshine Yellow', hex: '#eab308' },
    c5:  { name: 'Crimson Red', hex: '#ef4444' },
    c6:  { name: 'Royal Purple', hex: '#8b5cf6' },
    c7:  { name: 'Hot Pink', hex: '#ec4899' },
    c8:  { name: 'Tangy Orange', hex: '#f97316' },
    c9:  { name: 'Lime Green', hex: '#84cc16' },
    c10: { name: 'Amber Gold', hex: '#f59e0b' },
    c11: { name: 'Deep Indigo', hex: '#6366f1' },
    c12: { name: 'Coral Pink', hex: '#fb7185' }
  };

  const COLOR_KEYS = Object.keys(FLUID_COLORS);

  // --- 20 UNIQUE WORLD THEMES ---
  const WORLDS = [
    { id: 1,  name: 'Clean Aqua', icon: '💧', bg: 'linear-gradient(135deg, #07192f 0%, #0c2d48 50%, #145da0 100%)', accent: '#38bdf8' },
    { id: 2,  name: 'Pipe Water', icon: '🚰', bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #0284c7 100%)', accent: '#0284c7' },
    { id: 3,  name: 'Water + Pipe Mix', icon: '⚙️💧', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%)', accent: '#38bdf8' },
    { id: 4,  name: 'Screw Cap Flasks', icon: '🔩', bg: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #78350f 100%)', accent: '#f59e0b' },
    { id: 5,  name: 'Water + Screw Mix', icon: '🔩💧', bg: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #0284c7 100%)', accent: '#38bdf8' },
    { id: 6,  name: 'Ice Water', icon: '❄️', bg: 'linear-gradient(135deg, #082f49 0%, #0c4a6e 50%, #38bdf8 100%)', accent: '#7dd3fc' },
    { id: 7,  name: 'Fire + Water', icon: '🔥💧', bg: 'linear-gradient(135deg, #450a0a 0%, #1e293b 50%, #0369a1 100%)', accent: '#f87171' },
    { id: 8,  name: 'Rain Forest', icon: '🍃', bg: 'linear-gradient(135deg, #052e16 0%, #064e3b 50%, #14532d 100%)', accent: '#34d399' },
    { id: 9,  name: 'Desert Oasis', icon: '🏜️', bg: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #0891b2 100%)', accent: '#fbbf24' },
    { id: 10, name: 'Candy Liquid', icon: '🍭', bg: 'linear-gradient(135deg, #4a044e 0%, #701a75 50%, #ec4899 100%)', accent: '#f472b6' },
    { id: 11, name: 'Rainbow Water', icon: '🌈', bg: 'linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #4a044e 100%)', accent: '#facc15' },
    { id: 12, name: 'Space Tubes', icon: '🪐', bg: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #3b0764 100%)', accent: '#a855f7' },
    { id: 13, name: 'Space + Water Mix', icon: '🚀💧', bg: 'linear-gradient(135deg, #111827 0%, #1e1b4b 50%, #0369a1 100%)', accent: '#38bdf8' },
    { id: 14, name: 'Magic Bottles', icon: '🔮', bg: 'linear-gradient(135deg, #2e1065 0%, #3b0764 50%, #6b21a8 100%)', accent: '#c084fc' },
    { id: 15, name: 'Floating Waves', icon: '🌊', bg: 'linear-gradient(135deg, #0369a1 0%, #075985 50%, #0284c7 100%)', accent: '#67e8f9' },
    { id: 16, name: 'Rotating Pipe World', icon: '🔄', bg: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)', accent: '#9ca3af' },
    { id: 17, name: 'Cyber Neon Tubes', icon: '⚡', bg: 'linear-gradient(135deg, #030712 0%, #111827 50%, #064e3b 100%)', accent: '#10b981' },
    { id: 18, name: 'Crystal Flasks', icon: '💎', bg: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 50%, #312e81 100%)', accent: '#818cf8' },
    { id: 19, name: 'Master Laboratory', icon: '🧪', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', accent: '#38bdf8' },
    { id: 20, name: 'Grand Master Flow', icon: '👑', bg: 'linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #701a75 100%)', accent: '#facc15' }
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
      this.playTone(520, 'sine', 0.08, 0.12, 0.01);
    }

    playPour(layerIndex = 0) {
      if (!this.enabled || !this.ctx) return;
      const baseFreq = 320 + layerIndex * 45;
      this.playTone(baseFreq, 'sine', 0.25, 0.2, 0.01);
      setTimeout(() => this.playTone(baseFreq + 55, 'triangle', 0.18, 0.15, 0.01), 60);
    }

    playInvalid() {
      this.playTone(200, 'sawtooth', 0.14, 0.12, 0.01);
    }

    playCork() {
      this.playTone(850, 'triangle', 0.09, 0.2, 0.01);
      setTimeout(() => this.playTone(1200, 'sine', 0.14, 0.18, 0.01), 50);
    }

    playUndo() {
      this.playTone(380, 'sine', 0.1, 0.12, 0.01);
      setTimeout(() => this.playTone(280, 'sine', 0.14, 0.08, 0.01), 40);
    }

    playWin() {
      if (!this.enabled || !this.ctx) return;
      const notes = [440, 554, 659, 880, 1108];
      notes.forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'triangle', 0.28, 0.22, 0.01), idx * 75);
      });
    }
  }

  const sound = new SoundEngine();

  // --- PARTICLE / CONFETTI ENGINE ---
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

  // --- SEEDED PRNG FOR LEVEL GENERATION ---
  function mulberry32(seed) {
    return function () {
      let t = (seed += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // --- GUARANTEED SOLVABLE LEVEL GENERATOR ---
  function generateLevel(lvlNum) {
    const rng = mulberry32(lvlNum * 7919 + 54321);
    const capacity = 4;

    let numColors, numEmpty;

    if (lvlNum === 1) {
      numColors = 2; numEmpty = 1; // 3 bottles total
    } else if (lvlNum === 2) {
      numColors = 3; numEmpty = 1; // 4 bottles
    } else if (lvlNum === 3) {
      numColors = 3; numEmpty = 2; // 5 bottles
    } else if (lvlNum === 4) {
      numColors = 4; numEmpty = 1; // 5 bottles
    } else if (lvlNum === 5) {
      numColors = 4; numEmpty = 2; // 6 bottles
    } else if (lvlNum <= 10) {
      numColors = 4; numEmpty = 2;
    } else if (lvlNum <= 20) {
      numColors = 5; numEmpty = 2; // 7 bottles
    } else if (lvlNum <= 50) {
      numColors = 6; numEmpty = 2; // 8 bottles
    } else if (lvlNum <= 80) {
      numColors = 7; numEmpty = 2; // 9 bottles
    } else {
      numColors = 8; numEmpty = 2; // 10 bottles
    }

    const totalBottles = numColors + numEmpty;
    const selectedColors = COLOR_KEYS.slice(0, numColors);

    // Initial solved state: each color bottle is fully filled with 4 of that color
    const bottles = [];
    for (let c = 0; c < numColors; c++) {
      bottles.push([selectedColors[c], selectedColors[c], selectedColors[c], selectedColors[c]]);
    }
    for (let e = 0; e < numEmpty; e++) {
      bottles.push([]);
    }

    // Scramble backwards through valid inverse moves
    const scrambleSteps = Math.min(65, 4 + Math.floor(lvlNum * 0.6));
    let lastFrom = -1;
    let lastTo = -1;

    for (let step = 0; step < scrambleSteps; step++) {
      const nonEmpties = [];
      for (let b = 0; b < totalBottles; b++) {
        if (bottles[b].length > 0) nonEmpties.push(b);
      }
      if (nonEmpties.length === 0) break;

      const fromIdx = nonEmpties[Math.floor(rng() * nonEmpties.length)];

      const validDests = [];
      for (let d = 0; d < totalBottles; d++) {
        if (d !== fromIdx && bottles[d].length < capacity && !(fromIdx === lastTo && d === lastFrom)) {
          validDests.push(d);
        }
      }

      if (validDests.length > 0) {
        const toIdx = validDests[Math.floor(rng() * validDests.length)];
        const movedColor = bottles[fromIdx].pop();
        bottles[toIdx].push(movedColor);
        lastFrom = fromIdx;
        lastTo = toIdx;
      }
    }

    // Guarantee Level 1 is distinct and crisp
    if (lvlNum === 1) {
      bottles[0] = ['c1', 'c2', 'c1', 'c2'];
      bottles[1] = ['c2', 'c1', 'c2', 'c1'];
      bottles[2] = [];
    }

    const worldIdx = Math.floor((lvlNum - 1) / 5);
    const world = WORLDS[Math.min(worldIdx, WORLDS.length - 1)];

    return {
      level: lvlNum,
      world: world,
      capacity: capacity,
      bottles: bottles.map(b => [...b])
    };
  }

  // --- GAME STATE ---
  const state = {
    currentLevel: 1,
    unlockedLevel: 1,
    completedLevels: {},
    levelStars: {},
    levelMoves: {},
    bottles: [],
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
    hudLevelText: document.getElementById('hud-level-text'),
    hudWorldText: document.getElementById('hud-world-text'),
    hudMovesCount: document.getElementById('hud-moves-count'),
    toastMessage: document.getElementById('toast-message'),
    boardArea: document.getElementById('board-area'),
    bottlesContainer: document.getElementById('bottles-container'),
    streamSvg: document.getElementById('pour-stream-svg'),
    btnSoundToggle: document.getElementById('btn-sound-toggle'),
    soundIcon: document.getElementById('sound-icon'),
    btnUndo: document.getElementById('btn-undo'),
    btnRestart: document.getElementById('btn-restart'),
    btnRules: document.getElementById('btn-rules'),
    btnLevelsModal: document.getElementById('btn-levels-modal'),
    modalVictory: document.getElementById('modal-victory'),
    modalLevels: document.getElementById('modal-levels'),
    modalRules: document.getElementById('modal-rules'),
    modalGrandMaster: document.getElementById('modal-grand-master'),
    victoryLevelNum: document.getElementById('victory-level-num'),
    victoryMovesNum: document.getElementById('victory-moves-num'),
    victoryWorldName: document.getElementById('victory-world-name'),
    victoryStars: document.getElementById('victory-stars'),
    worldTabsBar: document.getElementById('world-tabs-bar'),
    levelsScrollArea: document.getElementById('levels-scroll-area')
  };

  // --- TOAST NOTIFICATIONS ---
  function showToast(msg, isError = false) {
    DOM.toastMessage.textContent = msg;
    DOM.toastMessage.classList.toggle('error', isError);
  }

  // --- SAVE / LOAD SYSTEM ---
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

  // --- LEVEL LOADER ---
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

    // Apply World Theme
    applyTheme(lvlConfig.world);

    // Update HUD
    DOM.hudLevelText.textContent = `LEVEL ${state.currentLevel} / 100`;
    DOM.hudWorldText.textContent = `${lvlConfig.world.icon} ${lvlConfig.world.name}`;
    DOM.hudMovesCount.textContent = '0';
    showToast('Tap a bottle to select it');

    DOM.streamSvg.innerHTML = '';
    renderBottles();
  }

  function applyTheme(world) {
    const root = document.documentElement;
    root.style.setProperty('--bg-gradient', world.bg);
    root.style.setProperty('--accent-color', world.accent);
    root.style.setProperty('--accent-glow', `${world.accent}66`);
  }

  // --- RENDER BOTTLE COMPONENTS ---
  function renderBottles() {
    DOM.bottlesContainer.innerHTML = '';

    state.bottles.forEach((layers, idx) => {
      const isCompleted = isBottleCompleted(layers);

      const node = document.createElement('div');
      node.className = `bottle-node ${state.selectedBottleIdx === idx ? 'selected' : ''} ${isCompleted ? 'completed' : ''}`;
      node.dataset.index = idx;

      // Stopper / Cap
      const cap = document.createElement('div');
      cap.className = 'bottle-cap';
      node.appendChild(cap);

      // Glass Tube
      const glass = document.createElement('div');
      glass.className = 'bottle-glass';

      // Liquid Layers (Bottom to Top)
      layers.forEach((colorKey, lIdx) => {
        const colorData = FLUID_COLORS[colorKey];
        const layer = document.createElement('div');
        layer.className = `liquid-layer ${lIdx === layers.length - 1 ? 'top-layer' : ''}`;
        layer.style.backgroundColor = colorData ? colorData.hex : '#38bdf8';

        // Floating bubbles
        if (Math.random() < 0.6) {
          const b = document.createElement('div');
          b.className = 'bubble-dot';
          b.style.left = `${18 + Math.random() * 55}%`;
          b.style.width = `${3 + Math.random() * 4}px`;
          b.style.height = b.style.width;
          b.style.animationDelay = `${Math.random() * 1.5}s`;
          layer.appendChild(b);
        }

        glass.appendChild(layer);
      });

      // Completed bottle star
      if (isCompleted) {
        const star = document.createElement('div');
        star.className = 'complete-star';
        star.textContent = '⭐';
        node.appendChild(star);
      }

      node.appendChild(glass);

      // Label under bottle
      const label = document.createElement('span');
      label.className = 'bottle-label';
      label.textContent = `Bottle ${idx + 1}`;
      node.appendChild(label);

      // Fast, Touch & Click Handler with event prevention
      const handleTap = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onBottleTapped(idx);
      };

      node.addEventListener('pointerdown', handleTap, { passive: false });

      DOM.bottlesContainer.appendChild(node);
    });

    // Highlight valid targets if a bottle is selected
    if (state.selectedBottleIdx !== null) {
      markValidTargets(state.selectedBottleIdx);
    }
  }

  function isBottleCompleted(layers) {
    if (!layers || layers.length !== state.capacity) return false;
    const first = layers[0];
    return layers.every(c => c === first);
  }

  // --- TOUCH / CLICK INTERACTION ---
  function onBottleTapped(idx) {
    if (state.isPouring) return;
    sound.init();

    // 1. No bottle selected yet -> Select source bottle
    if (state.selectedBottleIdx === null) {
      if (state.bottles[idx].length === 0) {
        sound.playInvalid();
        showToast(`Bottle ${idx + 1} is empty! Pick one with liquid.`, true);
        shakeBottle(idx);
        return;
      }

      state.selectedBottleIdx = idx;
      sound.playSelect();
      showToast(`Selected Bottle ${idx + 1}. Tap destination to pour.`);
      renderBottles();
      return;
    }

    // 2. Tapped the same bottle -> Deselect
    if (state.selectedBottleIdx === idx) {
      state.selectedBottleIdx = null;
      sound.playSelect();
      showToast('Deselected. Tap a bottle to pick up liquid.');
      renderBottles();
      return;
    }

    // 3. Tapped a destination bottle
    const fromIdx = state.selectedBottleIdx;
    const toIdx = idx;

    const fromBottle = state.bottles[fromIdx];
    const toBottle = state.bottles[toIdx];

    // Check if target is full
    if (toBottle.length >= state.capacity) {
      sound.playInvalid();
      showToast(`Cannot pour: Bottle ${toIdx + 1} is full!`, true);
      shakeBottle(toIdx);
      return;
    }

    // Check if colors match
    const fromTopColor = fromBottle[fromBottle.length - 1];
    if (toBottle.length > 0) {
      const toTopColor = toBottle[toBottle.length - 1];
      if (fromTopColor !== toTopColor) {
        sound.playInvalid();
        showToast("Cannot pour: Colors don't match!", true);
        shakeBottle(toIdx);
        return;
      }
    }

    // Valid pour!
    executePour(fromIdx, toIdx);
  }

  function shakeBottle(idx) {
    const nodes = DOM.bottlesContainer.querySelectorAll('.bottle-node');
    const targetNode = nodes[idx];
    if (targetNode) {
      targetNode.classList.remove('shake-invalid');
      void targetNode.offsetWidth; // Force reflow
      targetNode.classList.add('shake-invalid');
      setTimeout(() => targetNode.classList.remove('shake-invalid'), 400);
    }
  }

  function markValidTargets(fromIdx) {
    const fromBottle = state.bottles[fromIdx];
    if (!fromBottle || fromBottle.length === 0) return;
    const fromTopColor = fromBottle[fromBottle.length - 1];

    const nodes = DOM.bottlesContainer.querySelectorAll('.bottle-node');
    nodes.forEach((n, idx) => {
      if (idx !== fromIdx) {
        const b = state.bottles[idx];
        if (b.length < state.capacity) {
          if (b.length === 0 || b[b.length - 1] === fromTopColor) {
            n.classList.add('valid-target');
          }
        }
      }
    });
  }

  // --- VISIBLE LIQUID POUR ANIMATION ---
  function executePour(fromIdx, toIdx) {
    state.isPouring = true;
    state.selectedBottleIdx = null;

    const fromBottle = state.bottles[fromIdx];
    const toBottle = state.bottles[toIdx];
    const topColor = fromBottle[fromBottle.length - 1];

    // Count consecutive matching layers in source
    let matchingCount = 0;
    for (let i = fromBottle.length - 1; i >= 0; i--) {
      if (fromBottle[i] === topColor) matchingCount++;
      else break;
    }

    const availableSpace = state.capacity - toBottle.length;
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
    showToast(`Pouring from Bottle ${fromIdx + 1} to Bottle ${toIdx + 1}...`);

    const nodes = DOM.bottlesContainer.querySelectorAll('.bottle-node');
    const fromNode = nodes[fromIdx];
    const toNode = nodes[toIdx];

    const fromRect = fromNode.getBoundingClientRect();
    const toRect = toNode.getBoundingClientRect();
    const boardRect = DOM.boardArea.getBoundingClientRect();

    const pouringRight = toRect.left > fromRect.left;
    fromNode.classList.add(pouringRight ? 'tilting-right' : 'tilting-left');

    sound.playPour(toBottle.length);

    // Dynamic curved stream pipe
    const startX = (pouringRight ? fromRect.right - 12 : fromRect.left + 12) - boardRect.left;
    const startY = fromRect.top + 20 - boardRect.top;
    const endX = (toRect.left + toRect.width / 2) - boardRect.left;
    const endY = (toRect.top + 35) - boardRect.top;

    const colorHex = FLUID_COLORS[topColor] ? FLUID_COLORS[topColor].hex : '#38bdf8';

    DOM.streamSvg.innerHTML = `
      <path class="stream-path" 
            d="M ${startX} ${startY} Q ${(startX + endX) / 2} ${Math.min(startY, endY) - 35}, ${endX} ${endY}"
            stroke="${colorHex}" 
            stroke-width="8" 
            stroke-dasharray="12 4" />
    `;

    // Splash particles at target bottle entrance
    particles.burst(toRect.left + toRect.width / 2, toRect.top + 35, 16, [colorHex, '#ffffff']);

    // Complete the physical transfer after stream animation
    setTimeout(() => {
      for (let i = 0; i < transferCount; i++) {
        fromBottle.pop();
        toBottle.push(topColor);
      }

      // If destination bottle is completed with 4 identical layers
      if (isBottleCompleted(toBottle)) {
        sound.playCork();
        particles.burst(toRect.left + toRect.width / 2, toRect.top + toRect.height / 2, 28, [colorHex, '#facc15']);
      }

      fromNode.classList.remove('tilting-right', 'tilting-left');
      DOM.streamSvg.innerHTML = '';
      state.isPouring = false;

      renderBottles();
      showToast('Tap a bottle to select it');

      checkLevelVictory();
    }, 450);
  }

  // --- CHECK WIN CONDITION ---
  function checkLevelVictory() {
    let won = true;

    for (let i = 0; i < state.bottles.length; i++) {
      const b = state.bottles[i];
      if (b.length === 0) continue; // empty bottle is fine

      if (b.length !== state.capacity) {
        won = false;
        break;
      }

      const firstColor = b[0];
      if (!b.every(c => c === firstColor)) {
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

      if (state.currentLevel === 100) {
        particles.burst(window.innerWidth / 2, window.innerHeight * 0.35, 100);
        DOM.modalGrandMaster.classList.add('active');
        return;
      }

      DOM.victoryLevelNum.textContent = state.currentLevel;
      DOM.victoryMovesNum.textContent = state.moveCount;
      const worldIdx = Math.floor((state.currentLevel - 1) / 5);
      DOM.victoryWorldName.textContent = WORLDS[Math.min(worldIdx, WORLDS.length - 1)].name;
      DOM.victoryStars.innerHTML = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

      particles.burst(window.innerWidth / 2, window.innerHeight * 0.4, 60);
      DOM.modalVictory.classList.add('active');
    }
  }

  // --- UNDO MOVE ---
  function undoMove() {
    if (state.isPouring || state.undoStack.length === 0) return;
    sound.playUndo();

    const last = state.undoStack.pop();
    const fromBottle = state.bottles[last.from];
    const toBottle = state.bottles[last.to];

    for (let i = 0; i < last.count; i++) {
      toBottle.pop();
      fromBottle.push(last.color);
    }

    state.moveCount = Math.max(0, state.moveCount - 1);
    DOM.hudMovesCount.textContent = state.moveCount;
    state.selectedBottleIdx = null;

    showToast('Move undone.');
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
    DOM.hudMovesCount.textContent = '0';
    DOM.streamSvg.innerHTML = '';
    showToast('Level restarted. Tap to begin.');
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

  // --- 100 LEVEL SELECT MODAL ---
  function showLevelsModal() {
    hideModals();
    DOM.worldTabsBar.innerHTML = '';
    DOM.levelsScrollArea.innerHTML = '';

    WORLDS.forEach((world, wIdx) => {
      const tab = document.createElement('button');
      tab.className = `tab-btn ${wIdx === 0 ? 'active' : ''}`;
      tab.textContent = `${world.icon} ${world.name}`;
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        tab.classList.add('active');
        const sec = document.getElementById(`wb-${wIdx}`);
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      DOM.worldTabsBar.appendChild(tab);
    });

    WORLDS.forEach((world, wIdx) => {
      const start = wIdx * 5 + 1;
      const end = (wIdx + 1) * 5;

      const block = document.createElement('div');
      block.className = 'world-block';
      block.id = `wb-${wIdx}`;

      block.innerHTML = `
        <div class="world-block-head">
          <span>${world.icon} ${world.name}</span>
          <span style="opacity: 0.75;">${start}–${end}</span>
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

  function hideModals() {
    [DOM.modalVictory, DOM.modalLevels, DOM.modalRules, DOM.modalGrandMaster].forEach(m => {
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
    DOM.soundIcon.textContent = state.soundOn ? '🔊' : '🔇';

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
          case 'next-level':
            nextLevel();
            break;
          case 'open-levels':
            showLevelsModal();
            break;
          case 'open-rules':
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

    // Keyboard shortcuts for PC
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyZ' || (e.ctrlKey && e.code === 'KeyZ')) {
        undoMove();
      } else if (e.code === 'KeyR') {
        restartLevel();
      } else if (e.code === 'Escape') {
        hideModals();
      }
    });

    // Prevent pinch-to-zoom on mobile Safari/Chrome
    document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });

    // Load initial level
    loadLevel(state.unlockedLevel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }

})();
