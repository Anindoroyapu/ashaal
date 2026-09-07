import type { Metadata } from 'next';
import { ProductDetailPage } from '@/views/ProductDetailPage';
import { generateProductMetadata, getProductFromDb } from '@/lib/productMetadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return generateProductMetadata(id);
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductFromDb(id);

  const productJsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: [
          product.mainImage,
          ...(Array.isArray(product.images) ? product.images : []),
        ].filter(Boolean),
        description: product.description || product.title,
        sku: product.id,
        brand: {
          '@type': 'Brand',
          name: product.brand || 'Ashaal',
        },
        offers: {
          '@type': 'Offer',
          url: `https://ashaal.com.bd/products/${product.slug || product.id}`,
          priceCurrency: 'BDT',
          price: product.price,
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: product.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'Ashaal Bangladesh',
          },
        },
      }
    : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <ProductDetailPage />
    </>
  );
}
