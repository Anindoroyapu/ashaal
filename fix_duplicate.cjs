const fs = require('fs');
let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');

// Find the duplicate block
const handlerStart = '  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);';
const firstIndex = code.indexOf(handlerStart);
const secondIndex = code.indexOf(handlerStart, firstIndex + 1);

if (secondIndex > -1) {
  // It's defined twice! Let's slice out the second one.
  // We need to find the end of the handleFileUpload function
  const endOfHandler = code.indexOf('};', secondIndex + 100) + 2;
  const before = code.substring(0, secondIndex);
  const after = code.substring(endOfHandler);
  
  // also need to remove 'const [isSavingProduct...' which was also duplicated if we matched it again? No, we replaced it with itself + handler, so 'isSavingProduct' is NOT duplicated, only the handler is!
  // Wait! In patch_uploads2.cjs:
  /*
  code = code.replace(
  'const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);',
  'const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);\n' + handlerCode
  );
  */
  // Because it only replaces the FIRST occurrence.
  code = before + after;
  fs.writeFileSync('src/views/AdminManagePage.tsx', code);
  console.log('Removed duplicate handler');
} else {
  console.log('No duplicate found');
}

