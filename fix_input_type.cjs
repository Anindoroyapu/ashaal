const fs = require('fs');
let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');

let changed = false;
if (code.includes('type="url"\n                              value={editingProduct.mainImage || ""}')) {
    code = code.replace('type="url"\n                              value={editingProduct.mainImage || ""}', 'type="text"\n                              value={editingProduct.mainImage || ""}');
    changed = true;
} else if (code.includes('type="url" value={editingProduct.mainImage')) {
    // If it was already on one line
}

// I will just use regex to be safe
code = code.replace(/<input\s+type="url"\s+value={editingProduct\.mainImage/g, '<input type="text" value={editingProduct.mainImage');
code = code.replace(/<input\s+type="url"\s+value={newGalleryImageUrl}/g, '<input type="text" value={newGalleryImageUrl}');

fs.writeFileSync('src/views/AdminManagePage.tsx', code);
console.log('Fixed input types');

