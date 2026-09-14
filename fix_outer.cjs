const fs = require('fs');
let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');

const originalClass = 'className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-800 flex flex-col selection:bg-emerald-100 selection:text-emerald-900"';
const newClass = 'className={hideLayout ? "flex-1 flex flex-col h-full w-full" : "min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-800 flex flex-col selection:bg-emerald-100 selection:text-emerald-900"}';

code = code.replace(originalClass, newClass);

fs.writeFileSync('src/views/AdminManagePage.tsx', code);
console.log('Fixed outer div class!');

