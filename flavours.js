// ─── DOLLOP FLAVOURS ────────────────────────────────────────────────────────
// Add new flavours here. Each entry drives both the homepage grid card
// and the product detail page. No HTML changes needed to add a flavour.

const FLAVOURS = {

  'musang-king': {
    slug:         'musang-king',
    name:         'Musang King',
    fullName:     'Musang King Gelato',
    tagline:      'Bold, creamy, unmistakably Musang King — the real thing.',
    desc:         'Made in small batches using real Musang King durian pulp. No shortcuts, no filler, just the honest intensity of the King of Fruits. Lightly sweet and intensely durian-forward — alive with the legendary stink that true believers live for.',
    badge:        'Most Popular',
    available:    true,
    hasSweetness: true,
    sizeCup:      '80g',
    sizePint:     '410g',
    hasNutrition: true,
    hasImages:    true,
    cardImage:    'images/dollop-regular sweet image card.jpg',
    productImage: 'images/Dollop Cup Design.png',
    cardBg:       'radial-gradient(ellipse at 40% 30%,#8FBF3A 0%,#4A7C24 40%,#2D5016 75%,#1A3A0A 100%)',
    priceCup:     18,
    pricePint:    75,
    stats: [
      { num: '133', unit: 'kcal per serving', label: 'Energy' },
      { num: '100%', unit: 'Musang King',     label: 'Real Durian' },
      { num: 'Zero', unit: '',                label: 'Preservatives' }
    ],
    features: [
      '100% Real Musang King',
      'No Artificial Flavours',
      'Freshly Made',
      'Small Batch',
      'Premium Grade D197'
    ],
    sweetness: {
      regular: { label: 'Regular Sweet', sugar: '16g', imgClass: '' },
      less:    { label: 'Less Sweet',    sugar: '9g',  imgClass: 'less-bg' }
    }
  },

  'cempedak': {
    slug:         'cempedak',
    name:         'Cempedak',
    fullName:     'Cempedak Gelato',
    tagline:      'Tropical. Fragrant. Wildly addictive.',
    desc:         'Cempedak is the unsung hero of Malaysian tropical fruits — sweeter than jackfruit, more fragrant than mango, with a custard-like richness that most people never discover. We turned it into gelato. Real Cempedak pulp, no flavouring, no shortcuts. This is Malaysia in a cup.',
    badge:        'New',
    available:    true,
    hasSweetness: false,
    sizeCup:      '70g',
    sizePint:     '380g',
    hasNutrition: false,
    hasImages:    false,
    cardImage:    'images/cempedak colour.png',
    productImage: 'images/cempedak colour.png',
    cardBg:       'radial-gradient(ellipse at 40% 30%,#E8A84A 0%,#C17B2A 40%,#8B5416 75%,#4A2C08 100%)',
    priceCup:          8,
    pricePint:         40,
    originalPriceCup:  10,
    originalPricePint: 48,
    stats: [
      { num: '141', unit: 'kcal per serving', label: 'Energy' },
      { num: '100%', unit: 'Cempedak',        label: 'Real Fruit' },
      { num: 'Zero', unit: '',                label: 'Preservatives' }
    ],
    features: [
      '100% Real Cempedak',
      'No Artificial Flavours',
      'Freshly Made',
      'Small Batch',
      'Seasonal Malaysian Fruit'
    ],
    sweetness: null
  },

  'coming-soon': {
    slug:         'coming-soon',
    name:         'Coming Soon',
    fullName:     'Something New',
    tagline:      "Something new is brewing. Stay tuned.",
    desc:         "The next chapter of Dollop is almost ready. Follow us on Instagram to be the first to know when it drops.",
    badge:        'Coming Soon',
    available:    false,
    hasSweetness: false,
    hasImages:    false,
    cardImage:    'https://placehold.co/600x500/3B1F0A/F5C518?text=?',
    productImage: 'https://placehold.co/600x600/3B1F0A/F5C518?text=?',
    cardBg:       'radial-gradient(ellipse at 50% 40%,#6B3A1A 0%,#3B1F0A 60%,#1A0A00 100%)',
    priceCup:     null,
    pricePint:    null,
    stats: [],
    features: [],
    sweetness: null
  }

};

// Controls which flavours show on the homepage grid (max 3, in this order).
// Swap slugs here to feature different ones without changing any HTML.
const FEATURED_FLAVOURS = ['musang-king', 'cempedak', 'coming-soon'];
