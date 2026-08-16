import { Product } from '../types';

export const PRODUCTS_DATA: Product[] = [
  // 1. Tech & Smartphones
  {
    id: 'prod-1',
    title: 'Xiaomi Redmi Note 13 Pro (8GB RAM / 256GB ROM) - 200MP OIS Camera - 67W Turbo Charge - Official BD Warranty',
    titleBn: 'শাওমি রেডমি নোট ১৩ প্রো (৮জিবি র‍্যাম / ২৫৬জিবি রম) - ২০০মেগাপিক্সেল ক্যামেরা - অফিশিয়াল ওয়ারেন্টি',
    slug: 'xiaomi-redmi-note-13-pro',
    brand: 'Xiaomi',
    category: 'Electronic Devices',
    categorySlug: 'electronic-devices',
    subCategory: 'smartphones',
    price: 31499,
    originalPrice: 35999,
    discountPercentage: 13,
    rating: 4.8,
    reviewsCount: 1420,
    questionsCount: 340,
    soldCount: 3950,
    inStock: 35,
    isDarazMall: true,
    isFreeDelivery: true,
    isFlashSale: true,
    flashSaleEndTime: '12h 45m 20s',
    coinsCashback: 350,
    mainImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80'
    ],
    description: [
      'Ultra-clear 200MP camera with OIS optical image stabilization.',
      '120Hz 1.5K AMOLED curved display with Corning Gorilla Glass Victus.',
      'Snapdragon 7s Gen 2 flagship 4nm high-efficiency processor.',
      '5000mAh battery with 67W turbo fast charging included in box.',
      'In-screen fingerprint sensor with heart rate monitoring.',
      'IP54 dust and splash resistant.'
    ],
    descriptionBn: [
      '২০০ মেগাপিক্সেল অপটিক্যাল ইমেজ স্ট্যাবিলাইজেশন (OIS) আল্ট্রা ক্লিয়ার ক্যামেরা।',
      '১২০ হার্টজ ১.৫কে অ্যামোলেড বাঁকানো ডিসপ্লে।',
      'স্ন্যাপড্রাগন ৭এস জেন ২ ৪এনএম শক্তিশালী প্রসেসর।',
      '৫০০০ এমএএইচ ব্যাটারি সাথে ৬৭ ওয়াট ফাস্ট চার্জার।',
      '১ বছরের অফিশিয়াল বাংলাদেশ ওয়ারেন্টি।'
    ],
    specifications: {
      'Display': '6.67" FHD+ AMOLED 120Hz',
      'RAM & Storage': '8GB LPDDR4X + 256GB UFS 2.2',
      'Processor': 'Snapdragon 7s Gen 2 (4nm)',
      'Rear Camera': '200MP (Main) + 8MP (Ultra-wide) + 2MP (Macro)',
      'Front Camera': '16MP HDR Selfie',
      'Battery': '5000mAh with 67W Charger in Box',
      'Operating System': 'MIUI 14 based on Android 13'
    },
    variations: [
      { id: 'v-color', name: 'Color', options: ['Midnight Black', 'Ocean Teal', 'Aurora Purple'] },
      { id: 'v-storage', name: 'Storage', options: ['8GB/256GB', '12GB/512GB'] }
    ],
    seller: {
      id: 'sel-1',
      name: 'Xiaomi Official Flagship Store',
      isOfficial: true,
      rating: 96,
      shipOnTime: 99,
      chatResponse: 97,
      joinedYears: 5,
      location: 'Dhaka, Bangladesh',
      badge: 'DarazMall Flagship'
    },
    warranty: '1 Year Brand Official Warranty by Xiaomi Bangladesh',
    returnPolicy: '14 Days Easy Return from DarazMall',
    deliveryFee: 0,
    estimatedDeliveryDays: '2-3 Days in Dhaka, 3-5 Days outside Dhaka',
    tags: ['Best Seller', 'Official Warranty', '5G Smartphone']
  },

  // 2. Earbuds / Audio
  {
    id: 'prod-2',
    title: 'Haylou GT7 Neo True Wireless Bluetooth 5.2 Earbuds - AI Call Noise Cancellation - Low Latency Gaming Mode',
    titleBn: 'হাইলু জিটি৭ নিও ট্রু ওয়্যারলেস ব্লুটুথ ৫.২ ইয়ারবাডস - এআই নয়েজ ক্যান্সেলেশন',
    slug: 'haylou-gt7-neo-earbuds',
    brand: 'Haylou',
    category: 'Electronic Accessories',
    categorySlug: 'electronic-accessories',
    subCategory: 'earbuds-headphones',
    price: 1390,
    originalPrice: 2200,
    discountPercentage: 37,
    rating: 4.7,
    reviewsCount: 3820,
    questionsCount: 520,
    soldCount: 8900,
    inStock: 120,
    isDarazMall: true,
    isFreeDelivery: true,
    isFlashSale: true,
    flashSaleEndTime: '08h 15m 10s',
    coinsCashback: 40,
    mainImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'
    ],
    description: [
      'Bluetooth 5.2 chip offers ultra-low power consumption and stable transmission.',
      '8mm dynamic driver creates rich bass and crystal clear treble.',
      'DNN (Deep Neural Network) algorithm eliminates background noise during calls.',
      'Low latency gaming mode for synchronization between audio and video.',
      '22 hours total battery life with Type-C charging case.'
    ],
    descriptionBn: [
      'ব্লুটুথ ৫.২ দ্রুত এবং নিরবচ্ছিন্ন সংযোগ নিশ্চিত করে।',
      '৮ মিমি ডাইনামিক ড্রাইভারের সাথে ডিপ বেস অডিও।',
      'কলের সময় ব্যাকগ্রাউন্ড নয়েজ দূর করতে উন্নত এআই প্রযুক্তি।',
      'গেমিংয়ের জন্য আল্ট্রা লো লেটেন্সি মোড।'
    ],
    specifications: {
      'Bluetooth Version': '5.2',
      'Driver Unit': '8mm Dynamic Driver',
      'Battery Capacity': '35mAh (Earbud), 310mAh (Case)',
      'Playtime': 'Up to 6.5h per charge, 22h total',
      'Charging Interface': 'Type-C USB',
      'Weight': '3.9g per earbud'
    },
    variations: [
      { id: 'v-color', name: 'Color', options: ['Black', 'White', 'Purple'] }
    ],
    seller: {
      id: 'sel-2',
      name: 'Haylou BD Official Store',
      isOfficial: true,
      rating: 94,
      shipOnTime: 98,
      chatResponse: 95,
      joinedYears: 4,
      location: 'Dhaka, Bangladesh',
      badge: 'DarazMall Flagship'
    },
    warranty: '6 Months Brand Warranty',
    returnPolicy: '14 Days Free Return',
    deliveryFee: 0,
    estimatedDeliveryDays: '1-2 Days in Dhaka',
    tags: ['Flash Sale', 'Free Delivery', 'TWS']
  },

  // 3. Smartwatch
  {
    id: 'prod-3',
    title: 'Kieslect Ks Pro Smartwatch - 2.01" AMOLED Always-on Display - Bluetooth Calling - 100 Sports Modes - SpO2 & Heart Rate',
    titleBn: 'কিসলেক্ট কেএস প্রো স্মার্টওয়াচ - ২.০১ ইঞ্চি অ্যামোলেড ডিসপ্লে - ব্লুটুথ কলিং',
    slug: 'kieslect-ks-pro-smartwatch',
    brand: 'Kieslect',
    category: 'Electronic Accessories',
    categorySlug: 'electronic-accessories',
    subCategory: 'smartwatches',
    price: 5490,
    originalPrice: 7500,
    discountPercentage: 27,
    rating: 4.8,
    reviewsCount: 890,
    questionsCount: 180,
    soldCount: 2300,
    inStock: 45,
    isDarazMall: true,
    isFreeDelivery: true,
    isFlashSale: true,
    flashSaleEndTime: '14h 20m 00s',
    coinsCashback: 120,
    mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80'
    ],
    description: [
      '2.01" Super Large FHD AMOLED Display with 502*410 resolution.',
      'Abnormal Heart Rate Alert and continuous Health Monitor.',
      'Stable Bluetooth 5.2 phone calls with crystal speaker and mic.',
      'Kieslect OS with customized dynamic UI and games.',
      'IP68 Water Resistance suitable for swimming and daily sports.'
    ],
    descriptionBn: [
      '২.০১ ইঞ্চি বড় অ্যামোলেড অলওয়েজ-অন ডিসপ্লে।',
      'ব্লুটুথ কলিং সিস্টেম সরাসরি ঘড়ি থেকেই কল রিসিভ ও ডায়াল।',
      '১০০+ স্পোর্টস মোড এবং হার্ট রেট ও ব্লাড অক্সিজেন ট্র্যাকিং।',
      'আইপি৬৮ ওয়াটার রেজিস্ট্যান্ট।'
    ],
    specifications: {
      'Display Size': '2.01" FHD AMOLED (502x410)',
      'Waterproof': 'IP68 Rating',
      'Battery Life': 'Typical usage 5-7 days, Standby 10 days',
      'Sensors': 'Optical Heart Rate, SpO2, Sleep Tracker',
      'Compatibility': 'Android 5.0+ / iOS 9.0+'
    },
    variations: [
      { id: 'v-strap', name: 'Strap Color', options: ['Black / Orange Dual Strap', 'Silver Blue'] }
    ],
    seller: {
      id: 'sel-3',
      name: 'Gadget BD Tech Hub',
      isOfficial: true,
      rating: 95,
      shipOnTime: 97,
      chatResponse: 96,
      joinedYears: 3,
      location: 'Dhaka, Bangladesh'
    },
    warranty: '1 Year Replacement Warranty',
    returnPolicy: '14 Days Free Return',
    deliveryFee: 0,
    estimatedDeliveryDays: '2-3 Days',
    tags: ['Smart Watch', 'Bluetooth Call']
  },

  // 4. Men's Traditional Fashion - Panjabi
  {
    id: 'prod-4',
    title: 'Premium Jacquard Cotton Semi-Fitted Designer Panjabi for Men - Exclusive Eid & Festive Collection',
    titleBn: 'প্রিমিয়াম কটন সেমি-ফিটেড ডিজাইনার পাঞ্জাবি - উৎসব কালেকশন',
    slug: 'premium-jacquard-cotton-panjabi',
    brand: 'Illiyeen Style',
    category: "Men's Fashion",
    categorySlug: 'mens-fashion',
    subCategory: 'mens-traditional',
    price: 1850,
    originalPrice: 3200,
    discountPercentage: 42,
    rating: 4.6,
    reviewsCount: 1650,
    questionsCount: 210,
    soldCount: 4200,
    inStock: 80,
    isDarazMall: false,
    isFreeDelivery: true,
    isFlashSale: false,
    coinsCashback: 50,
    mainImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80'
    ],
    description: [
      '100% fine combed jacquard cotton fabric with intricate collar embroidery.',
      'Semi-fitted modern cut comfortable for Bangladeshi humid weather.',
      'Snap metal buttons with branded engraved detailing.',
      'Colorfast fabric guaranteed against color bleeding during wash.'
    ],
    descriptionBn: [
      '১০০% প্রিমিয়াম সুতি জ্যাকার্ড ফেব্রিক দিয়ে তৈরি আরামদায়ক পাঞ্জাবি।',
      'কলার ও প্লাকেটে নিখুঁত এমব্রয়ডারি কারুকাজ।',
      'সেমি-ফিটেড আধুনিক কাটিং।'
    ],
    specifications: {
      'Fabric': '100% Combed Cotton Jacquard',
      'Fitting': 'Semi Fitted',
      'Collar Style': 'Band Collar with Embroidery',
      'Sleeve': 'Full Sleeve',
      'Care': 'Machine Wash or Dry Clean'
    },
    variations: [
      { id: 'v-color', name: 'Color', options: ['Navy Blue', 'Maroon', 'Emerald Green', 'Charcoal Black', 'White'] },
      { id: 'v-size', name: 'Size', options: ['38 (M)', '40 (L)', '42 (XL)', '44 (XXL)'] }
    ],
    seller: {
      id: 'sel-4',
      name: 'Fabrilife & Heritage BD',
      isOfficial: false,
      rating: 92,
      shipOnTime: 95,
      chatResponse: 91,
      joinedYears: 4,
      location: 'Chittagong, Bangladesh'
    },
    warranty: '7 Days Return & Replacement Guarantee',
    returnPolicy: '7 Days Return',
    deliveryFee: 60,
    estimatedDeliveryDays: '2-4 Days',
    tags: ['Festive Collection', 'Eid Special', 'Cotton Panjabi']
  },

  // 5. Women's Fashion - Dhakai Jamdani Saree
  {
    id: 'prod-5',
    title: 'Traditional Handloom Pure Cotton Dhakai Jamdani Saree with Running Blouse Piece - 84 Count Fine Yarn',
    titleBn: 'ঐতিহ্যবাহী তাঁতের সুতি ঢাকাই জামদানি শাড়ি সাথে ব্লাউজ পিস',
    slug: 'handloom-dhakai-jamdani-saree',
    brand: 'Tangail Weavers',
    category: "Women's Fashion",
    categorySlug: 'womens-fashion',
    subCategory: 'sarees-kurtis',
    price: 2450,
    originalPrice: 4500,
    discountPercentage: 45,
    rating: 4.7,
    reviewsCount: 780,
    questionsCount: 95,
    soldCount: 1850,
    inStock: 25,
    isDarazMall: false,
    isFreeDelivery: true,
    isFlashSale: true,
    flashSaleEndTime: '06h 40m 15s',
    coinsCashback: 80,
    mainImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80'
    ],
    description: [
      'Authentic Rupganj handloom crafted Jamdani saree.',
      'Soft and lightweight pure cotton weave suitable for party & daily wear.',
      'Includes 80cm matching unstitched blouse piece.',
      'Saree Length: 12 Haat (approx 5.5 meters).'
    ],
    descriptionBn: [
      'খাঁটি তাঁতে বোনা সুতি ঢাকাই জামদানি শাড়ি।',
      'আরামদায়ক এবং পার্টি বা যেকোনো অনুষ্ঠানে পরার উপযোগী।',
      'সাথে রানিং ব্লাউজ পিস রয়েছে।'
    ],
    specifications: {
      'Fabric': '84 Count Pure Cotton Weave',
      'Length': '12 Hands (5.5m) + 0.8m Blouse',
      'Design': 'All-over Traditional Floral Jaal Motifs',
      'Occasion': 'Festive, Wedding, Pohela Boishakh, Casual'
    },
    variations: [
      { id: 'v-color', name: 'Color', options: ['Royal Red & Gold', 'Black & Golden', 'Mustard Yellow', 'Pastel Pink'] }
    ],
    seller: {
      id: 'sel-5',
      name: 'Dhakai Shari Ghar',
      isOfficial: false,
      rating: 91,
      shipOnTime: 94,
      chatResponse: 89,
      joinedYears: 6,
      location: 'Narayanganj, Bangladesh'
    },
    warranty: '100% Quality Assurance',
    returnPolicy: '7 Days Return',
    deliveryFee: 60,
    estimatedDeliveryDays: '2-4 Days',
    tags: ['Jamdani Saree', 'Traditional Wear', 'Women Fashion']
  },

  // 6. Home Appliances - Air Fryer
  {
    id: 'prod-6',
    title: 'Miyako 6.5 Litre Digital Touch Air Fryer (1800W) - 8 Preset Cooking Modes - 85% Less Oil Healthy Cooking',
    titleBn: 'মিয়াকো ৬.৫ লিটার ডিজিটাল এয়ার ফ্রায়ার (১৮০০ ওয়াট) - কম তেলে স্বাস্থ্যকর রান্না',
    slug: 'miyako-digital-touch-air-fryer',
    brand: 'Miyako',
    category: 'TV & Home Appliances',
    categorySlug: 'tv-home-appliances',
    subCategory: 'kitchen-appliances',
    price: 6850,
    originalPrice: 9500,
    discountPercentage: 28,
    rating: 4.9,
    reviewsCount: 1120,
    questionsCount: 260,
    soldCount: 3100,
    inStock: 50,
    isDarazMall: true,
    isFreeDelivery: true,
    isFlashSale: true,
    flashSaleEndTime: '18h 30m 00s',
    coinsCashback: 200,
    mainImage: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80'
    ],
    description: [
      'Large 6.5L capacity basket cooks whole chicken for entire family.',
      '360° rapid hot air circulation technology reduces oil by up to 85%.',
      'Touch LED panel with 8 smart presets: Fries, Chicken, Steak, Fish, Cake, Shrimp.',
      'Non-stick dishwasher safe basket with cool-touch safety handle.'
    ],
    descriptionBn: [
      '৬.৫ লিটার বড় ক্যাপাসিটি, পুরো পরিবারের জন্য খাবার প্রস্তুত করা যায়।',
      '৩৬০ ডিগ্রি গরম বাতাস সার্কুলেশন প্রযুক্তির ফলে ৮৫% কম তেলে ক্রিস্পি ভাজাভুজি।',
      '৮টি প্রিসেট কুকিং মোড সহ টাচ কন্ট্রোল প্যানেল।'
    ],
    specifications: {
      'Capacity': '6.5 Liters',
      'Power': '1800 Watts',
      'Temperature Range': '80°C - 200°C',
      'Timer': '0-60 Minutes with Auto Shut-off',
      'Voltage': '220-240V / 50Hz'
    },
    variations: [
      { id: 'v-color', name: 'Color', options: ['Glossy Black Gold', 'Matte Grey'] }
    ],
    seller: {
      id: 'sel-6',
      name: 'Miyako Official Appliance Store',
      isOfficial: true,
      rating: 97,
      shipOnTime: 99,
      chatResponse: 98,
      joinedYears: 5,
      location: 'Dhaka, Bangladesh',
      badge: 'DarazMall Flagship'
    },
    warranty: '2 Years Official Service Warranty',
    returnPolicy: '14 Days Free Return',
    deliveryFee: 0,
    estimatedDeliveryDays: '1-3 Days',
    tags: ['Kitchen Appliance', 'Air Fryer', 'DarazMall']
  },

  // 7. TV - Walton Smart 43"
  {
    id: 'prod-7',
    title: 'Walton 43" 4K Frameless Android Smart LED TV with Google Assistant, Dolby Audio & Netflix / YouTube Certified',
    titleBn: 'ওয়ালটন ৪৩ ইঞ্চি ৪কে ফ্রেমলেস অ্যান্ড্রয়েড স্মার্ট এলইডি টিভি - ডলবি অডিও',
    slug: 'walton-43-inch-4k-android-smart-tv',
    brand: 'Walton',
    category: 'TV & Home Appliances',
    categorySlug: 'tv-home-appliances',
    subCategory: 'smart-tvs',
    price: 32900,
    originalPrice: 38900,
    discountPercentage: 15,
    rating: 4.7,
    reviewsCount: 650,
    questionsCount: 140,
    soldCount: 1200,
    inStock: 18,
    isDarazMall: true,
    isFreeDelivery: true,
    isFlashSale: false,
    coinsCashback: 400,
    mainImage: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&q=80'
    ],
    description: [
      'Ultra HD 4K (3840x2160) IPS panel with HDR10 support and wide color gamut.',
      'Licensed Android TV OS with Google Play Store, Voice Remote Assistant.',
      '20W Stereo Speakers with Dolby Digital Audio Processing.',
      'Built-in Dual Band Wi-Fi, Bluetooth 5.0, 3x HDMI, 2x USB ports.'
    ],
    descriptionBn: [
      '৪৩ ইঞ্চি ৪কে আল্ট্রা এইচডি আইপিএস ডিসপ্লে প্যানেল।',
      'লাইসেন্সড অ্যান্ড্রয়েড ১১ ওএস, গুগল প্লে স্টোর ও ভয়েস কন্ট্রোল রিমোট।',
      'ডলবি অডিও সাউন্ড এবং ৫ বছরের প্যানেল গ্যারান্টি।'
    ],
    specifications: {
      'Screen Size': '43 Inches Frameless Design',
      'Resolution': '4K UHD (3840 x 2160)',
      'RAM / ROM': '2GB DDR4 + 16GB Storage',
      'Audio': '20W Dolby Audio Stereo',
      'Connectivity': '3x HDMI, 2x USB, Wi-Fi, Bluetooth, Optical'
    },
    variations: [
      { id: 'v-size', name: 'Screen Size', options: ['32 Inch HD', '43 Inch 4K UHD', '55 Inch 4K UHD'] }
    ],
    seller: {
      id: 'sel-7',
      name: 'Walton Plaza Official',
      isOfficial: true,
      rating: 98,
      shipOnTime: 99,
      chatResponse: 96,
      joinedYears: 7,
      location: 'Gazipur, Bangladesh',
      badge: 'DarazMall Flagship'
    },
    warranty: '5 Years Panel Guarantee + 3 Years Free Service',
    returnPolicy: '14 Days Free Return',
    deliveryFee: 0,
    estimatedDeliveryDays: '2-4 Days (Express Courier)',
    tags: ['Walton', '4K Smart TV', 'Dolby Audio']
  },

  // 8. Groceries - Teer Pure Soybean Oil & Miniket Rice Combo
  {
    id: 'prod-8',
    title: 'Teer Fortified Soybean Oil (5 Litre Can) + Premium Miniket Polished Rice (5 KG Bag) Mega Grocery Combo',
    titleBn: 'তীর ফর্টিফাইড সয়াবিন তেল (৫ লিটার) + মিনিকেট চাল (৫ কেজি) গ্রোসারি কম্বো',
    slug: 'teer-soybean-oil-miniket-rice-combo',
    brand: 'Teer',
    category: 'Groceries & Daily Needs',
    categorySlug: 'groceries-pets',
    subCategory: 'cooking-essentials',
    price: 1199,
    originalPrice: 1450,
    discountPercentage: 17,
    rating: 4.9,
    reviewsCount: 5400,
    questionsCount: 110,
    soldCount: 19400,
    inStock: 300,
    isDarazMall: true,
    isFreeDelivery: true,
    isFlashSale: true,
    flashSaleEndTime: '11h 00m 00s',
    coinsCashback: 30,
    mainImage: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80'
    ],
    description: [
      '100% pure refined soybean oil enriched with Vitamin A & D.',
      'Finest grain long Miniket rice, stone-free and hygienic packaging.',
      'Essential daily cooking bundle delivered safely to your doorstep.',
      'Sourced directly from City Group manufacturing facilities.'
    ],
    descriptionBn: [
      'ভিটামিন এ ও ডি সমৃদ্ধ বিশুদ্ধ তীর সয়াবিন তেল ৫ লিটার।',
      'ঝরঝরে দীর্ঘ দানার বাছাইকৃত মিনিকেট চাল ৫ কেজি।',
      'দারাজ মার্ট এর দ্রুত ডেলিভারি সুবিধা।'
    ],
    specifications: {
      'Oil Quantity': '5 Liters Poly Can',
      'Rice Weight': '5 Kilograms Vacuum Sealed',
      'Shelf Life': '12 Months',
      'Certification': 'BSTI Certified 100% Pure'
    },
    variations: [
      { id: 'v-pack', name: 'Pack Type', options: ['Oil 5L + Rice 5KG Combo', 'Oil 5L Only', 'Rice 10KG Only'] }
    ],
    seller: {
      id: 'sel-8',
      name: 'Daraz Mart Official Express',
      isOfficial: true,
      rating: 99,
      shipOnTime: 100,
      chatResponse: 99,
      joinedYears: 5,
      location: 'Tejgaon, Dhaka',
      badge: 'DarazMart 2-Hour Delivery'
    },
    warranty: '100% Freshness & Authenticity Guaranteed',
    returnPolicy: '7 Days Return',
    deliveryFee: 0,
    estimatedDeliveryDays: 'Next Day Delivery in Dhaka',
    tags: ['DarazMart', 'Grocery', 'Cooking Oil']
  },

  // 9. Skincare & Beauty - COSRX Snail Mucin Power Essence
  {
    id: 'prod-9',
    title: 'COSRX Advanced Snail 96 Mucin Power Essence (100ml) - Korean Glass Skin Hydration & Repair Serum',
    titleBn: 'কসআরএক্স অ্যাডভান্সড স্নেল ৯৬ মিউসিন পাওয়ার এসেন্স (১০০ মিলি) - কোরিয়ান স্কিন কেয়ার',
    slug: 'cosrx-snail-96-mucin-essence',
    brand: 'COSRX',
    category: 'Health & Beauty',
    categorySlug: 'health-beauty',
    subCategory: 'skincare',
    price: 1550,
    originalPrice: 2400,
    discountPercentage: 35,
    rating: 4.9,
    reviewsCount: 2310,
    questionsCount: 410,
    soldCount: 6500,
    inStock: 90,
    isDarazMall: true,
    isFreeDelivery: true,
    isFlashSale: true,
    flashSaleEndTime: '15h 10m 00s',
    coinsCashback: 50,
    mainImage: 'https://images.unsplash.com/photo-1608248597359-28c93eb84e4f?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1608248597359-28c93eb84e4f?w=600&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80'
    ],
    description: [
      'Contains 96.3% snail secretion filtrate to deeply nourish dry skin.',
      'Soothes damaged skin barriers, fades dark spots, and enhances skin elasticity.',
      '100% Authentic Korean import with QR authenticity check.',
      'Lightweight and fast-absorbing without any sticky residue.'
    ],
    descriptionBn: [
      '৯৬.৩% স্নেল সিক্রেশন সমৃদ্ধ যা ত্বককে গভীরভাবে হাইড্রেট এবং উজ্জ্বল করে।',
      'কোরিয়ান গ্লাস স্কিন পাওয়ার জন্য সেরা এসেন্স সিরাম।',
      '১০০% আসল অথেনটিক গ্যারান্টি।'
    ],
    specifications: {
      'Volume': '100ml / 3.38 fl.oz',
      'Skin Type': 'All Skin Types (Acne-prone, Dry, Sensitive)',
      'Key Ingredient': 'Snail Secretion Filtrate, Sodium Hyaluronate',
      'Country of Origin': 'South Korea'
    },
    seller: {
      id: 'sel-9',
      name: 'K-Beauty Bangladesh Official',
      isOfficial: true,
      rating: 96,
      shipOnTime: 98,
      chatResponse: 95,
      joinedYears: 4,
      location: 'Banani, Dhaka',
      badge: 'DarazMall Flagship'
    },
    warranty: '100% Authentic Product Guarantee',
    returnPolicy: '14 Days Free Return',
    deliveryFee: 0,
    estimatedDeliveryDays: '1-2 Days in Dhaka',
    tags: ['K-Beauty', 'Glass Skin', 'Authentic']
  },

  // 10. Shoes - Apex Men's Formal Leather Shoes
  {
    id: 'prod-10',
    title: "Apex Men's Genuine Leather Lace-Up Formal Derby Shoes - Anti-Slip Rubber Sole - Executive Collection",
    titleBn: 'এপেক্স জেনুইন লেদার ফর্মাল ডার্বি সু - অফিস ও এক্সিকিউটিভ কালেকশন',
    slug: 'apex-mens-genuine-leather-derby-shoes',
    brand: 'Apex',
    category: "Men's Fashion",
    categorySlug: 'mens-fashion',
    subCategory: 'mens-shoes',
    price: 3490,
    originalPrice: 4800,
    discountPercentage: 27,
    rating: 4.8,
    reviewsCount: 920,
    questionsCount: 88,
    soldCount: 2800,
    inStock: 40,
    isDarazMall: true,
    isFreeDelivery: true,
    isFlashSale: false,
    coinsCashback: 100,
    mainImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80'
    ],
    description: [
      'Handcrafted with 100% full-grain genuine cow leather upper.',
      'Cushioned memory foam insole provides all-day comfort at office.',
      'High-traction TPR anti-skid durable outsole.',
      'Perfect for business meetings, weddings, and formal wear.'
    ],
    descriptionBn: [
      '১০০% খাঁটি চামড়া দিয়ে তৈরি প্রিমিয়াম ডার্বি ফর্মাল সু।',
      'মেমোরি ফোম ইনসোল সারাদিন আরামদায়ক ব্যবহারের জন্য।',
      'অফিস, মিটিং এবং বিয়ে-অনুষ্ঠানে পরার জন্য নিখুঁত।'
    ],
    specifications: {
      'Upper Material': '100% Genuine Cow Leather',
      'Sole Material': 'TPR Anti-Slip Rubber',
      'Insole': 'Cushioned Breathable Memory Foam',
      'Closure': 'Lace-Up'
    },
    variations: [
      { id: 'v-color', name: 'Color', options: ['Polished Black', 'Dark Brown', 'Tan'] },
      { id: 'v-size', name: 'Shoe Size (EU)', options: ['39 (6 UK)', '40 (7 UK)', '41 (8 UK)', '42 (9 UK)', '43 (10 UK)', '44 (11 UK)'] }
    ],
    seller: {
      id: 'sel-10',
      name: 'Apex Footwear Flagship Store',
      isOfficial: true,
      rating: 98,
      shipOnTime: 99,
      chatResponse: 97,
      joinedYears: 6,
      location: 'Dhaka, Bangladesh',
      badge: 'DarazMall Flagship'
    },
    warranty: '3 Months Brand Warranty',
    returnPolicy: '14 Days Free Return & Size Exchange',
    deliveryFee: 0,
    estimatedDeliveryDays: '2-3 Days',
    tags: ['Apex Leather', 'Formal Shoes', 'Office Wear']
  },

  // 11. Laptop / Computing - ASUS Vivobook 15
  {
    id: 'prod-11',
    title: 'ASUS Vivobook 15 Core i5 13th Gen (16GB RAM / 512GB NVMe SSD / 15.6" FHD IPS / Backlit Keyboard) - Quiet Blue',
    titleBn: 'আসুস ভিভোবুক ১৫ কোর আই৫ ১৩তম জেনারেশন ল্যাপটপ (১৬জিবি র‍্যাম / ৫১২জিবি এসএসডি)',
    slug: 'asus-vivobook-15-core-i5-13th-gen',
    brand: 'ASUS',
    category: 'Electronic Devices',
    categorySlug: 'electronic-devices',
    subCategory: 'laptops-computers',
    price: 74500,
    originalPrice: 84000,
    discountPercentage: 11,
    rating: 4.9,
    reviewsCount: 310,
    questionsCount: 160,
    soldCount: 650,
    inStock: 12,
    isDarazMall: true,
    isFreeDelivery: true,
    isFlashSale: false,
    coinsCashback: 800,
    mainImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80'
    ],
    description: [
      'Intel Core i5-1335U Processor (10 Cores, 12 Threads, Up to 4.60 GHz).',
      '15.6-inch Full HD (1920x1080) Anti-glare Display with TÜV Rheinland-certification.',
      '16GB DDR4 High-speed RAM + 512GB M.2 NVMe PCIe SSD.',
      'ErgoSense backlit keyboard with physical privacy webcam shutter.',
      'Military-grade MIL-STD-810H durability standard.'
    ],
    descriptionBn: [
      'ইনটেল কোর আই৫ ১৩তম জেনারেশনের শক্তিশালী প্রসেসর।',
      '১৬জিবি র‍্যাম এবং ৫১২জিবি অতি দ্রুতগতির এসএসডি ড্রাইভ।',
      '১৫.৬ ইঞ্চি ফুল এইচডি অ্যান্টি-গ্লেয়ার ডিসপ্লে।'
    ],
    specifications: {
      'Processor': 'Intel Core i5-1335U (up to 4.6GHz)',
      'Memory': '16GB DDR4 3200MHz',
      'Storage': '512GB M.2 NVMe PCIe 3.0 SSD',
      'Graphics': 'Intel Iris Xe Graphics',
      'Battery': '42WHrs, 3-cell Li-ion Fast Charge'
    },
    variations: [
      { id: 'v-color', name: 'Color', options: ['Quiet Blue', 'Cool Silver'] }
    ],
    seller: {
      id: 'sel-11',
      name: 'ASUS Official BD Brand Store',
      isOfficial: true,
      rating: 98,
      shipOnTime: 100,
      chatResponse: 98,
      joinedYears: 6,
      location: 'IDB Bhaban, Dhaka',
      badge: 'DarazMall Flagship'
    },
    warranty: '2 Years Global Brand Warranty',
    returnPolicy: '14 Days Free Return',
    deliveryFee: 0,
    estimatedDeliveryDays: '1-3 Days (Insured Delivery)',
    tags: ['ASUS', 'Laptop', 'Core i5', 'Official']
  },

  // 12. Power Bank - Baseus 20000mAh 65W
  {
    id: 'prod-12',
    title: 'Baseus 65W 20000mAh Blade Ultra Thin Fast Charging Power Bank for Laptops, MacBooks & Phones - Digital Display',
    titleBn: 'বেসউস ৬৫ ওয়াট ২০০০০ এমএএইচ ফাস্ট চার্জিং পাওয়ার ব্যাংক - ল্যাপটপ ও ফোন চার্জার',
    slug: 'baseus-65w-20000mah-blade-power-bank',
    brand: 'Baseus',
    category: 'Electronic Accessories',
    categorySlug: 'electronic-accessories',
    subCategory: 'power-banks',
    price: 4350,
    originalPrice: 6200,
    discountPercentage: 30,
    rating: 4.8,
    reviewsCount: 1450,
    questionsCount: 290,
    soldCount: 4600,
    inStock: 65,
    isDarazMall: true,
    isFreeDelivery: true,
    isFlashSale: true,
    flashSaleEndTime: '09h 45m 12s',
    coinsCashback: 90,
    mainImage: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80'
    ],
    description: [
      '65W high-power output fast charges MacBook Pro/Air and USB-C Windows laptops.',
      'Super slim 18mm blade profile slips easily into computer backpack.',
      'Real-time digital status screen shows battery %, charging wattage and remaining time.',
      'Simultaneous 4-port output charges phone, tablet, and accessories together.'
    ],
    descriptionBn: [
      '৬৫ ওয়াট হাই পাওয়ার আউটপুট যা সরাসরি ল্যাপটপ এবং ম্যাকবুক চার্জ করতে পারে।',
      '২০,০০০ এমএএইচ মেগা ব্যাটারি ব্যাকআপ।',
      'ডিজিটাল ডিসপ্লেতে চার্জিং ভোল্টেজ ও শতাংশ দেখা যায়।'
    ],
    specifications: {
      'Capacity': '20000mAh / 74Wh',
      'Max Power Output': '65W USB-C PD 3.0 / QC 4+',
      'Ports': '2x USB-C (Input/Output) + 2x USB-A (Output)',
      'Dimensions': '162 x 143 x 18 mm',
      'Weight': '490g'
    },
    seller: {
      id: 'sel-12',
      name: 'Baseus BD Official Mall',
      isOfficial: true,
      rating: 97,
      shipOnTime: 99,
      chatResponse: 96,
      joinedYears: 5,
      location: 'Dhaka, Bangladesh',
      badge: 'DarazMall Flagship'
    },
    warranty: '6 Months Replacement Warranty',
    returnPolicy: '14 Days Free Return',
    deliveryFee: 0,
    estimatedDeliveryDays: '1-2 Days in Dhaka',
    tags: ['Baseus', '65W PowerBank', 'Fast Charge']
  }
];

// Generate reviews sample helper
PRODUCTS_DATA.forEach(p => {
  if (!p.reviews || p.reviews.length === 0) {
    p.reviews = [
      {
        id: `rev-${p.id}-1`,
        userName: 'Tanvir Ahmed',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
        rating: 5,
        date: '3 days ago',
        comment: 'অসাধারণ প্রোডাক্ট! যেমন ছবিতে দেখেছি ঠিক তেমনই পেয়েছি। ডেলিভারিও খুব ফাস্ট ছিল মাত্র ২ দিনে হাতে পেয়েছি। প্যাকেজিংও খুব ভালো ছিল। দারাজকে ধন্যবাদ!',
        verified: true,
        helpfulCount: 24,
        variantPurchased: p.variations?.[0]?.options?.[0]
      },
      {
        id: `rev-${p.id}-2`,
        userName: 'Sabrina Mostofa',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        rating: 5,
        date: '1 week ago',
        comment: '100% authentic product! Checked the official serial code and warranty. Price was much cheaper during Flash Sale with bKash voucher discount. Highly recommended seller.',
        verified: true,
        helpfulCount: 18,
        images: [p.mainImage],
        variantPurchased: p.variations?.[0]?.options?.[1] || p.variations?.[0]?.options?.[0]
      },
      {
        id: `rev-${p.id}-3`,
        userName: 'Rashedul Karim',
        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80',
        rating: 4,
        date: '2 weeks ago',
        comment: 'Good build quality and performance as expected. The seller response was fast. Overall very satisfied with the purchase.',
        verified: true,
        helpfulCount: 9
      }
    ];
  }
});
