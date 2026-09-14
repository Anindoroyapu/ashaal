const fs = require('fs');
let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');

// replace <header ...> to </header>
code = code.replace(/(<header className="h-16[\s\S]*?<\/header>)/, '{!hideLayout && ($1)}');

// replace <aside ...> to </aside>
code = code.replace(/(<aside[\s\S]*?<\/aside>)/, '{!hideLayout && ($1)}');

fs.writeFileSync('src/views/AdminManagePage.tsx', code);
console.log('Fixed double layout!');

