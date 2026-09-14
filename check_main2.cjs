const fs = require('fs');
const code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');
const mainStart = code.indexOf('<main className="flex-1');
console.log(code.substring(mainStart, mainStart + 1500));

