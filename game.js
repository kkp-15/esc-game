// ===== ゲーム状態管理 =====
const Game = {
  // フラグ管理
  getFlag(key) {
    return localStorage.getItem('escape_' + key) === 'true';
  },
  setFlag(key, val = true) {
    localStorage.setItem('escape_' + key, val);
  },

  // アイテム管理
  getItem(key) {
    return localStorage.getItem('escape_item_' + key) === 'true';
  },
  addItem(key) {
    localStorage.setItem('escape_item_' + key, 'true');
  },
  hasItem(key) {
    return this.getItem(key);
  },

  // クリア状態
  setRoomClear(room) {
    localStorage.setItem('escape_room_' + room, 'true');
  },
  isRoomClear(room) {
    return localStorage.getItem('escape_room_' + room) === 'true';
  },

  // リセット
  reset() {
    Object.keys(localStorage)
      .filter(k => k.startsWith('escape_'))
      .forEach(k => localStorage.removeItem(k));
  }
};

// ===== モーダル表示 =====
function showModal(emoji, title, body, learnPoint, btnLabel, onClose) {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  overlay.querySelector('.modal-emoji').textContent = emoji;
  overlay.querySelector('.modal-title').textContent = title;
  overlay.querySelector('.modal-body').innerHTML = body;

  const badge = overlay.querySelector('.learn-badge');
  if (learnPoint) {
    badge.textContent = learnPoint;
    badge.style.display = 'block';
  } else {
    badge.style.display = 'none';
  }

  const btn = overlay.querySelector('.modal-btn');
  btn.textContent = btnLabel || 'とじる';
  btn.onclick = () => {
    overlay.classList.remove('show');
    if (onClose) onClose();
  };

  overlay.classList.add('show');
}

// ===== モーダルHTML（共通） =====
function insertModal() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal">
        <span class="modal-emoji">🎉</span>
        <div class="modal-title">タイトル</div>
        <div class="modal-body">ほんぶん</div>
        <div class="learn-badge"></div>
        <button class="btn btn-primary modal-btn" style="width:100%">とじる</button>
      </div>
    </div>
  `);
}

// ===== アイテムカードの状態更新 =====
function updateItemCard(id) {
  const card = document.getElementById(id);
  if (!card) return;
  if (Game.getItem(id)) {
    card.classList.add('obtained');
  }
}

// ===== インベントリ表示 =====
const ITEM_LABELS = {
  piggybank_note: '🐷 メモ',
  flashlight: '🔦 かいちゅうでんとう',
  coin_card: '🪙 コインカード',
  snack_coupon: '🎫 おやつクーポン',
  key: '🗝️ かぎ',
};

function renderInventory(containerId, itemKeys) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const items = itemKeys.filter(k => Game.getItem(k));
  if (items.length === 0) {
    el.innerHTML = '<span style="color:var(--text-sub);font-size:0.8rem">まだなにもない…</span>';
  } else {
    el.innerHTML = items.map(k => `
      <span class="inv-item">${ITEM_LABELS[k] || k}</span>
    `).join('');
  }
}

// ===== フィードバック =====
function showFeedback(id, type, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'feedback show ' + type;
  el.innerHTML = msg;
  setTimeout(() => el.classList.remove('show'), 3500);
}

// ===== ページロード時 =====
document.addEventListener('DOMContentLoaded', () => {
  insertModal();
});
