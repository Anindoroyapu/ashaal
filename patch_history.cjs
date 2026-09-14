const fs = require('fs');
let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');

// handleOpenAddProduct
code = code.replace(
  /setActiveRoute\("product-new"\);/g,
  'setActiveRoute("product-new");\n    if (typeof window !== "undefined") window.history.pushState(null, "", "/manage/products/new");'
);

// handleOpenEditProduct
code = code.replace(
  /setActiveRoute\("product-edit"\);/g,
  'setActiveRoute("product-edit");\n    if (typeof window !== "undefined" && p?.id) window.history.pushState(null, "", `/manage/products/${p.id}`);'
);

// back to products list
code = code.replace(
  /setActiveRoute\("products"\)/g,
  '{ setActiveRoute("products"); if (typeof window !== "undefined") window.history.pushState(null, "", "/manage/products"); }'
);

// What if the user hits browser back button? 
// We can add a useEffect to listen to popstate, but just updating the URL solves the "reload" issue.

fs.writeFileSync('src/views/AdminManagePage.tsx', code);
console.log('Patched history.pushState');

