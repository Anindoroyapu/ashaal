const fs = require('fs');
const path = require('path');

const managePagePath = path.join(__dirname, 'src/views/AdminManagePage.tsx');
let content = fs.readFileSync(managePagePath, 'utf8');

console.log("File loaded, length:", content.length);

