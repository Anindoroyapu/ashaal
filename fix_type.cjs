const fs = require('fs');
let code = fs.readFileSync('src/components/manage/ManageLayoutClient.tsx', 'utf8');
code = code.replace(
  'let activeRoute = "dashboard";',
  'let activeRoute: string = "dashboard";'
);
fs.writeFileSync('src/components/manage/ManageLayoutClient.tsx', code);
