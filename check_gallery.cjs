const fs = require('fs');
let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');
const lines = code.split('\n');
const idx = lines.findIndex(l => l.includes('value={newGalleryImageUrl}'));
console.log(lines.slice(idx - 3, idx + 3).join('\n'));

