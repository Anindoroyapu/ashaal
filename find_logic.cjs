const fs = require('fs');
const code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');
const lines = code.split('\n');

const contentStart = lines.findIndex(l => l.includes('case "dashboard":') || l.includes('if (initialRoute ===') || l.includes('renderContent'));
console.log('Found route logic around line:', contentStart);
console.log(lines.slice(contentStart - 20, contentStart + 20).join('\n'));

