const fs = require('fs');

let code = fs.readFileSync('src/views/AdminManagePage.tsx', 'utf8');

// 1. Add hideLayout to interface
code = code.replace(
  'export interface AdminManagePageProps {',
  'export interface AdminManagePageProps {\n  hideLayout?: boolean;'
);

// 2. Add hideLayout to destructured props
code = code.replace(
  '  productId,\n}) => {',
  '  productId,\n  hideLayout = false,\n}) => {'
);

// 3. We want to skip Auth Gatekeeper if hideLayout is true because the outer Layout will handle it.
code = code.replace(
  'if (!isAuthorizedAdmin) {',
  'if (!isAuthorizedAdmin && !hideLayout) {'
);

code = code.replace(
  'if (!isAuthenticated) {',
  'if (!isAuthenticated && !hideLayout) {'
);

// 4. In the return statement, if hideLayout is true, return only the <main> part.
// We need to inject a conditional return right before `return (` of the layout.
const layoutReturnIdx = code.indexOf('return (\n    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-800 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">');

if (layoutReturnIdx > -1) {
  // We need to extract the JSX from `<main className="flex-1 overflow-y-auto...` to the end.
  // Wait, the main tag is closed before the end of the file, then there's UserModal, BannerModal, etc.
  // So if hideLayout is true, we should return the main tag AND the modals.
  
  const mainStart = code.indexOf('<main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">');
  const mainEndStr = '</div>\n    </div>\n  );\n};'; // End of the component
  const componentEndIdx = code.lastIndexOf(mainEndStr);
  
  if (mainStart > -1 && componentEndIdx > -1) {
    const mainContent = code.substring(mainStart, componentEndIdx);
    
    const conditionalReturn = `
  if (hideLayout) {
    return (
      <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-800 flex flex-col">
        ${mainContent}
      </div>
    );
  }
`;
    // Insert conditional return before the main layout return
    code = code.substring(0, layoutReturnIdx) + conditionalReturn + code.substring(layoutReturnIdx);
  }
}

fs.writeFileSync('src/views/AdminManagePage.tsx', code);
console.log('Successfully patched AdminManagePage.tsx');
