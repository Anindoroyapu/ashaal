const fs = require('fs');
let code = fs.readFileSync('src/components/manage/ManageLayoutClient.tsx', 'utf8');
const mainStart = code.indexOf('<main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">');
if (mainStart > -1) {
  const mainEndIdx = code.indexOf('</main>', mainStart);
  if (mainEndIdx > -1) {
    code = code.substring(0, mainStart) + '<main className="flex-1 overflow-y-auto h-screen bg-[#f8fafc]">\n          {children}\n        </main>' + code.substring(mainEndIdx + 7);
    fs.writeFileSync('src/components/manage/ManageLayoutClient.tsx', code);
    console.log('Successfully replaced main block with children');
  } else {
    console.log('Could not find </main>');
  }
} else {
  console.log('Could not find main start tag');
}
