const fs = require('fs');
let code = fs.readFileSync('src/components/manage/ManageLayoutClient.tsx', 'utf8');

// 1. imports
code = code.replace(
  'import React, { useState, useMemo, useEffect } from "react";',
  'import React, { useState, useMemo, useEffect } from "react";\nimport { useRouter, usePathname } from "next/navigation";'
);

// 2. signature
const sigStart = code.indexOf('export const AdminManagePage: React.FC<AdminManagePageProps> = ({');
const sigEnd = code.indexOf('}) => {', sigStart);
if (sigStart > -1 && sigEnd > -1) {
  const newSig = 'export const ManageLayoutClient = ({ children }: { children: React.ReactNode }) => {\n  const router = useRouter();\n  const pathname = usePathname();\n  const hideLayout = false;\n  const initialRoute = "dashboard";\n  const productId = null;\n';
  code = code.substring(0, sigStart) + newSig + code.substring(sigEnd + 7);
}

// 3. activeRoute logic
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

// 4. Replace main block with {children}
const mainStart = code.indexOf('<main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">');
const mainEnd = code.indexOf('</main>', mainStart);
if (mainStart > -1 && mainEnd > -1) {
  code = code.substring(0, mainStart) + '<main className="flex-1 overflow-y-auto h-screen bg-[#f8fafc]">\n          {children}\n        </main>' + code.substring(mainEnd + 7);
}

// 5. Remove conditional return for hideLayout we added in AdminManagePage
code = code.replace('if (!isAuthorizedAdmin && !hideLayout) {', 'if (!isAuthorizedAdmin) {');
code = code.replace('if (!isAuthenticated && !hideLayout) {', 'if (!isAuthenticated) {');

const layoutRetStart = code.indexOf('if (hideLayout) {');
if(layoutRetStart > -1) {
    // delete lines from if(hideLayout) to }
    const layoutRetEnd = code.indexOf('return (', layoutRetStart + 50); // find the next return
    if(layoutRetEnd > -1) {
        code = code.substring(0, layoutRetStart) + code.substring(layoutRetEnd);
    }
}

fs.writeFileSync('src/components/manage/ManageLayoutClient.tsx', code);
console.log('Fixed ManageLayoutClient');
