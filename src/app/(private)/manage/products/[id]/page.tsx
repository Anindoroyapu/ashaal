import { AdminManagePage } from '@/views/AdminManagePage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminManagePage hideLayout={true} initialRoute="product-edit" productId={id} />;
}
