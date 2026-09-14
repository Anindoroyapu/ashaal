const fs = require('fs');
let code = fs.readFileSync('src/views/CheckoutPage.tsx', 'utf8');

if (!code.includes('getEffectivePrice')) {
  code = code.replace(
    'import { useApp } from "@/context/AppContext";',
    'import { useApp } from "@/context/AppContext";\nimport { getEffectivePrice } from "@/utils/productUtils";'
  );
}

code = code.replace(
  /item\.product\.final_price\s*\|\|\s*item\.product\.price/g,
  'getEffectivePrice(item.product, item.selectedVariations)'
);
code = code.replace(
  /item\.product\.price\s*\*/g, 
  'getEffectivePrice(item.product, item.selectedVariations) *'
);

fs.writeFileSync('src/views/CheckoutPage.tsx', code);
console.log('Patched CheckoutPage');

