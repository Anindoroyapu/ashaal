import React from "react";
import { AppLayoutClient } from "@/components/AppLayoutClient";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <AppLayoutClient>{children}</AppLayoutClient>;
}
