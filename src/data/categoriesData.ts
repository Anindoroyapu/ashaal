import { Category } from '../types';

export const CATEGORIES_DATA: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronic Devices',
    nameBn: 'ইলেকট্রনিক ডিভাইস',
    slug: 'electronic-devices',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
    subCategories: [
      {
        id: 'sub-1-1',
        name: 'Smartphones',
        nameBn: 'স্মার্টফোন',
        slug: 'smartphones',
        items: ['Xiaomi', 'Samsung', 'Realme', 'Infinix', 'Apple iPhone', 'Vivo', 'Oppo']
      },
      {
        id: 'sub-1-2',
        name: 'Laptops & Computers',
        nameBn: 'ল্যাপটপ ও কম্পিউটার',
        slug: 'laptops-computers',
        items: ['Gaming Laptops', 'MacBooks', 'Ultrabooks', 'Desktop PCs', 'PC Components']
      },
      {
        id: 'sub-1-3',
        name: 'Tablets',
        nameBn: 'ট্যাবলেট',
        slug: 'tablets',
        items: ['iPad', 'Android Tablets', 'Drawing Tablets', 'E-readers']
      },
      {
        id: 'sub-1-4',
        name: 'Feature Phones',
        nameBn: 'বাটন ফোন',
        slug: 'feature-phones',
        items: ['Nokia', 'Symphony', 'Walton', 'Itel']
      }
    ]
  },
  {
    id: 'cat-2',
    name: 'Electronic Accessories',
    nameBn: 'ইলেকট্রনিক এক্সেসরিজ',
    slug: 'electronic-accessories',
    icon: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
    subCategories: [
      {
        id: 'sub-2-1',
        name: 'Earbuds & Headphones',
        nameBn: 'ইয়ারবাডস ও হেডফোন',
        slug: 'earbuds-headphones',
        items: ['TWS Earbuds', 'Gaming Headset', 'Neckbands', 'Wired Earphones']
      },
      {
        id: 'sub-2-2',
        name: 'Smartwatches & Bands',
        nameBn: 'স্মার্টওয়াচ',
        slug: 'smartwatches',
        items: ['Fitness Bands', 'Apple Watch', 'Xiaomi Band', 'Haylou', 'Amazfit']
      },
      {
        id: 'sub-2-3',
        name: 'Power Banks & Chargers',
        nameBn: 'পাওয়ার ব্যাংক ও চার্জার',
        slug: 'power-banks',
        items: ['20000mAh Power Banks', 'Fast Chargers', 'Type-C Cables', 'Car Chargers']
      },
      {
        id: 'sub-2-4',
        name: 'Camera & Accessories',
        nameBn: 'ক্যামেরা এক্সেসরিজ',
        slug: 'camera-accessories',
        items: ['DSLR Cameras', 'Tripods', 'Ring Lights', 'Gimbals', 'Action Cams']
      }
    ]
  },
  {
    id: 'cat-3',
    name: 'TV & Home Appliances',
    nameBn: 'টিভি ও হোম অ্যাপ্লায়েন্সেস',
    slug: 'tv-home-appliances',
    icon: 'Tv',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&q=80',
    subCategories: [
      {
        id: 'sub-3-1',
        name: 'Smart Televisions',
        nameBn: 'স্মার্ট টেলিভিশন',
        slug: 'smart-tvs',
        items: ['4K Android TVs', 'OLED TVs', 'Walton TVs', 'Sony Bravia', 'Samsung LED']
      },
      {
        id: 'sub-3-2',
        name: 'Air Conditioners & Coolers',
        nameBn: 'এয়ার কন্ডিশনার (AC)',
        slug: 'air-conditioners',
        items: ['Inverter AC', '1.5 Ton AC', 'Air Coolers', 'Ceiling Fans']
      },
      {
        id: 'sub-3-3',
        name: 'Kitchen Appliances',
        nameBn: 'রান্নাঘরের যন্ত্রপাতি',
        slug: 'kitchen-appliances',
        items: ['Air Fryers', 'Blenders & Grinders', 'Rice Cookers', 'Microwave Ovens', 'Electric Kettles']
      },
      {
        id: 'sub-3-4',
        name: 'Refrigerators & Freezers',
        nameBn: 'ফ্রিজ ও ডিপ ফ্রিজ',
        slug: 'refrigerators',
        items: ['Non-Frost Refrigerators', 'Deep Freezers', 'Mini Fridges']
      }
    ]
  },
  {
    id: 'cat-4',
    name: 'Health & Beauty',
    nameBn: 'স্বাস্থ্য ও রূপচর্চা',
    slug: 'health-beauty',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&q=80',
    subCategories: [
      {
        id: 'sub-4-1',
        name: 'Skincare',
        nameBn: 'স্কিন কেয়ার',
        slug: 'skincare',
        items: ['Sunscreen', 'Face Wash', 'Moisturizers', 'Serums & Essences', 'Sheet Masks']
      },
      {
        id: 'sub-4-2',
        name: 'Hair Care',
        nameBn: 'হেয়ার কেয়ার',
        slug: 'hair-care',
        items: ['Shampoo', 'Hair Oil', 'Hair Serum', 'Conditioner', 'Hair Dryers']
      },
      {
        id: 'sub-4-3',
        name: 'Perfumes & Deodorants',
        nameBn: 'পারফিউম ও সুগন্ধি',
        slug: 'perfumes',
        items: ['Men Perfumes', 'Women Body Spray', 'Attar', 'Luxury Fragrances']
      },
      {
        id: 'sub-4-4',
        name: 'Personal Care',
        nameBn: 'ব্যক্তিগত যত্ন',
        slug: 'personal-care',
        items: ['Oral Care', 'Trimmers & Shavers', 'Body Wash', 'Hand Sanitizers']
      }
    ]
  },
  {
    id: 'cat-5',
    name: "Men's Fashion",
    nameBn: 'পুরুষের ফ্যাশন',
    slug: 'mens-fashion',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&q=80',
    subCategories: [
      {
        id: 'sub-5-1',
        name: 'Traditional Clothing',
        nameBn: 'পাঞ্জাবি ও পায়জামা',
        slug: 'mens-traditional',
        items: ['Semi-fitted Panjabi', 'Kabli Sets', 'Cotton Lungi', 'Pajama', 'Shawls']
      },
      {
        id: 'sub-5-2',
        name: 'T-Shirts & Polos',
        nameBn: 'টি-শার্ট ও পোলো',
        slug: 't-shirts-polos',
        items: ['Drop Shoulder T-Shirts', 'Polo T-Shirts', 'Graphic Tees', 'Oversized Tees']
      },
      {
        id: 'sub-5-3',
        name: 'Jeans & Trousers',
        nameBn: 'জিন্স ও ট্রাউজার',
        slug: 'mens-pants',
        items: ['Slim Fit Jeans', 'Cargo Pants', 'Formal Trousers', 'Joggers']
      },
      {
        id: 'sub-5-4',
        name: "Men's Shoes",
        nameBn: 'জুতো ও স্নিকার্স',
        slug: 'mens-shoes',
        items: ['Apex Formal Shoes', 'Sneakers', 'Lotto Sports Shoes', 'Sandals & Slides']
      }
    ]
  },
  {
    id: 'cat-6',
    name: "Women's Fashion",
    nameBn: 'নারীদের ফ্যাশন',
    slug: 'womens-fashion',
    icon: 'Heart',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80',
    subCategories: [
      {
        id: 'sub-6-1',
        name: 'Sarees & Kurtis',
        nameBn: 'শাড়ি ও কুর্তি',
        slug: 'sarees-kurtis',
        items: ['Jamdani Sarees', 'Georgette Sarees', 'Cotton Kurtis', 'Three-Piece Sets', 'Abayas & Hijabs']
      },
      {
        id: 'sub-6-2',
        name: 'Western Wear',
        nameBn: 'ওয়েস্টার্ন পোশাক',
        slug: 'womens-western',
        items: ['Tops & Tunic', 'Denim Jeans', 'Dresses', 'Jackets & Hoodies']
      },
      {
        id: 'sub-6-3',
        name: 'Bags & Purses',
        nameBn: 'ব্যাগ ও পার্স',
        slug: 'womens-bags',
        items: ['Tote Bags', 'Crossbody Bags', 'Backpacks', 'Wallets']
      },
      {
        id: 'sub-6-4',
        name: 'Jewellery',
        nameBn: 'গহনা',
        slug: 'jewellery',
        items: ['Gold Plated Sets', 'Earrings', 'Necklaces', 'Anklets', 'Bangles']
      }
    ]
  },
  {
    id: 'cat-7',
    name: 'Groceries & Daily Needs',
    nameBn: 'মুদি বাজার ও নিত্যপণ্য',
    slug: 'groceries-pets',
    icon: 'ShoppingBag',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80',
    subCategories: [
      {
        id: 'sub-7-1',
        name: 'Cooking Essentials',
        nameBn: 'রান্নার প্রয়োজনীয় সামগ্রী',
        slug: 'cooking-essentials',
        items: ['Soybean Oil', 'Mustard Oil', 'Miniket Rice', 'Basmati Rice', 'Chotpoti & Spices', 'Salt & Sugar']
      },
      {
        id: 'sub-7-2',
        name: 'Beverages & Tea',
        nameBn: 'চা ও পানীয়',
        slug: 'beverages',
        items: ['Ispahani Tea', 'Kazi Tea', 'Coffee', 'Juices & Syrups', 'Horlicks & Milk Powder']
      },
      {
        id: 'sub-7-3',
        name: 'Snacks & Bakery',
        nameBn: 'স্ন্যাকস ও বিস্কুট',
        slug: 'snacks-bakery',
        items: ['Chanachur', 'Chocolates', 'Noodles', 'Biscuits', 'Potato Chips']
      },
      {
        id: 'sub-7-4',
        name: 'Household Cleaning',
        nameBn: 'ঘরবাড়ি পরিষ্কারের সামগ্রী',
        slug: 'household-cleaning',
        items: ['Detergent Powder', 'Dishwash Liquids', 'Toilet Cleaners', 'Floor Wash']
      }
    ]
  },
  {
    id: 'cat-8',
    name: 'Home & Living',
    nameBn: 'হোম ও লাইফস্টাইল',
    slug: 'home-lifestyle',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&q=80',
    subCategories: [
      {
        id: 'sub-8-1',
        name: 'Bedding & Furniture',
        nameBn: 'বিছানার চাদর ও ফার্নিচার',
        slug: 'bedding-furniture',
        items: ['Bedsheets', 'Pillows & Cushions', 'Curtains', 'Storage Organizers', 'Study Tables']
      },
      {
        id: 'sub-8-2',
        name: 'Kitchen & Dining',
        nameBn: 'ডাইনিং ও বাসনপত্র',
        slug: 'kitchen-dining',
        items: ['Non-stick Cookware Sets', 'Dinner Sets', 'Water Bottles', 'Cutlery']
      },
      {
        id: 'sub-8-3',
        name: 'Lighting & Decor',
        nameBn: 'লাইটিং ও ডেকোরেশন',
        slug: 'lighting-decor',
        items: ['Fairy Lights', 'Wall Clocks', 'Floor Lamps', 'Paintings & Frames']
      }
    ]
  },
  {
    id: 'cat-9',
    name: 'Babies & Toys',
    nameBn: 'বেবি ও খেলনা',
    slug: 'babies-toys',
    icon: 'Baby',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&q=80',
    subCategories: [
      {
        id: 'sub-9-1',
        name: 'Diapers & Wipes',
        nameBn: 'ডায়াপার ও ওয়াইপস',
        slug: 'diapers-wipes',
        items: ['Pampers', 'Huggies', 'MamyPoko', 'Baby Wet Wipes']
      },
      {
        id: 'sub-9-2',
        name: 'Baby Care & Food',
        nameBn: 'বেবি ফুড ও যত্ন',
        slug: 'baby-care-food',
        items: ['Cerelac', 'Baby Lotion', 'Baby Oil', 'Feeding Bottles']
      },
      {
        id: 'sub-9-3',
        name: 'Remote Control & Toys',
        nameBn: 'খেলনা ও গেমস',
        slug: 'toys-games',
        items: ['RC Cars', 'Educational Toys', 'Lego Blocks', 'Dolls']
      }
    ]
  },
  {
    id: 'cat-10',
    name: 'Sports & Outdoor',
    nameBn: 'খেলাধুলা ও আউটডোর',
    slug: 'sports-outdoor',
    icon: 'Trophy',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&q=80',
    subCategories: [
      {
        id: 'sub-10-1',
        name: 'Cricket & Football',
        nameBn: 'ক্রিকেট ও ফুটবল',
        slug: 'cricket-football',
        items: ['Cricket Bats', 'Bangladesh Team Jersey', 'Footballs', 'Gloves & Pads']
      },
      {
        id: 'sub-10-2',
        name: 'Gym & Fitness',
        nameBn: 'জিম ও ফিটনেস',
        slug: 'gym-fitness',
        items: ['Dumbbells', 'Yoga Mats', 'Resistance Bands', 'Protein Shakers']
      },
      {
        id: 'sub-10-3',
        name: 'Bicycles & Accessories',
        nameBn: 'সাইকেল ও এক্সেসরিজ',
        slug: 'bicycles',
        items: ['MTB Bicycles', 'Cycle Helmets', 'Cycle Lights', 'Locks']
      }
    ]
  }
];
