const fs = require('fs');
let code = fs.readFileSync('src/views/CartPage.tsx', 'utf8');

if (!code.includes('getEffectivePrice')) {
  code = code.replace(
    'import { useApp } from "@/context/AppContext";',
    'import { useApp } from "@/context/AppContext";\nimport { getEffectivePrice } from "@/utils/productUtils";'
  );
}

// Replace formatPrice(item.product.final_price || item.product.price) or similar
// Let's use regex
code = code.replace(
  /item\.product\.final_price\s*\|\|\s*item\.product\.price/g,
  'getEffectivePrice(item.product, item.selectedVariations)'
);

code = code.replace(
  /item\.product\.price/g, // if they just used item.product.price
  'getEffectivePrice(item.product, item.selectedVariations)'
);

// We should be careful not to replace it if it's already getEffectivePrice(item.product, item.selectedVariations)
// Let's just do a manual check
fs.writeFileSync('src/views/CartPage.tsx', code);
console.log('Patched CartPage');

