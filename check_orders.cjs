const fs = require('fs');
const lines = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8').split('\n');
lines.forEach((l, i) => { 
  if (l.includes('activeRoute.startsWith("orders")') || l.includes('activeRoute.includes("orders")') || l.includes('activeRoute === "orders"')) {
    console.log(i, l.trim());
  } 
});

