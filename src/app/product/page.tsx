import type { Metadata } from 'next';
import { ProductDetailPage } from '@/views/ProductDetailPage';
import { generateProductMetadata } from '@/lib/productMetadata';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const id = (sp.id || sp.productId) as string;
  if (id) {
    return generateProductMetadata(id);
  }
  return {
    title: 'Products | Ashaal Bangladesh',
    description: 'Explore online shopping on Ashaal.com.bd',
  };
}

export default function Page() {
  return <ProductDetailPage />;
}
