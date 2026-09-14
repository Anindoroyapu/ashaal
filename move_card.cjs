const fs = require('fs');
let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');

const startIdx = code.indexOf('{/* CARD 3.5: Product Variations */}');
const endMarker = '{/* RIGHT SIDEBAR (4 COLS): Pricing, Inventory, Categorization, Badges */}';
const endIdx = code.indexOf(endMarker);

if (startIdx > -1 && endIdx > -1) {
  let card35Str = code.substring(startIdx, endIdx);
  
  // Clean up the code by removing CARD 3.5
  code = code.substring(0, startIdx) + code.substring(endIdx);
  
  // Now, before endMarker, there is `</div>\n                </div>\n              </div>`
  // We want to insert card35Str right before the LAST `</div>` of the left sidebar.
  
  // Find the exact string to replace
  const regex = /<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* RIGHT SIDEBAR \(4 COLS\)/;
  
  const replacement = `</div>\n                  </div>\n\n                  ${card35Str}\n                </div>\n\n                {/* RIGHT SIDEBAR (4 COLS)`;
  
  code = code.replace(regex, replacement);
  
  fs.writeFileSync('src/views/AdminManagePage.tsx', code);
  console.log('Successfully moved CARD 3.5');
} else {
  console.log('Could not find markers');
}

