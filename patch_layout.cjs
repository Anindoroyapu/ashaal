const fs = require('fs');

let code = fs.readFileSync('src/components/manage/ManageLayoutClient.tsx', 'utf8');

// Add useRouter import
code = code.replace(
  'import React, { useState, useMemo, useEffect } from "react";',
  'import React, { useState, useMemo, useEffect } from "react";\nimport { useRouter, usePathname } from "next/navigation";'
);

// Change signature
code = code.replace(
  'export const AdminManagePage: React.FC<AdminManagePageProps> = ({',
  'export const ManageLayoutClient = ({ children }: { children: React.ReactNode }) => {\n  const router = useRouter();\n  const pathname = usePathname();\n  /* '
);

// We want to comment out the original setActiveRoute state
code = code.replace(
  'const [activeRoute, setActiveRoute] = useState<NavRoute>(initialRoute);',
  `
  let activeRoute = "dashboard";
  if (pathname.includes("/manage/products")) activeRoute = "products";
  if (pathname.includes("/manage/orders")) activeRoute = "orders";
  if (pathname.includes("/manage/orders/placed")) activeRoute = "orders-placed";
  if (pathname.includes("/manage/orders/processing")) activeRoute = "orders-processing";
  if (pathname.includes("/manage/orders/shipped")) activeRoute = "orders-shipped";
  if (pathname.includes("/manage/orders/delivered")) activeRoute = "orders-delivered";
  if (pathname.includes("/manage/orders/cancelled")) activeRoute = "orders-cancelled";
  if (pathname.includes("/manage/users")) activeRoute = "users";
  if (pathname.includes("/manage/banners")) activeRoute = "banners";
  if (pathname.includes("/manage/visitors")) activeRoute = "visitors";
  if (pathname.includes("/manage/api-docs")) activeRoute = "api-docs";

  const setActiveRoute = (route) => {
    if (route === "dashboard") router.push("/manage");
    else if (route === "orders") router.push("/manage/orders");
    else if (route.startsWith("orders-")) router.push("/manage/orders/" + route.split("-")[1]);
    else router.push("/manage/" + route);
  };
  `
);

// Now, replace the ENTIRE <main> section with just <main className="flex-1...">{children}</main>
// Since we added conditional return for hideLayout in AdminManagePage before copying, we should remove it here.
const layoutReturnIdx = code.indexOf('return (\n    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-800 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">');

if (layoutReturnIdx > -1) {
  // First, find the conditional return we added and REMOVE it.
  const conditionalReturnStr = 'if (hideLayout) {';
  const conditionalReturnIdx = code.lastIndexOf(conditionalReturnStr, layoutReturnIdx);
  if(conditionalReturnIdx > -1) {
    code = code.substring(0, conditionalReturnIdx) + code.substring(layoutReturnIdx);
  }
}

// Now replace main block
const mainStart = code.indexOf('<main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">');
const mainEndStr = '</main>';
const mainEndIdx = code.indexOf(mainEndStr, mainStart);

if (mainStart > -1 && mainEndIdx > -1) {
  const replacement = '<main className="flex-1 overflow-y-auto h-screen bg-[#f8fafc]">\n          {children}\n        </main>';
  
  // also, the modals are after </main> but before </div></div>
  // we can just strip them because AdminManagePage will render them inside the children
  const endOfComponent = code.lastIndexOf('</div>\n    </div>\n  );\n};');
  if(endOfComponent > -1) {
      code = code.substring(0, mainStart) + replacement + '\n      </div>\n    </div>\n  );\n};';
  } else {
      // Just in case
      code = code.substring(0, mainStart) + replacement + code.substring(mainEndIdx + mainEndStr.length);
  }
}

fs.writeFileSync('src/components/manage/ManageLayoutClient.tsx', code);
console.log('Successfully patched ManageLayoutClient.tsx');

