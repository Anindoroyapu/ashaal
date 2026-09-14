const fs = require('fs');

// Fix ProductCard.tsx
let pcCode = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');
pcCode = pcCode.replace(
  'defaultVars[v.name] = v.options[0];',
  'defaultVars[v.name] = typeof v.options[0] === "string" ? v.options[0] : v.options[0].name;'
);
fs.writeFileSync('src/components/ProductCard.tsx', pcCode);

// Fix ProductDetailPage.tsx
let pdpCode = fs.readFileSync('src/views/ProductDetailPage.tsx', 'utf8');
pdpCode = pdpCode.replace(
  'initial[v.name] = v.options[0];',
  'initial[v.name] = typeof v.options[0] === "string" ? v.options[0] : v.options[0].name;'
);
pdpCode = pdpCode.replace(
  'initial[v.name] = v.options[0];', // There are two initializations? Let's use regex
  'initial[v.name] = typeof v.options[0] === "string" ? v.options[0] : v.options[0].name;'
);
// Replace v.options[0] in isSelected
pdpCode = pdpCode.replace(
  '(selectedVariations[v.name] || v.options[0]) === opt;',
  '(selectedVariations[v.name] || (typeof v.options[0] === "string" ? v.options[0] : v.options[0].name)) === (typeof opt === "string" ? opt : opt.name);'
);
// Replace handleVariationSelect(v.name, opt, optIdx)
pdpCode = pdpCode.replace(
  'handleVariationSelect(v.name, opt, optIdx)',
  'handleVariationSelect(v.name, typeof opt === "string" ? opt : opt.name, optIdx)'
);
// Replace {opt} in ReactNode
pdpCode = pdpCode.replace(
  '<span>{opt}</span>',
  '<span>{typeof opt === "string" ? opt : opt.name}</span>'
);

fs.writeFileSync('src/views/ProductDetailPage.tsx', pdpCode);
console.log('Fixed TS errors in components');

