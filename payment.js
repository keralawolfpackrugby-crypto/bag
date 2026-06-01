// ── PAYMENT GATEWAY ──

function openPaymentGateway() {
  const cart = getCart();
  if (!cart.length) { showToast('Your cart is empty!', 'error'); return; }

  renderPaymentModal(cart);
  document.getElementById('payOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  switchPayTab('card');
}

function closePaymentGateway() {
  document.getElementById('payOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderPaymentModal(cart) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Left panel items
  document.getElementById('payItemsList').innerHTML = cart.map(item => `
    <div class="pay-item">
      <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/44/1a1a1a/c9a96e?text=B'" />
      <div>
        <div class="pay-item-name">${item.name}</div>
        <div class="pay-item-meta">Qty: ${item.qty} · ${item.category}</div>
      </div>
      <div class="pay-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
    </div>
  `).join('');

  document.getElementById('payTotal').textContent   = '₹' + total.toLocaleString('en-IN');
  document.getElementById('payItemCount').textContent = cart.reduce((s,i)=>s+i.qty,0) + ' item(s)';
  document.getElementById('payBtnAmount').textContent = '₹' + total.toLocaleString('en-IN');

  // reset view
  showPanel('form');
}

function showPanel(which) {
  document.getElementById('payFormArea').style.display    = which === 'form'       ? '' : 'none';
  document.getElementById('payProcessing').style.display  = which === 'processing' ? '' : 'none';
  document.getElementById('paySuccess').style.display     = which === 'success'    ? '' : 'none';
  if (which === 'form') {
    document.getElementById('payProcessing').classList.remove('active');
    document.getElementById('paySuccess').classList.remove('active');
    document.getElementById('payFormArea').style.display = '';
  }
  if (which === 'processing') {
    document.getElementById('payFormArea').style.display = 'none';
    document.getElementById('payProcessing').classList.add('active');
    document.getElementById('paySuccess').classList.remove('active');
  }
  if (which === 'success') {
    document.getElementById('payFormArea').style.display = 'none';
    document.getElementById('payProcessing').classList.remove('active');
    document.getElementById('paySuccess').classList.add('active');
  }
}

// ── TABS ──
function switchPayTab(tab) {
  document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.pay-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');
}

// ── SELECTION HELPERS ──
function selectUPI(el) {
  document.querySelectorAll('.upi-app').forEach(u => u.classList.remove('selected'));
  el.classList.add('selected');
}
function selectBank(el) {
  document.querySelectorAll('.bank-opt').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}
function selectWallet(el) {
  document.querySelectorAll('.wallet-opt').forEach(w => w.classList.remove('selected'));
  el.classList.add('selected');
}

// ── CARD FORMATTING ──
function fmtCard(inp) {
  let v = inp.value.replace(/\D/g,'').slice(0,16);
  inp.value = v.replace(/(.{4})/g,'$1 ').trim();
}
function fmtExpiry(inp) {
  let v = inp.value.replace(/\D/g,'').slice(0,4);
  if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
  inp.value = v;
}
function fmtCVV(inp) {
  inp.value = inp.value.replace(/\D/g,'').slice(0,4);
}

// ── VALIDATION ──
function validateCard() {
  const name   = document.getElementById('pcName').value.trim();
  const number = document.getElementById('pcNumber').value.replace(/\s/g,'');
  const expiry = document.getElementById('pcExpiry').value;
  const cvv    = document.getElementById('pcCVV').value;
  let ok = true;

  [['pcName', name.length >= 2],
   ['pcNumber', number.length === 16],
   ['pcExpiry', /^\d{2}\/\d{2}$/.test(expiry)],
   ['pcCVV', cvv.length >= 3]
  ].forEach(([id, valid]) => {
    const el = document.getElementById(id);
    el.classList.toggle('invalid', !valid);
    if (!valid) ok = false;
  });
  return ok;
}

function validateUPI() {
  const upiId = document.getElementById('pupiId').value.trim();
  const ok = /^[\w.\-]+@[\w]+$/.test(upiId);
  document.getElementById('pupiId').classList.toggle('invalid', !ok);
  return ok;
}

// ── PAY ──
function processPayment() {
  const activeTab = document.querySelector('.pay-tab.active')?.id?.replace('tab-','');

  if (activeTab === 'card' && !validateCard()) {
    showToast('Please fill in all card details correctly.', 'error'); return;
  }
  if (activeTab === 'upi') {
    const app = document.querySelector('.upi-app.selected');
    const id  = document.getElementById('pupiId').value.trim();
    if (!app && !id) { showToast('Select a UPI app or enter UPI ID.', 'error'); return; }
    if (id && !validateUPI()) { showToast('Enter a valid UPI ID.', 'error'); return; }
  }
  if (activeTab === 'netbanking') {
    if (!document.querySelector('.bank-opt.selected')) {
      showToast('Please select a bank.', 'error'); return;
    }
  }
  if (activeTab === 'wallet') {
    if (!document.querySelector('.wallet-opt.selected')) {
      showToast('Please select a wallet.', 'error'); return;
    }
  }

  // Show processing
  showPanel('processing');

  // Simulate payment (2.5 s)
  setTimeout(() => {
    const orderId = 'BL' + Date.now().toString().slice(-8).toUpperCase();
    document.getElementById('successOrderId').textContent = 'Order ID: ' + orderId;
    showPanel('success');
    // Clear cart
    saveCart([]);
    if (typeof updateCartBadge === 'function') updateCartBadge();
  }, 2500);
}
