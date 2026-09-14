const fs = require('fs');

function addImport(file, importStmt) {
  let code = fs.readFileSync(file, 'utf8');
  if (!code.includes(importStmt)) {
    code = code.replace(
      /import React([^;]+);|import React(.*)from ["']react["'];/, 
      match => match + '\n' + importStmt
    );
    fs.writeFileSync(file, code);
  }
}

addImport('src/context/AppContext.tsx', 'import { getEffectivePrice } from "@/utils/productUtils";');
addImport('src/views/ProductDetailPage.tsx', 'import { getEffectivePrice, getEffectiveStock } from "@/utils/productUtils";');
addImport('src/views/CartPage.tsx', 'import { getEffectivePrice } from "@/utils/productUtils";');
addImport('src/views/CheckoutPage.tsx', 'import { getEffectivePrice } from "@/utils/productUtils";');
console.log('Fixed imports');
