const fs = require('fs');
let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');
const mainStart = code.indexOf('<main className="flex-1');
console.log(code.substring(mainStart, mainStart + 100));

