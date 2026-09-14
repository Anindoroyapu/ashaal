const fs = require('fs');
const code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');
const lines = code.split('\n');

const regex = /activeRoute === "products"[\s\S]*?\(/g;
const matches = [...code.matchAll(regex)];

matches.forEach(m => {
  const idx = code.substring(0, m.index).split('\n').length;
  if(idx > 1500) {
     console.log('Match at line', idx);
     console.log(lines.slice(idx-2, idx+15).join('\n'));
  }
});

