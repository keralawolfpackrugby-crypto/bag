// ── STORAGE HELPERS ──
const STORAGE_KEY = 'bagshop_products';
const CART_KEY    = 'bagshop_cart';

function getProducts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveProducts(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  // Notify other tabs
  window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
}

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ── TOAST ──
function showToast(msg, type = 'success') {
  let t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast' + (type === 'error' ? ' error' : '');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── SEED SAMPLE DATA (first run) ──
function seedSampleData() {
  if (getProducts().length > 0) return;
  const samples = [
    {
      id: 'p1',
      name: 'Luxe Tote Bag',
      price: 2499,
      category: 'Tote',
      description: 'Handcrafted genuine leather tote with gold-tone hardware and spacious interior.',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
      badge: 'Best Seller',
      addedAt: Date.now() - 86400000
    },
    {
      id: 'p2',
      name: 'Mini Crossbody',
      price: 1299,
      category: 'Crossbody',
      description: 'Compact yet stylish crossbody bag perfect for everyday errands.',
      image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&q=80',
      badge: 'New',
      addedAt: Date.now() - 43200000
    },
    {
      id: 'p3',
      name: 'Vintage Satchel',
      price: 3299,
      category: 'Satchel',
      description: 'A timeless satchel with rich brown leather and vintage buckle details.',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
      badge: 'Premium',
      addedAt: Date.now() - 172800000
    },
    {
      id: 'p4',
      name: 'Travel Duffel',
      price: 3999,
      category: 'Duffel',
      description: 'Spacious weekend duffel with reinforced handles and multiple pockets.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
      badge: '',
      addedAt: Date.now() - 259200000
    },
    {
      id: 'p5',
      name: 'Bucket Bag',
      price: 1899,
      category: 'Tote',
      description: 'Trendy bucket-style bag with a drawstring closure and detachable strap.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
      badge: 'Trending',
      addedAt: Date.now() - 3600000
    },
    {
      id: 'p6',
      name: 'Slim Clutch',
      price: 899,
      category: 'Clutch',
      description: 'Elegant evening clutch with satin lining and magnetic snap closure.',
      image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80',
      badge: '',
      addedAt: Date.now()
    }
  ];
  saveProducts(samples);
}
