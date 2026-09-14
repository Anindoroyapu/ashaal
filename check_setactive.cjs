const fs = require('fs');
const lines = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('setActiveRoute(') && l.includes('products')) {
    console.log(i, l);
  }
});

