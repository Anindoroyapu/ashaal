const fs = require('fs');
let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');

code = code.replace(
  'const input = e.currentTarget.previousElementSibling;',
  'const input = e.currentTarget.previousElementSibling as HTMLInputElement;'
);

code = code.replace(
  'handleAddVariationOption(vIdx, input.value);\n                                input.value = \'\';',
  'if (input) {\n                                  handleAddVariationOption(vIdx, input.value);\n                                  input.value = \'\';\n                                }'
);

fs.writeFileSync('src/views/AdminManagePage.tsx', code);
console.log('Fixed TS error');

