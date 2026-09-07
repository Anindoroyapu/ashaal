import React from "react";
import { ManageLayoutClient } from "@/components/manage/ManageLayoutClient";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <ManageLayoutClient>{children}</ManageLayoutClient>;
}
