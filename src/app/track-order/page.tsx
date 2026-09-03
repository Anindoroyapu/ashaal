import { Suspense } from 'react';
import { TrackOrderPage } from '@/views/OrderConfirmationPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-8 text-center text-sm text-gray-500">Loading tracking...</div>}>
      <TrackOrderPage />
    </Suspense>
  );
}
