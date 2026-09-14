const fs = require('fs');
const lines = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8').split('\n');
console.log('343:', lines.slice(340, 348).join('\n'));
console.log('351:', lines.slice(350, 360).join('\n'));
console.log('373:', lines.slice(372, 382).join('\n'));
console.log('387:', lines.slice(385, 395).join('\n'));

