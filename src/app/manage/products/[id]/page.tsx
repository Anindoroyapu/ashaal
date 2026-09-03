import { AdminManagePage } from '@/views/AdminManagePage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminManagePage initialRoute="product-edit" productId={id} />;
}
