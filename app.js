/* ===================================================================
   BOG – Ficha de Personagem D&D 5e — App Logic
   =================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     CONSTANTS & DATA
     ------------------------------------------------------------------ */
  const HP_MAX = 10;
  const HP_MIN = 0;
  const STORAGE_KEY = 'bog-sheet-state';

  const SPELLS = [
    // Cantrips
    {
      name: 'Orientação',
      nameEn: 'Guidance',
      level: 0,
      school: 'Adivinhação',
      castTime: '1 ação',
      range: 'Toque',
      duration: 'Concentração, até 1 minuto',
      tags: ['concentration'],
      domain: false,
      desc: 'Você toca uma criatura voluntária. Uma vez antes da magia terminar, o alvo pode rolar <strong>1d4</strong> e adicionar o resultado a um teste de habilidade de sua escolha. Pode rolar o dado antes ou depois de fazer o teste.'
    },
    {
      name: 'Chama Sagrada',
      nameEn: 'Sacred Flame',
      level: 0,
      school: 'Evocação',
      castTime: '1 ação',
      range: '18 m (60 ft)',
      duration: 'Instantânea',
      tags: [],
      domain: false,
      desc: 'Uma luminosidade como a de uma chama desce sobre uma criatura que você possa ver no alcance. O alvo deve ter sucesso em um <strong>TR de Destreza</strong> ou sofrer <strong>1d8 de dano radiante</strong>. O alvo não se beneficia de cobertura para esse teste.'
    },
    {
      name: 'Luz',
      nameEn: 'Light',
      level: 0,
      school: 'Evocação',
      castTime: '1 ação',
      range: 'Toque',
      duration: '1 hora',
      tags: [],
      domain: false,
      desc: 'Você toca um objeto de até 3 metros. Até a magia acabar, o objeto emite <strong>luz plena num raio de 6 m</strong> e luz penumbra por mais 6 m. A luz pode ser de qualquer cor. Cobrir o objeto bloqueia a luz. A magia acaba se lançada novamente ou dissipada.'
    },
    {
      name: 'Resistência',
      nameEn: 'Resistance',
      level: 0,
      school: 'Abjuração',
      castTime: '1 ação',
      range: 'Toque',
      duration: 'Concentração, até 1 minuto',
      tags: ['concentration'],
      domain: false,
      desc: 'Você toca uma criatura voluntária. Uma vez antes da magia terminar, o alvo pode rolar <strong>1d4</strong> e adicionar o resultado a um <strong>teste de resistência</strong> de sua escolha. Pode rolar o dado antes ou depois de fazer o teste.'
    },
    {
      name: 'Taumaturgia',
      nameEn: 'Thaumaturgy',
      level: 0,
      school: 'Transmutação',
      castTime: '1 ação',
      range: '9 m (30 ft)',
      duration: 'Até 1 minuto',
      tags: [],
      domain: false,
      desc: 'Você manifesta um sinal de poder sobrenatural: sua voz triplica de volume, chamas tremulam, o chão treme levemente, sons estranhos surgem, portas e janelas se abrem ou fecham, ou seus olhos mudam de aparência. Até <strong>3 efeitos simultâneos</strong>.'
    },
    // 1st Level
    {
      name: 'Abençoar',
      nameEn: 'Bless',
      level: 1,
      school: 'Encantamento',
      castTime: '1 ação',
      range: '9 m (30 ft)',
      duration: 'Concentração, até 1 minuto',
      tags: ['concentration'],
      domain: true,
      desc: 'Você abençoa até <strong>3 criaturas</strong> no alcance. Sempre que um alvo fizer uma <strong>jogada de ataque ou teste de resistência</strong> antes da magia acabar, ele pode rolar <strong>1d4</strong> e adicionar o número ao resultado.'
    },
    {
      name: 'Curar Ferimentos',
      nameEn: 'Cure Wounds',
      level: 1,
      school: 'Evocação',
      castTime: '1 ação',
      range: 'Toque',
      duration: 'Instantânea',
      tags: ['healing'],
      domain: true,
      desc: 'Uma criatura que você toca recupera <strong>1d8 + mod. de SAB (+2)</strong> pontos de vida. Com Discípulo da Vida: <strong>+3 PV adicionais</strong> (2 + nível da magia). Sem efeito em mortos-vivos ou constructos. <em>Em níveis superiores: +1d8 por nível acima do 1º.</em>'
    },
    {
      name: 'Palavra de Cura',
      nameEn: 'Healing Word',
      level: 1,
      school: 'Evocação',
      castTime: '1 ação bônus',
      range: '18 m (60 ft)',
      duration: 'Instantânea',
      tags: ['healing'],
      domain: false,
      desc: 'Uma criatura no alcance que você possa ver recupera <strong>1d4 + mod. de SAB (+2)</strong> pontos de vida. Com Discípulo da Vida: <strong>+3 PV adicionais</strong>. Ideal para curar aliados caídos à distância. <em>Em níveis superiores: +1d4 por nível acima do 1º.</em>'
    },
    {
      name: 'Raio Guia',
      nameEn: 'Guiding Bolt',
      level: 1,
      school: 'Evocação',
      castTime: '1 ação',
      range: '36 m (120 ft)',
      duration: 'Instantânea',
      tags: [],
      domain: false,
      desc: 'Um raio de luz atira em direção a uma criatura no alcance. Faça um <strong>ataque à distância com magia (+4)</strong>. Em um acerto, causa <strong>4d6 de dano radiante</strong> e o próximo ataque contra o alvo tem <strong>vantagem</strong>. <em>Em níveis superiores: +1d6 por nível acima do 1º.</em>'
    },
    {
      name: 'Perdição',
      nameEn: 'Bane',
      level: 1,
      school: 'Encantamento',
      castTime: '1 ação',
      range: '9 m (30 ft)',
      duration: 'Concentração, até 1 minuto',
      tags: ['concentration'],
      domain: false,
      desc: 'Até <strong>3 criaturas</strong> no alcance devem fazer <strong>TR de Carisma</strong>. Em uma falha, sempre que o alvo fizer uma jogada de ataque ou teste de resistência, deve rolar <strong>1d4</strong> e subtrair o número.'
    },
    {
      name: 'Comando',
      nameEn: 'Command',
      level: 1,
      school: 'Encantamento',
      castTime: '1 ação',
      range: '18 m (60 ft)',
      duration: 'Instantânea',
      tags: [],
      domain: false,
      desc: 'Você pronuncia um comando de <strong>uma palavra</strong> a uma criatura no alcance que possa ouvi-lo. Ela deve ter sucesso em um <strong>TR de Sabedoria</strong> ou seguir o comando no próximo turno. Exemplos: Aproxime-se, Largue, Fuja, Pare, Caia.'
    },
    {
      name: 'Escudo da Fé',
      nameEn: 'Shield of Faith',
      level: 1,
      school: 'Abjuração',
      castTime: '1 ação bônus',
      range: '18 m (60 ft)',
      duration: 'Concentração, até 10 minutos',
      tags: ['concentration'],
      domain: false,
      desc: 'Um campo cintilante aparece ao redor de uma criatura no alcance, concedendo-lhe <strong>+2 na CA</strong> pela duração da magia.'
    },
    {
      name: 'Infligir Ferimentos',
      nameEn: 'Inflict Wounds',
      level: 1,
      school: 'Necromancia',
      castTime: '1 ação',
      range: 'Toque',
      duration: 'Instantânea',
      tags: [],
      domain: false,
      desc: 'Faça um <strong>ataque corpo a corpo com magia (+4)</strong> contra uma criatura ao seu alcance. Em um acerto, o alvo sofre <strong>3d10 de dano necrótico</strong>. Uma das magias de toque com mais dano do jogo. <em>Em níveis superiores: +1d10 por nível acima do 1º.</em>'
    },
    {
      name: 'Santuário',
      nameEn: 'Sanctuary',
      level: 1,
      school: 'Abjuração',
      castTime: '1 ação bônus',
      range: '9 m (30 ft)',
      duration: '1 minuto',
      tags: [],
      domain: false,
      desc: 'Você protege uma criatura no alcance. Qualquer criatura que tentar atacar ou mirar o alvo com uma magia prejudicial deve primeiro fazer um <strong>TR de Sabedoria</strong>. Em uma falha, deve escolher um novo alvo ou perder o ataque/magia. Não protege contra efeitos de área.'
    },
    // 2nd Level
    {
      name: 'Restauração Menor',
      nameEn: 'Lesser Restoration',
      level: 2,
      school: 'Abjuração',
      castTime: '1 ação',
      range: 'Toque',
      duration: 'Instantânea',
      tags: ['healing'],
      domain: true,
      desc: 'Você toca uma criatura e pode encerrar <strong>uma doença</strong> ou <strong>uma condição</strong> que a aflige. A condição pode ser: cego, surdo, paralisado ou envenenado.'
    },
    {
      name: 'Arma Espiritual',
      nameEn: 'Spiritual Weapon',
      level: 2,
      school: 'Evocação',
      castTime: '1 ação bônus',
      range: '18 m (60 ft)',
      duration: '1 minuto',
      tags: [],
      domain: true,
      desc: 'Você cria uma arma espectral flutuante no alcance que dura pela duração. Ao lançar, faça um <strong>ataque corpo a corpo com magia (+4)</strong> contra uma criatura a 1,5m da arma. Em um acerto: <strong>1d8 + mod. de SAB (+2)</strong> de dano de força. Como ação bônus nos seus turnos seguintes, pode mover a arma até 6m e atacar novamente.'
    },
    {
      name: 'Imobilizar Pessoa',
      nameEn: 'Hold Person',
      level: 2,
      school: 'Encantamento',
      castTime: '1 ação',
      range: '18 m (60 ft)',
      duration: 'Concentração, até 1 minuto',
      tags: ['concentration'],
      domain: false,
      desc: 'Escolha um humanóide no alcance. Ele deve ter sucesso em um <strong>TR de Sabedoria</strong> ou ficará <strong>paralisado</strong> pela duração. No final de cada turno, pode fazer um novo teste. Ataques a 1,5m contra o alvo paralisado são <strong>acertos críticos automáticos</strong>.'
    },
    {
      name: 'Ajuda',
      nameEn: 'Aid',
      level: 2,
      school: 'Abjuração',
      castTime: '1 ação',
      range: '9 m (30 ft)',
      duration: '8 horas',
      tags: [],
      domain: false,
      desc: 'Até <strong>3 criaturas aliadas</strong> no alcance recebem <strong>+5 PV máximos e atuais</strong> pela duração. <em>Em níveis superiores: +5 PV adicionais por nível acima do 2º.</em>'
    },
    {
      name: 'Silêncio',
      nameEn: 'Silence',
      level: 2,
      school: 'Ilusão',
      castTime: '1 ação',
      range: '36 m (120 ft)',
      duration: 'Concentração, até 10 minutos',
      tags: ['concentration', 'ritual'],
      domain: false,
      desc: 'Nenhum som pode ser criado ou passar por uma <strong>esfera de 6m de raio</strong> centrada em um ponto no alcance. Criaturas dentro são <strong>surdas</strong> e imunes a dano trovejante. Impede conjuração de magias com componente verbal.'
    },
    {
      name: 'Oração de Cura',
      nameEn: 'Prayer of Healing',
      level: 2,
      school: 'Evocação',
      castTime: '10 minutos',
      range: '9 m (30 ft)',
      duration: 'Instantânea',
      tags: ['healing'],
      domain: false,
      desc: 'Até <strong>6 criaturas</strong> no alcance recuperam <strong>2d8 + mod. de SAB (+2)</strong> pontos de vida cada. Com Discípulo da Vida: <strong>+4 PV adicionais</strong> por criatura. Ideal para cura fora de combate. <em>Em níveis superiores: +1d8 por nível acima do 2º.</em>'
    },
    {
      name: 'Zona da Verdade',
      nameEn: 'Zone of Truth',
      level: 2,
      school: 'Encantamento',
      castTime: '1 ação',
      range: '18 m (60 ft)',
      duration: '10 minutos',
      tags: [],
      domain: false,
      desc: 'Você cria uma zona mágica de <strong>4,5m de raio</strong>. Cada criatura que entrar ou começar seu turno na área deve fazer <strong>TR de Carisma</strong>. Em uma falha, não pode mentir deliberadamente. Você sabe se cada criatura teve sucesso ou falhou no teste.'
    }
  ];

  /* ------------------------------------------------------------------
     STATE
     ------------------------------------------------------------------ */
  let state = {
    hp: HP_MAX,
    slots: { 1: [true, true, true, true], 2: [true, true] },
    activeTab: 'status'
  };

  /* ------------------------------------------------------------------
     DOM REFERENCES
     ------------------------------------------------------------------ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ------------------------------------------------------------------
     LOCAL STORAGE
     ------------------------------------------------------------------ */
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        state.hp = typeof parsed.hp === 'number' ? Math.max(HP_MIN, Math.min(HP_MAX, parsed.hp)) : HP_MAX;
        if (parsed.slots) {
          if (Array.isArray(parsed.slots['1'])) state.slots[1] = parsed.slots['1'].slice(0, 4);
          if (Array.isArray(parsed.slots['2'])) state.slots[2] = parsed.slots['2'].slice(0, 2);
        }
        if (parsed.activeTab) state.activeTab = parsed.activeTab;
      }
    } catch (_) { /* ignore corrupt data */ }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) { /* storage full, ignore */ }
  }

  /* ------------------------------------------------------------------
     HP CONTROL
     ------------------------------------------------------------------ */
  function renderHP() {
    const hpCurrent = $('#hp-current');
    const hpControl = $('.hp-control');
    hpCurrent.textContent = state.hp;

    hpCurrent.classList.toggle('critical', state.hp <= 3);

    // Remove old animation classes
    hpControl.classList.remove('damage-flash', 'heal-flash');
  }

  function changeHP(delta) {
    const prev = state.hp;
    state.hp = Math.max(HP_MIN, Math.min(HP_MAX, state.hp + delta));
    if (state.hp === prev) return;

    const hpControl = $('.hp-control');
    const hpCurrent = $('#hp-current');

    // Trigger flash animation
    hpControl.classList.remove('damage-flash', 'heal-flash');
    void hpControl.offsetWidth; // force reflow
    hpControl.classList.add(delta < 0 ? 'damage-flash' : 'heal-flash');

    if (delta > 0) {
      hpCurrent.classList.add('healed');
      setTimeout(() => hpCurrent.classList.remove('healed'), 400);
    }

    renderHP();
    saveState();
  }

  /* ------------------------------------------------------------------
     SPELL SLOTS
     ------------------------------------------------------------------ */
  function renderSlots() {
    for (const level of [1, 2]) {
      const orbs = $$(`[data-slot-level="${level}"] .slot-orb`);
      orbs.forEach((orb, i) => {
        orb.checked = state.slots[level][i];
      });
    }
  }

  function onSlotChange(e) {
    const orb = e.target;
    if (!orb.classList.contains('slot-orb')) return;
    const level = parseInt(orb.closest('[data-slot-level]').dataset.slotLevel, 10);
    const index = parseInt(orb.dataset.index, 10);
    state.slots[level][index] = orb.checked;
    saveState();
  }

  /* ------------------------------------------------------------------
     TABS
     ------------------------------------------------------------------ */
  function switchTab(tabId) {
    state.activeTab = tabId;

    $$('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    $$('.tab-panel').forEach(panel => {
      const isActive = panel.id === `tab-${tabId}`;
      panel.classList.toggle('active', isActive);
      if (isActive) {
        // Re-trigger animation
        panel.style.animation = 'none';
        void panel.offsetWidth;
        panel.style.animation = '';
      }
    });

    saveState();
  }

  /* ------------------------------------------------------------------
     SPELLS — RENDERING & FILTERING
     ------------------------------------------------------------------ */
  function levelLabel(level) {
    if (level === 0) return 'Truque';
    return `${level}º Nível`;
  }

  function levelBadgeClass(level) {
    if (level === 0) return 'cantrip';
    return `level-${level}`;
  }

  function buildSpellCard(spell) {
    const tagsHTML = spell.tags.map(t => {
      const labels = { concentration: 'Concentração', ritual: 'Ritual', healing: 'Cura' };
      return `<span class="spell-tag ${t}">${labels[t] || t}</span>`;
    }).join('');

    const domainBadge = spell.domain ? '<span class="domain-icon" title="Magia de Domínio — Sempre Preparada">⚜️</span>' : '';
    const domainClass = spell.domain ? ' domain' : '';

    return `
      <div class="spell-card${domainClass}" data-level="${spell.level}">
        <div class="spell-header" role="button" tabindex="0" aria-expanded="false">
          <div class="spell-level-badge ${levelBadgeClass(spell.level)}">${spell.level === 0 ? '∞' : spell.level}</div>
          <div class="spell-info">
            <div class="spell-name-row">
              <span class="spell-name">${spell.name}</span>
              ${domainBadge}
            </div>
            <div class="spell-meta">${spell.nameEn} · ${spell.school} · ${spell.castTime}</div>
          </div>
          <span class="spell-chevron">▼</span>
        </div>
        <div class="spell-body">
          <div class="spell-desc">
            ${tagsHTML ? '<div style="margin-bottom:6px">' + tagsHTML + '</div>' : ''}
            <p><strong>Alcance:</strong> ${spell.range} · <strong>Duração:</strong> ${spell.duration}</p>
            <p style="margin-top:6px">${spell.desc}</p>
          </div>
        </div>
      </div>`;
  }

  function renderSpells(filter = 'all') {
    const list = $('#spell-list');
    const filtered = filter === 'all' ? SPELLS : SPELLS.filter(s => s.level === parseInt(filter, 10));
    list.innerHTML = filtered.map(buildSpellCard).join('');
  }

  function toggleSpell(e) {
    const header = e.target.closest('.spell-header');
    if (!header) return;
    const card = header.closest('.spell-card');
    const wasOpen = card.classList.contains('open');
    // Close all others in the list
    $$('.spell-card.open').forEach(c => {
      c.classList.remove('open');
      c.querySelector('.spell-header').setAttribute('aria-expanded', 'false');
    });
    if (!wasOpen) {
      card.classList.add('open');
      header.setAttribute('aria-expanded', 'true');
    }
  }

  function onFilterClick(e) {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;
    $$('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    renderSpells(pill.dataset.filter);
  }

  /* ------------------------------------------------------------------
     DICE ROLLS / QUICK BUTTONS
     ------------------------------------------------------------------ */
  function rollD20(modifier) {
    const roll = Math.floor(Math.random() * 20) + 1;
    return { roll, total: roll + modifier, isNat20: roll === 20, isNat1: roll === 1 };
  }

  function showDiceToast(label, result) {
    const toast = $('#dice-toast');
    const toastLabel = toast.querySelector('.toast-label');
    const toastResult = toast.querySelector('.toast-result');

    toastLabel.textContent = label;
    let display = `${result.total}`;
    if (result.isNat20) display += ' 🎯';
    if (result.isNat1) display += ' 💀';
    display += ` (${result.roll} + ${result.total - result.roll})`;
    toastResult.textContent = display;

    toast.classList.add('visible');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('visible'), 2800);
  }

  /* ------------------------------------------------------------------
     INIT
     ------------------------------------------------------------------ */
  function init() {
    loadState();

    // Render initial state
    renderHP();
    renderSlots();
    renderSpells('all');
    switchTab(state.activeTab);

    // --- EVENT LISTENERS ---

    // HP buttons
    $('#hp-minus').addEventListener('click', () => changeHP(-1));
    $('#hp-plus').addEventListener('click', () => changeHP(1));

    // Slot checkboxes (event delegation)
    $$('.slot-group').forEach(g => g.addEventListener('change', onSlotChange));

    // Tabs
    $$('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Spell accordion
    $('#spell-list').addEventListener('click', toggleSpell);

    // Spell filters
    $('.spell-filters').addEventListener('click', onFilterClick);

    // Quick action buttons
    $('#btn-initiative').addEventListener('click', () => {
      const result = rollD20(2);
      showDiceToast('Iniciativa', result);
    });

    $('#btn-passive-perception').addEventListener('click', () => {
      showDiceToast('Percepção Passiva', { roll: 12, total: 12, isNat20: false, isNat1: false });
    });

    // Keyboard support for spell accordion
    $('#spell-list').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const header = e.target.closest('.spell-header');
        if (header) {
          e.preventDefault();
          header.click();
        }
      }
    });

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
