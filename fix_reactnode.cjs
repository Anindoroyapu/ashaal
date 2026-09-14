const fs = require('fs');
let code = fs.readFileSync('src/views/ProductDetailPage.tsx', 'utf8');

code = code.replace(
  '{selectedVariations[v.name] || v.options[0]}',
  '{selectedVariations[v.name] || (typeof v.options[0] === "string" ? v.options[0] : v.options[0].name)}'
);

code = code.replace(
  'key={opt}',
  'key={typeof opt === "string" ? opt : opt.name}'
);

fs.writeFileSync('src/views/ProductDetailPage.tsx', code);
console.log('Fixed ReactNode errors');

