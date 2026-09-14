const fs = require('fs');
const lines = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8').split('\n');
const start = lines.findIndex(l => l.includes('(activeRoute === "product-new" || activeRoute === "product-edit")'));
console.log(lines.slice(start - 2, start + 10).join('\n'));

