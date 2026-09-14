const fs = require('fs');
const code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');
const lines = code.split('\n');

const mainStart = lines.findIndex(l => l.includes('<main className="flex-1'));
if (mainStart > -1) {
  console.log(lines.slice(mainStart, mainStart + 150).join('\n'));
}

