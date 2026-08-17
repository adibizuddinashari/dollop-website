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
    sizeCup:      '70g',
    sizePint:     '380g',
    hasNutrition: false,
    hasImages:    true,
    cardImage:    'images/dollop-regular sweet image card.jpg',
    productImage: 'images/Dollop Cup Design.png',
    cupImage:     'images/Dollop Cup Design.png',
    pintImage:    'images/Dollop Pint Design.png',
    cardBg:       'radial-gradient(ellipse at 40% 30%,#8FBF3A 0%,#4A7C24 40%,#2D5016 75%,#1A3A0A 100%)',
    priceCup:     12,
    pricePint:    70,
    // kcal/serving stat dropped — was calculated for the old 80g cup; add
    // it back once you have the figure for the new 70g size.
    stats: [
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
    productImage: 'images/Dollop_cup_cempedak.png',
    cupImage:     'images/Dollop_cup_cempedak.png',
    pintImage:    'images/Dollop_pint_cempedak.png',
    cardBg:       'radial-gradient(ellipse at 40% 30%,#E8A84A 0%,#C17B2A 40%,#8B5416 75%,#4A2C08 100%)',
    priceCup:     10,
    pricePint:    50,
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

  // Draft copy — please review/replace with approved marketing copy.
  'soya-gula-melaka': {
    slug:         'soya-gula-melaka',
    name:         'Soya Gula Melaka',
    fullName:     'Soya Gula Melaka Gelato',
    tagline:      'Creamy soya, rich with real gula Melaka.',
    desc:         'A nostalgic Malaysian pairing turned into gelato — silky soya milk swirled with real gula Melaka for that deep caramel warmth in every scoop. Simple, comforting, unmistakably local.',
    badge:        'New',
    available:    true,
    hasSweetness: false,
    sizeCup:      '70g',
    sizePint:     '380g',
    hasNutrition: false,
    hasImages:    true,
    cardImage:    'images/Soya With Gula Melaka.png',
    productImage: 'images/Soya With Gula Melaka.png',
    cupImage:     'images/Soya With Gula Melaka.png',
    pintImage:    'images/Soya With Gula Melaka.png',
    cardBg:       'radial-gradient(ellipse at 40% 30%,#D9B36B 0%,#A67C3D 40%,#6B4A1F 75%,#3B2A10 100%)',
    priceCup:     10,
    pricePint:    50,
    stats: [],
    features: [
      'Real Gula Melaka',
      'Creamy Soya Base',
      'No Artificial Flavours',
      'Freshly Made',
      'Small Batch'
    ],
    sweetness: null
  },

  // Draft copy — please review/replace with approved marketing copy.
  'pandan-coconut': {
    slug:         'pandan-coconut',
    name:         'Pandan Coconut',
    fullName:     'Pandan Coconut Gelato',
    tagline:      'Fragrant pandan, rich coconut, pure comfort.',
    desc:         "Two of Malaysia's most beloved flavours in one scoop — fragrant pandan leaf and rich coconut milk, creamy and lightly sweet. A tropical classic, reimagined as gelato.",
    badge:        'New',
    available:    true,
    hasSweetness: false,
    sizeCup:      '70g',
    sizePint:     '380g',
    hasNutrition: false,
    hasImages:    true,
    cardImage:    'images/Pandan Coconut.png',
    productImage: 'images/Pandan Coconut.png',
    cupImage:     'images/Pandan Coconut.png',
    pintImage:    'images/Pandan Coconut.png',
    cardBg:       'radial-gradient(ellipse at 40% 30%,#A8D4A0 0%,#6FA85E 40%,#3D6B2F 75%,#1F3A16 100%)',
    priceCup:     10,
    pricePint:    50,
    stats: [],
    features: [
      'Real Pandan & Coconut',
      'No Artificial Flavours',
      'Freshly Made',
      'Small Batch',
      'Tropical Malaysian Classic'
    ],
    sweetness: null
  }

};

// Controls which flavours show on the homepage grid, in this order.
// Swap slugs here to feature different ones without changing any HTML.
const FEATURED_FLAVOURS = ['musang-king', 'cempedak', 'soya-gula-melaka', 'pandan-coconut'];
