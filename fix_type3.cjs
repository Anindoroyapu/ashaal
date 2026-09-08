const fs = require('fs');
let code = fs.readFileSync('src/components/manage/ManageLayoutClient.tsx', 'utf8');
code = code.replace(/const initialRoute = "dashboard";/g, 'let initialRoute: string = "dashboard";');
fs.writeFileSync('src/components/manage/ManageLayoutClient.tsx', code);
console.log('Fixed initialRoute type');
