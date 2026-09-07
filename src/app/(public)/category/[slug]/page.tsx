import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchListingPage } from '@/views/SearchListingPage';
import { generateCategoryMetadata } from '@/lib/productMetadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return generateCategoryMetadata(slug);
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-8 text-center text-sm text-gray-500">
          Loading category...
        </div>
      }
    >
      <SearchListingPage />
    </Suspense>
  );
}
