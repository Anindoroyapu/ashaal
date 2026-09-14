const fs = require('fs');
const code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');
const lines = code.split('\n');
const start = lines.findIndex(l => l.includes('activeRoute === "products"'));
console.log(lines.slice(start - 5, start + 20).join('\n'));

