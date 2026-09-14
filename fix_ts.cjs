const fs = require('fs');
let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');

code = code.replace(
  'const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean) => {',
  'const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean) => {\n    if (!editingProduct) return;'
);

fs.writeFileSync('src/views/AdminManagePage.tsx', code);
console.log('Fixed TS error');

