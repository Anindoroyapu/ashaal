const fs = require('fs');
let code = fs.readFileSync('src/views/ProductDetailPage.tsx', 'utf8');

code = code.replace(
  'import { useApp } from "@/context/AppContext";',
  'import { useApp } from "@/context/AppContext";\nimport { getEffectivePrice, getEffectiveStock } from "@/utils/productUtils";'
);

code = code.replace(
  '{formatPrice(product.final_price || product.price)}',
  '{formatPrice(getEffectivePrice(product, selectedVariations))}'
);

code = code.replace(
  '{product.inStock > 0 ? (',
  '{getEffectiveStock(product, selectedVariations) > 0 ? ('
);

// We should also replace the stock count display if it exists
code = code.replace(
  '{product.inStock} {t("items available", "টি এভেইলেবল")}',
  '{getEffectiveStock(product, selectedVariations)} {t("items available", "টি এভেইলেবল")}'
);

fs.writeFileSync('src/views/ProductDetailPage.tsx', code);
console.log('Patched ProductDetailPage');

