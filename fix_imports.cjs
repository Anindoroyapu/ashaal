const fs = require('fs');
let code = fs.readFileSync('src/components/manage/ManageLayoutClient.tsx', 'utf8');

code = code.replace(/from "\.\.\/context/g, 'from "@/context');
code = code.replace(/from "\.\.\/types/g, 'from "@/types');
code = code.replace(/from "\.\.\/data/g, 'from "@/data');
code = code.replace(/from "\.\.\/services/g, 'from "@/services');
code = code.replace(/from "\.\.\/components/g, 'from "@/components');

fs.writeFileSync('src/components/manage/ManageLayoutClient.tsx', code);
console.log('Fixed imports');
