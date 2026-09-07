import { Suspense } from "react";
import { SearchListingPage } from "@/views/SearchListingPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-8 text-center text-sm text-gray-500">
          Loading search...
        </div>
      }
    >
      <SearchListingPage />
    </Suspense>
  );
}
