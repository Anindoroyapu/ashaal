const fs = require('fs');
const pages = ['users', 'banners', 'visitors', 'api-docs'];
pages.forEach(p => {
  const dir = 'src/app/(private)/manage/' + p;
  if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dir + '/page.tsx', `import { AdminManagePage } from '@/views/AdminManagePage';

export default function Page() {
  return <AdminManagePage initialRoute="${p}" hideLayout={true} />;
}
`);
});
console.log('Created missing pages');
