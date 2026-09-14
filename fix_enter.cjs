const fs = require('fs');
let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');

// We add onKeyDown to all inputs inside the variations block to prevent accidental form submission
code = code.replace(
  'onChange={(e) => handleUpdateVariationName(vIdx, e.target.value)}',
  'onChange={(e) => handleUpdateVariationName(vIdx, e.target.value)}\n                              onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}'
);

code = code.replace(
  'onChange={(e) => handleUpdateVariationOption(vIdx, oIdx, \'name\', e.target.value)}',
  'onChange={(e) => handleUpdateVariationOption(vIdx, oIdx, \'name\', e.target.value)}\n                                    onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}'
);

code = code.replace(
  'onChange={(e) => handleUpdateVariationOption(vIdx, oIdx, \'price\', e.target.value ? Number(e.target.value) : undefined)}',
  'onChange={(e) => handleUpdateVariationOption(vIdx, oIdx, \'price\', e.target.value ? Number(e.target.value) : undefined)}\n                                    onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}'
);

code = code.replace(
  'onChange={(e) => handleUpdateVariationOption(vIdx, oIdx, \'stock\', e.target.value ? Number(e.target.value) : undefined)}',
  'onChange={(e) => handleUpdateVariationOption(vIdx, oIdx, \'stock\', e.target.value ? Number(e.target.value) : undefined)}\n                                    onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}'
);

fs.writeFileSync('src/views/AdminManagePage.tsx', code);
console.log('Added onKeyDown interceptors');

