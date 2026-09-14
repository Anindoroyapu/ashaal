const fs = require('fs');
let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');
const layoutReturnIdx = code.indexOf('return (\n    <div className="min-h-screen');
console.log(code.substring(layoutReturnIdx - 200, layoutReturnIdx + 200));

